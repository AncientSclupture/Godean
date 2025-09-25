/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";

import farmMap from "../tile-asset/base_game.json";
import tilesetSpring from "../tile-asset/Tileset-Spring.png";
import houseTiles from "../tile-asset/House.png";
import fenceTiles from "../tile-asset/Fences-copiar.png";
import idleSheet from "../tile-asset/Idle.png";
import walkSheet from "../tile-asset/Walk.png";

export default class FarmScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private keys!: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super("FarmScene");
  }

  preload() {
    // Tilemap JSON
    this.load.tilemapTiledJSON("farmmap", farmMap);

    // Tilesets
    this.load.image("Tileset Spring", tilesetSpring);
    this.load.image("House", houseTiles);
    this.load.image("Fence's copiar", fenceTiles);

    // Player spritesheets
    this.load.spritesheet("player-idle", idleSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-walk", walkSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    // 🔑 Fullscreen toggle (tekan F)
    this.input.keyboard!.on("keydown-F", () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });

    // WASD setup
    this.keys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as any;

    // optional: info kecil di pojok
    this.add.text(10, 10, "Press F for Fullscreen", {
      font: "16px Arial",
      color: "#ffffff",
    });

    // Map setup
    const map = this.make.tilemap({ key: "farmmap" });
    const tilesSpring = map.addTilesetImage("Tileset Spring", "Tileset Spring");
    const houseTiles = map.addTilesetImage("House", "House");
    const fenceTiles = map.addTilesetImage("Fence's copiar", "Fence's copiar");

    if (!houseTiles || !fenceTiles || !tilesSpring) {
      throw Error("Terjadi Error karena gagal load asset");
    }

    map.createLayer("ground layer", tilesSpring, 0, 0);

    // layer rumah + pagar (di Tiled kamu memang pakai layer yang sama)
    const houseLayer = map.createLayer(
      "house layer",
      [houseTiles, fenceTiles],
      0,
      0
    );

    if (!houseLayer) {
      throw Error("Gagal load house layer");
    }

    houseLayer.setCollisionByProperty({ collides: true });
    
    // Debug outline untuk collision tiles
    // const debugGraphics = this.add.graphics().setAlpha(0.7);
    // houseLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // tile biasa transparan
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // oranye
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // garis border
    // });

    // Player
    this.player = this.physics.add.sprite(100, 100, "player-idle", 0);
    this.physics.add.collider(this.player, houseLayer);

    // Camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Animasi IDLE
    this.anims.create({
      key: "idle-down",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 0,
        end: 3,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "idle-left",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 4,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "idle-right",
      frames: this.anims.generateFrameNumbers("player-idle", {
        start: 8,
        end: 11,
      }),
      frameRate: 5,
      repeat: -1,
    });

    // Animasi WALK
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
        start: 6,
        end: 11,
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
  }

  update() {
    const speed = 300;
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
    } else {
      const currentAnim = this.player.anims.currentAnim?.key;
      if (currentAnim?.includes("left"))
        this.player.anims.play("idle-left", true);
      else if (currentAnim?.includes("right"))
        this.player.anims.play("idle-right", true);
      else if (currentAnim?.includes("up"))
        this.player.anims.play("idle-up", true);
      else this.player.anims.play("idle-down", true);
    }
  }
}
