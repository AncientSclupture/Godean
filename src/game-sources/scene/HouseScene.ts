/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

import houseMap from "../tile-asset/housemaps.json";
import tilesetSpring from "../tile-asset/Tileset-Spring.png";
import idleSheet from "../tile-asset/Idle.png";
import interiorTiles from "../tile-asset/Interior.png";
import walkSheet from "../tile-asset/Walk.png";

export default class HouseScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};
  private keys!: any;
  private socket!: Socket;
  private roomId = "house";
  private userId!: string;
  private onGateway: boolean = false;
  private initialXSpawnPosition = 32;
  private initialYSpawnPosition = 173;

  constructor() {
    super("HouseScene");
  }

  preload() {
    this.load.tilemapTiledJSON("housemap", houseMap);
    this.load.image("Tileset Spring", tilesetSpring);
    this.load.image("Interior", interiorTiles);

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
    console.log("Scene init home scene data:", data);
    this.userId = data.accountId;
    this.onGateway = false;
  }

  create() {
    if (!this.userId) {
      console.error("accountId kosong, tidak join ke room");
      return;
    }

    // socket
    this.socket = io("https://godean-game-server.grayhill-39d1a131.southeastasia.azurecontainerapps.io/");
    const userId = this.userId;
    this.socket.emit(`join:${this.roomId}`, userId);

    this.socket.on(`listenupdate:${this.roomId}`, (state) => {
      this.initialXSpawnPosition = state[userId].x ?? this.initialXSpawnPosition;
      this.initialYSpawnPosition = state[userId].y ?? this.initialYSpawnPosition;
      this.syncPlayers(state);
    });
    this.socket.on(`update:${this.roomId}`, (state) => {
      this.initialXSpawnPosition = state[userId].x ?? this.initialXSpawnPosition;
      this.initialYSpawnPosition = state[userId].y ?? this.initialYSpawnPosition;
      this.syncPlayers(state);
    });

    // Input setup
    this.keys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    const map = this.make.tilemap({ key: "housemap" });
    const tilesSpring = map.addTilesetImage("Tileset Spring", "Tileset Spring");
    const interiorTiles = map.addTilesetImage("Interior", "Interior");

    map.createLayer("ground", tilesSpring!, 0, 0);
    const uppergroundLayer = map.createLayer(
      "upperground",
      interiorTiles!,
      0,
      0
    );
    uppergroundLayer!.setCollisionByProperty({ collides: true });

    this.player = this.physics.add.sprite(this.initialXSpawnPosition, this.initialYSpawnPosition, "player-idle", 0);
    // untuk ganti scene boy
    this.physics.add.collider(
      this.player,
      uppergroundLayer!,
      (_player, tile: any) => {
        if (tile?.properties?.gateway) {
          this.onGateway = true;
          console.log(">> Gateway aktif");
        } else {
          this.onGateway = false;
        }
      }
    );

    // fitting pov to house map
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // hardcode bos karena gw yang buat map gw kecilin (scale = 1/4)
    this.cameras.main.setZoom(4);

    // f on fullscren
    const keyF = this.input.keyboard!.addKey("F");
    keyF.on("down", () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });

    // walk animations
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
      this.scene.start("PlayScene", { accountId: this.userId });
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
