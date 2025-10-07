/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

import hsnMap from "../tile-asset/hsn.json";
import tilesetSpring from "../tile-asset/Tileset-Spring.png";
import mapleTreeTiles from "../tile-asset/Maple Tree.png";
import idleSheet from "../tile-asset/Idle.png";
import walkSheet from "../tile-asset/Walk.png";
import chickenSheet from "../tile-asset/Chicken Red.png";

export default class HideAndSeekScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};
  private keys!: any;
  private socket!: Socket;
  private roomId = "hns";
  private userId!: string;
  private initialXSpawnPosition = 243;
  private initialYSpawnPosition = 310;
  private chickenbot!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("HideAndSeekScene");
  }

  preload() {
    this.load.tilemapTiledJSON("hsnMap", hsnMap);
    this.load.image("Tileset Spring", tilesetSpring);
    this.load.image("Maple Tree", mapleTreeTiles);
    this.load.image("Idle", idleSheet);

    this.load.spritesheet("player-idle", idleSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-walk", walkSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("object-walk", chickenSheet, {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  init(data: { accountId: string }) {
    console.log("Scene init data:", data);
    this.userId = data.accountId;
  }

  create() {
    if (!this.userId) {
      console.error("accountId kosong, tidak join ke room");
      return;
    }

    this.socket = io("https://godean-game-server.grayhill-39d1a131.southeastasia.azurecontainerapps.io/");
    const userId = this.userId;
    this.socket.emit(`join:${this.roomId}`, userId);

    this.socket.on(`listenupdate:${this.roomId}`, (state) => {
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

    // Input setup
    this.keys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    const keyF = this.input.keyboard!.addKey("F");
    keyF.on("down", () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });

    const map = this.make.tilemap({ key: "hsnMap" });
    const tilesSpring = map.addTilesetImage("Tileset Spring", "Tileset Spring");
    const mapleTreeTiles = map.addTilesetImage("Maple Tree", "Maple Tree");
    map.createLayer("ground", tilesSpring!, 0, 0);
    const obstacleLayer = map.createLayer("obstacle", mapleTreeTiles!, 0, 0);
    obstacleLayer!.setCollisionByProperty({ collides: true });

    // Player lokal
    this.player = this.physics.add.sprite(
      this.initialXSpawnPosition,
      this.initialYSpawnPosition,
      "player-idle",
      0
    );

    this.chickenbot = this.physics.add.sprite(300, 400, "object-walk", 0);

    this.physics.add.collider([this.player, this.chickenbot], obstacleLayer!);
    this.chickenbot.setData("catchable", true);

    this.physics.add.collider(
      this.player,
      this.chickenbot,
      (_playerObj, chickenObj) => {
        const chicken = chickenObj as Phaser.GameObjects.Sprite;
        console.log(">> Bertabrakan dengan chickenbot");
        console.log(chicken.getData("catchable"));
      }
    );
    this.chickenbot.setCollideWorldBounds(true); // Biar ga keluar map

    this.time.addEvent({
      delay: 1000, // tiap 2 detik ganti arah
      loop: true,
      callback: () => {
        const speed = 80;
        const dirX = Phaser.Math.Between(-2, 2);
        const dirY = Phaser.Math.Between(-3, 3);

        this.chickenbot.setVelocity(dirX * speed, dirY * speed);

        // Set animasi kalau bergerak
        if (dirX !== 0 || dirY !== 0) {
          this.chickenbot.anims.play("chicken-walk", true);
          this.chickenbot.flipX = dirX < 0;
        } else {
          this.chickenbot.anims.stop();
        }
      },
    });

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

    this.anims.create({
      key: "chicken-walk",
      frames: this.anims.generateFrameNumbers("object-walk", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
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
