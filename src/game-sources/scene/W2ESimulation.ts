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

export default class W2EScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};
  private keys!: any;
  private socket!: Socket;
  private roomId = "w2e";
  private userId!: string;
  private onGateway: boolean = false;

  constructor() {
    super("W2EScene");
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

  init(data: { accountId: string }) {
    console.log("Scene init w2e scene data:", data);
    this.userId = data.accountId;
    this.onGateway = false;
  }

  create() {
    if (!this.userId) {
      console.error("accountId kosong, tidak join ke room");
      return;
    }

    this.socket = io("http://localhost:7890");
    const userId = this.userId;
    this.socket.emit(`join:${this.roomId}`, userId);

    this.socket.on(`listenupdate:${this.roomId}`, (state) => {
      console.log(state);
      this.syncPlayers(state);
    });
    this.socket.on(`update:${this.roomId}`, (state) => {
      this.syncPlayers(state);
    });

    // Input setup
    this.keys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
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
    map.createLayer("upperground", tilesSpring!, 0, 0);
    const objectLayer = map.createLayer(
      "object",
      [houseTiles!, fenceTiles!, hustlerTiles!, femaleCowTiles!],
      0,
      0
    );
    objectLayer!.setCollisionByProperty({ collides: true });

    // Player lokal
    this.player = this.physics.add.sprite(956, 533, "player-idle", 0);
    this.physics.add.collider(
      this.player,
      objectLayer!,
      (_player, tile: any) => {
        if (tile?.properties?.gateway) {
          this.onGateway = true;
          console.log(">> Gateway aktif");
        } else {
          this.onGateway = false;
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
    }

    const userId = this.userId;
    const player = this.player;
    this.socket.emit(`update:${this.roomId}`, {
      userId,
      x: player.x,
      y: player.y,
    });

    // buat ganti scene
    const space = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    if (Phaser.Input.Keyboard.JustDown(space) && this.onGateway) {
      this.scene.start("HouseScene", { accountId: this.userId });
    }
  }

  private syncPlayers(state: { [id: string]: { x: number; y: number } }) {
    for (const id in state) {
      if (id === this.userId || !id || id === null) {
        continue;
      }

      if (!this.otherPlayers[id]) {
        this.otherPlayers[id] = this.physics.add.sprite(
          state[id].x,
          state[id].y,
          "player-idle",
          0
        );
      } else {
        this.otherPlayers[id].setPosition(state[id].x, state[id].y);
      }
    }

    for (const id in this.otherPlayers) {
      if (!state[id]) {
        this.otherPlayers[id].destroy();
        delete this.otherPlayers[id];
      }
    }
  }
}
