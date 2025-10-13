/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

import w2emap from "../tile-asset/w2e-simulation.json";
import tilesetSpring from "../tile-asset/Tileset-Spring.png";
import idleSheet from "../tile-asset/Idle.png";
import houseTiles from "../tile-asset/House.png";
import fenceTiles from "../tile-asset/Fences-copiar.png";
import walkSheet from "../tile-asset/Walk.png";
import femaleCowTiles from "../tile-asset/Female Cow Brown.png";

export default class FiSimScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private otherPlayers: {
    [id: string]: {
      sprite: Phaser.Physics.Arcade.Sprite;
      label: Phaser.GameObjects.Text;
    };
  } = {};
  private keys!: any;
  private socket!: Socket;
  private roomId = "w2e";
  private userId!: string;
  private userAlias!: string;
  private onGateway: boolean = false;
  private initialXSpawnPosition = 956;
  private initialYSpawnPosition = 533;
  private playerMark!: Phaser.GameObjects.Text;
  private chatBg!: Phaser.GameObjects.Graphics;
  private chatText!: Phaser.GameObjects.Text;
  private chatBox!: Phaser.GameObjects.Container;

  constructor() {
    super("FiSimScene");
  }

  preload() {
    this.load.tilemapTiledJSON("w2emap", w2emap);
    this.load.image("Tileset Spring", tilesetSpring);
    this.load.image("House", houseTiles);
    this.load.image("Fence's copiar", fenceTiles);
    this.load.image("Idle", idleSheet);
    this.load.image("Female Cow Brown", femaleCowTiles);

    this.load.spritesheet("player-idle", idleSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-walk", walkSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  init(data: { accountId: string; alias: string }) {
    console.log("Scene init w2e scene data:", data);
    this.userId = data.accountId;
    this.userAlias = data.alias;
    this.onGateway = false;
  }

  create() {
    if (!this.userId) {
      console.error("accountId kosong, tidak join ke room");
      return;
    }

    this.socket = io(
      "https://godean-game-server.grayhill-39d1a131.southeastasia.azurecontainerapps.io/"
    );
    const userId = this.userId;
    this.socket.emit(`join:${this.roomId}`, userId);

    this.socket.on(`listenupdate:${this.roomId}`, (state) => {
      console.log(state);
      this.initialXSpawnPosition =
        state[userId].x ?? this.initialXSpawnPosition;
      this.initialYSpawnPosition =
        state[userId].y ?? this.initialYSpawnPosition;
      this.syncPlayers(state);
    });
    this.socket.on(`update:${this.roomId}`, (state) => {
      this.initialXSpawnPosition =
        state[userId].x ?? this.initialXSpawnPosition;
      this.initialYSpawnPosition =
        state[userId].y ?? this.initialYSpawnPosition;
      this.syncPlayers(state);
    });

    this.chatBg = this.add.graphics();
    this.chatBg.fillStyle(0x000000, 0.7);
    this.chatBg.fillRoundedRect(50, 400, 700, 100, 10);
    this.chatText = this.add.text(70, 420, "", {
      fontSize: "10px",
      color: "#ffffff",
      wordWrap: { width: 660 },
    });
    this.chatBox = this.add.container(0, 0, [this.chatBg, this.chatText]);
    this.chatBox.setVisible(true);

    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("player-walk", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("player-walk", {
        start: 12,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player-walk", {
        start: 12,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("player-walk", {
        start: 6,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Input setup
    this.keys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    const keyF = this.input.keyboard!.addKey("F");

    const map = this.make.tilemap({ key: "w2emap" });
    const tilesSpring = map.addTilesetImage("Tileset Spring", "Tileset Spring");
    const houseTiles = map.addTilesetImage("House", "House");
    const fenceTiles = map.addTilesetImage("Fence's copiar", "Fence's copiar");
    const hustlerTiles = map.addTilesetImage("Idle", "Idle");
    const femaleCowTiles = map.addTilesetImage(
      "Female Cow Brown",
      "Female Cow Brown"
    );
    map.createLayer("ground", tilesSpring!, 0, 0);
    const objectLayer = map.createLayer(
      "object",
      [houseTiles!, fenceTiles!, hustlerTiles!, femaleCowTiles!],
      0,
      0
    );
    objectLayer!.setCollisionByProperty({ collides: true });

    // Player lokal
    this.player = this.physics.add.sprite(
      this.initialXSpawnPosition,
      this.initialYSpawnPosition,
      "player-idle",
      0
    );
    this.playerMark = this.add
      .text(this.player.x, this.player.y - 20, this.userAlias, {
        fontFamily: "Arial Black",
        fontSize: "8px",
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.3)",
        stroke: "#000",
        strokeThickness: 2,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#000",
          blur: 2,
          fill: true,
        },
      })
      .setOrigin(0.5);

    this.physics.add.collider(
      this.player,
      objectLayer!,
      (_player, tile: any) => {
        if (tile?.properties?.gateway) {
          this.onGateway = true;
          console.log("gaetway is active");
        } else {
          this.onGateway = false;
          console.log("gaetway is not active");
          // this.hideChat();
        }
      }
    );

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    keyF.on("down", () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    if (this.keys.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("walk-left", true);
    } else if (this.keys.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("walk-right", true);
    } else if (this.keys.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play("walk-up", true);
    } else if (this.keys.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play("walk-down", true);
    } else if (this.keys.space.isDown) {
      if (this.onGateway) {
        this.showChat("Halo petualang! Tekan [E] untuk bicara.");
      }
    }

    const userId = this.userId;
    const player = this.player;
    this.socket.emit(`update:${this.roomId}`, {
      userId,
      x: player.x,
      y: player.y,
    });
    this.playerMark.setPosition(player.x, player.y - 20);
  }

  private syncPlayers(state: { [id: string]: { x: number; y: number } }) {
    for (const id in state) {
      if (id === this.userId || !id) continue;

      const playerData = state[id];
      const existing = this.otherPlayers[id];

      if (!existing) {
        // 🔹 Tambahkan sprite
        const sprite = this.physics.add.sprite(
          playerData.x,
          playerData.y,
          "player-idle",
          0
        );

        // 🔹 Tambahkan teks label di atas kepala
        const label = this.add
          .text(playerData.x, playerData.y - 20, id, {
            fontFamily: '"Press Start 2P", monospace', // bisa ganti
            fontSize: "8px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3,
          })
          .setOrigin(0.5, 1);

        this.otherPlayers[id] = { sprite, label };
      } else {
        // 🔹 Update posisi sprite dan teks
        existing.sprite.setPosition(playerData.x, playerData.y);
        existing.label.setPosition(playerData.x, playerData.y - 20);
      }
    }

    // 🔹 Hapus player yang sudah tidak ada di state
    for (const id in this.otherPlayers) {
      if (!state[id]) {
        this.otherPlayers[id].sprite.destroy();
        this.otherPlayers[id].label.destroy();
        delete this.otherPlayers[id];
      }
    }
  }

  private showChat(text: string) {
    this.chatText.setText(text);
    this.chatBox.setVisible(true);
  }

  // private hideChat() {
  //   this.chatBox.setVisible(false);
  // }
}
