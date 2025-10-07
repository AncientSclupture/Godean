/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

import farmMap from "../tile-asset/base_game.json";
import tilesetSpring from "../tile-asset/Tileset-Spring.png";
import houseTiles from "../tile-asset/House.png";
import fenceTiles from "../tile-asset/Fences-copiar.png";
import idleSheet from "../tile-asset/Idle.png";
import walkSheet from "../tile-asset/Walk.png";
import mapleTreeTiles from "../tile-asset/Maple Tree.png";

export default class PlayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};
  private keys!: any;
  private socket!: Socket;
  private roomId = "p2e";
  private userId!: string;
  private onGateway: boolean = false;
  private onToW2E: boolean = false;
  private initialXSpawnPosition = 120;
  private initialYSpawnPosition = 670;

  constructor() {
    super("PlayScene");
  }

  preload() {
    this.load.tilemapTiledJSON("farmmap", farmMap);
    this.load.image("Tileset Spring", tilesetSpring);
    this.load.image("House", houseTiles);
    this.load.image("Fence's copiar", fenceTiles);
    this.load.image("Idle", idleSheet);
    this.load.image("Maple Tree", mapleTreeTiles);

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
    console.log("Scene init data:", data);
    this.userId = data.accountId;
    this.onGateway = false;
    this.onToW2E = false;
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
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    const keyF = this.input.keyboard!.addKey("F");

    const map = this.make.tilemap({ key: "farmmap" });
    const tilesSpring = map.addTilesetImage("Tileset Spring", "Tileset Spring");
    const houseTiles = map.addTilesetImage("House", "House");
    const fenceTiles = map.addTilesetImage("Fence's copiar", "Fence's copiar");
    const hustlerTiles = map.addTilesetImage("Idle", "Idle");
    const mapleTreeTiles = map.addTilesetImage("Maple Tree", "Maple Tree");

    map.createLayer("ground layer", tilesSpring!, 0, 0);
    const houseLayer = map.createLayer(
      "house layer",
      [houseTiles!, fenceTiles!, hustlerTiles!, mapleTreeTiles!],
      0,
      0
    );
    houseLayer!.setCollisionByProperty({ collides: true });

    // Player lokal
    this.player = this.physics.add.sprite(this.initialXSpawnPosition, this.initialYSpawnPosition, "player-idle", 0);
    this.physics.add.collider(
      this.player,
      houseLayer!,
      (_player, tile: any) => {
        if (tile?.properties?.gateway) {
          this.onGateway = true;
          console.log(">> Gateway aktif");
        } else if (tile?.properties?.tow2e) {
          this.onToW2E = true;
          console.log(">> ToW2E aktif");
        } else {
          this.onGateway = false;
          console.log(">> Gateway inaktif");
          this.onToW2E = false;
          console.log(">> ToW2E inaktif");
        }
      }
    );

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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
        this.scene.start("HouseScene", { accountId: this.userId });
      } else if (this.onToW2E) {
        this.scene.start("W2EScene", { accountId: this.userId });
      }
    }

    const userId = this.userId;
    const player = this.player;
    this.socket.emit(`update:${this.roomId}`, {
      userId,
      x: player.x,
      y: player.y,
    });
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
