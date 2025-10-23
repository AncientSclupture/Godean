/* eslint-disable @typescript-eslint/no-explicit-any */

import Phaser from "phaser";

import basemap from "../map-json/base-map.json";
import bridgewoodtilesetImage from "../asset-and-tileset/Bridge_Wood.png";
import clifftileImage from "../asset-and-tileset/Cliff_Tile.png";
import farmlandtileImage from "../asset-and-tileset/FarmLand_Tile.png";
import housewoodbasetileImage from "../asset-and-tileset/House_1_Wood_Base_Blue.png";
import pathtileImage from "../asset-and-tileset/Path_Tile.png";
import watertileImage from "../asset-and-tileset/Water_Tile.png";
import oaktreetileImage from "../asset-and-tileset/Oak_Tree.png";
import outdordecortileImage from "../asset-and-tileset/Outdoor_Decor_Free.png";

import playeractifitySpriteSheet from "../asset-and-tileset/Player.png";
import playerfarmingSpriteSheet from "../asset-and-tileset/Player_Actions.png";

export default class MainActifityScene extends Phaser.Scene {
  private keys!: any;
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerLabel!: Phaser.GameObjects.Text;
  private map!: Phaser.Tilemaps.Tilemap;
  private roadnhouselayer!: Phaser.Tilemaps.TilemapLayer;
  private grassnwaterlayer!: Phaser.Tilemaps.TilemapLayer;
  private summoninglayer!: Phaser.Tilemaps.TilemapLayer;
  private inventoryBar!: Phaser.GameObjects.Container;
  private inventorySlots: {
    name: string;
    sprite: Phaser.GameObjects.Sprite;
    border: Phaser.GameObjects.Graphics;
  }[] = [];
  private selectedPlant: "carrot" | "turnip" | "wheat" = "wheat";
  private showBar: "inventory" | "wallet" | "" = "";
  private farmOverlay!: Phaser.GameObjects.Graphics;
  private farmTreshHold: Map<string, number> = new Map();

  // private howtoDefineLayer!: Phaser.Tilemaps.TilemapLayer;

  private initialXSpawnPosition = 300;
  private initialYSpawnPosition = 320;
  private playerCurrentDirection: "left" | "right" | "front" | "back" = "front";
  private playerCurrentAcifity:
    | "mining"
    | "ngapak"
    | "nyekop"
    | "nyiram"
    | "atk" = "atk";

  constructor() {
    super("MainActifityScene");
  }

  init(data: { accountId: string }) {
    console.log("Scene init data:", data);
  }

  preload() {
    this.load.tilemapTiledJSON("basemap", basemap);
    this.load.image("Bridge_Wood", bridgewoodtilesetImage);
    this.load.image("Cliff_Tile", clifftileImage);
    this.load.image("FarmLand_Tile", farmlandtileImage);
    this.load.image("House_1_Wood_Base_Blue", housewoodbasetileImage);
    this.load.image("Path_Tile", pathtileImage);
    this.load.image("Water_Tile", watertileImage);
    this.load.image("Oak_Tree", oaktreetileImage);
    // this.load.image("Outdoor_Decor_Free", outdordecortileImage);

    this.load.spritesheet("player-actifity-ss", playeractifitySpriteSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("player-farming-ss", playerfarmingSpriteSheet, {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet("Outdoor_Decor_Free", outdordecortileImage, {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    const keyF = this.input.keyboard!.addKey("F");
    keyF.on("down", () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });

    this.farmOverlay = this.add.graphics();
    this.farmOverlay.setDepth(998);
    this.farmOverlay.setVisible(false);

    this.setupKeys();
    this.setUpMapAndTileSet();
    this.setupSpriteSheet();
    this.setupPlayer();
    this.collisionLogic();
    this.setupInventoryBar();
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);
    this.player.setFlipX(false);

    if (this.keys.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
      this.player.anims.play("walk-right", true);
      this.playerCurrentDirection = "left";
    } else if (this.keys.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("walk-right", true);
      this.playerCurrentDirection = "right";
    } else if (this.keys.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play("walk-back", true);
      this.playerCurrentDirection = "back";
    } else if (this.keys.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play("walk-front", true);
      this.playerCurrentDirection = "front";
    } else if (this.keys.space.isDown) {
      this.startActivity();
    } else if (this.keys.e.isDown) {
      this.plantSomething(this.selectedPlant);
    } else {
      this.playIdle();
    }

    if (this.player && this.playerLabel) {
      this.playerLabel.setPosition(this.player.x, this.player.y - 20);
    }

    this.time.addEvent({
      delay: 200, // cek setiap 0.2 detik
      loop: true,
      callback: () => this.showBarHandler(),
    });
  }

  private setupKeys() {
    // Input setup
    this.keys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      e: Phaser.Input.Keyboard.KeyCodes.E,
    });
  }

  private setUpMapAndTileSet() {
    // create map world
    this.map = this.make.tilemap({ key: "basemap" });
    const pathTile = this.map.addTilesetImage("Path_Tile", "Path_Tile");
    const waterTile = this.map.addTilesetImage("Water_Tile", "Water_Tile");
    const cliffTile = this.map.addTilesetImage("Cliff_Tile", "Cliff_Tile");
    const houseTile = this.map.addTilesetImage(
      "House_1_Wood_Base_Blue",
      "House_1_Wood_Base_Blue"
    );
    const farmTile = this.map.addTilesetImage("FarmLand_Tile", "FarmLand_Tile");
    const bridgeTile = this.map.addTilesetImage("Bridge_Wood", "Bridge_Wood");
    this.map.addTilesetImage("Outdoor_Decor_Free", "Outdoor_Decor_Free");
    const owaktreeTile = this.map.addTilesetImage("Oak_Tree", "Oak_Tree");

    this.map.createLayer("base", pathTile!, 0, 0);
    this.grassnwaterlayer = this.map.createLayer(
      "grassnwater",
      [waterTile!, cliffTile!],
      0,
      0
    )!;
    this.roadnhouselayer = this.map.createLayer(
      "roadnhouse",
      [pathTile!, cliffTile!, houseTile!, farmTile!, bridgeTile!],
      0,
      0
    )!;
    this.summoninglayer = this.map.createLayer("summoning", owaktreeTile!)!;
  }

  private setupPlayer() {
    // create player
    this.player = this.physics.add.sprite(
      this.initialXSpawnPosition,
      this.initialYSpawnPosition,
      "player-actifity-ss",
      0
    );
    this.playerLabel = this.add.text(this.player.x, this.player.y - 20, "You", {
      font: "12px Arial",
      color: "#000000",
      fontStyle: "bold",
      stroke: "#ffffff",
      strokeThickness: 1,
    });
    this.playerLabel.setOrigin(0.5, 1);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }

  private setupInventoryBar() {
    const slotSize = 24;
    const slotSpacing = 10;
    const items = ["carrot", "turnip", "wheat"];
    const totalWidth =
      items.length * slotSize + (items.length - 1) * slotSpacing;

    this.inventoryBar = this.add.container(0, 0);
    this.inventoryBar.setDepth(999);

    // Background panel
    const bg = this.add.rectangle(
      totalWidth / 2,
      slotSize / 2,
      totalWidth + 20,
      slotSize + 12,
      0x000000,
      0.5
    );
    bg.setStrokeStyle(1, 0xffffff, 0.3);
    this.inventoryBar.add(bg);

    items.forEach((name, i) => {
      let frameId = 20;
      if (name === "carrot") frameId = 17;
      else if (name === "turnip") frameId = 13;

      const x = i * (slotSize + slotSpacing);

      const border = this.add.graphics();
      border.fillStyle(0x000000, 0.4);
      border.fillRect(x, 0, slotSize, slotSize);
      border.lineStyle(1, 0xffffff, 0.7);
      border.strokeRect(x, 0, slotSize, slotSize);

      const sprite = this.add.sprite(
        x + slotSize / 2,
        slotSize / 2,
        "Outdoor_Decor_Free",
        frameId
      );
      sprite.setDisplaySize(slotSize - 4, slotSize - 4);
      sprite.setInteractive({ useHandCursor: true });

      sprite.on("pointerdown", () => {
        this.selectedPlant = name as any;
        this.updateInventoryHighlight();
      });

      this.inventoryBar.add(border);
      this.inventoryBar.add(sprite);
      this.inventorySlots.push({ name, sprite, border });
    });

    this.updateInventoryHighlight();
  }

  private updateInventoryHighlight() {
    this.inventorySlots.forEach((slot) => {
      slot.border.clear();
      if (slot.name === this.selectedPlant) {
        slot.border.lineStyle(2, 0xffff00, 1);
      } else {
        slot.border.lineStyle(1, 0xffffff, 0.5);
      }
      slot.border.strokeRect(
        slot.sprite.x - slot.sprite.displayWidth / 2,
        slot.sprite.y - slot.sprite.displayHeight / 2,
        slot.sprite.displayWidth,
        slot.sprite.displayHeight
      );
    });
  }

  private collisionLogic() {
    this.roadnhouselayer!.setCollisionByProperty({ collision: true });
    this.summoninglayer!.setCollisionByProperty({ cutable: true });
    this.grassnwaterlayer!.setCollisionByProperty({ swimable: true });
    this.physics.add.collider(this.player, [
      this.roadnhouselayer!,
      this.summoninglayer!,
      this.grassnwaterlayer!,
    ]);
  }

  private showBarHandler() {
    let offsetX = 0;
    let offsetY = 0;

    switch (this.playerCurrentDirection) {
      case "front":
        offsetY = 16;
        break;
      case "back":
        offsetY = -16;
        break;
      case "left":
        offsetX = -16;
        break;
      case "right":
        offsetX = 16;
        break;
    }

    const playerTileX = this.map.worldToTileX(this.player.x + offsetX);
    const playerTileY = this.map.worldToTileY(this.player.y + offsetY);
    const tile = this.roadnhouselayer!.getTileAt(playerTileX!, playerTileY!);

    this.farmOverlay.clear();

    if (tile?.properties?.farmable) {
      this.showBar = "inventory";
      this.playerCurrentAcifity = "nyekop";

      const worldX = this.map.tileToWorldX(playerTileX!);
      const worldY = this.map.tileToWorldY(playerTileY!);
      const tileSize = this.map.tileWidth;

      const tileKey = `${playerTileX},${playerTileY}`;
      const progress = this.farmTreshHold.get(tileKey) || 0;

      const rectColor = progress < 20.0 ? 0xa9a9a9 : 0x00ff00;

      this.farmOverlay.fillStyle(rectColor, 0.3 + progress * 0.4);
      this.farmOverlay.fillRect(worldX!, worldY!, tileSize, tileSize);
      this.farmOverlay.lineStyle(1, rectColor, 0.8);
      this.farmOverlay.strokeRect(worldX!, worldY!, tileSize, tileSize);

      this.farmOverlay.setVisible(true);
    } else {
      this.playerCurrentAcifity = "atk";
      this.showBar = "";
      this.farmOverlay.setVisible(false);
    }

    if (this.player && this.inventoryBar && this.showBar === "inventory") {
      this.inventoryBar.setPosition(this.player.x - 40, this.player.y + 25);
      this.inventoryBar.setVisible(true);
    } else if (this.inventoryBar) {
      this.inventoryBar.setVisible(false);
    }
  }

  private setupSpriteSheet() {
    // idle
    this.anims.create({
      key: "idle-front",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 0,
        end: 5,
      }),
      frameRate: 12,
    });
    this.anims.create({
      key: "idle-right",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 6,
        end: 11,
      }),
      frameRate: 12,
    });
    this.anims.create({
      key: "idle-back",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 12,
        end: 17,
      }),
      frameRate: 12,
    });

    // walk
    this.anims.create({
      key: "walk-front",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 18,
        end: 23,
      }),
      frameRate: 12,
    });
    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 24,
        end: 29,
      }),
      frameRate: 12,
    });
    this.anims.create({
      key: "walk-back",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 30,
        end: 35,
      }),
      frameRate: 12,
    });

    // state [mati atau berenang]
    this.anims.create({
      key: "dead",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 54,
        end: 58,
      }),
      frameRate: 8,
    });
    this.anims.create({
      key: "swim",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 55,
        end: 57,
      }),
      frameRate: 8,
    });

    // attack
    this.anims.create({
      key: "atk-front",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 36,
        end: 39,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "atk-right",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 42,
        end: 45,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "atk-back",
      frames: this.anims.generateFrameNumbers("player-actifity-ss", {
        start: 48,
        end: 51,
      }),
      frameRate: 8,
      repeat: -1,
    });

    // nguli [nyangkul + negapak + ]
    this.anims.create({
      key: "mining-right",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 0,
        end: 1,
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: "mining-front",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 2,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: "mining-back",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 4,
        end: 5,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: "ngapak-right",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 6,
        end: 7,
      }),
      frameRate: 4,
    });
    this.anims.create({
      key: "ngapak-front",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 8,
        end: 9,
      }),
      frameRate: 4,
    });
    this.anims.create({
      key: "ngapak-back",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 10,
        end: 11,
      }),
      frameRate: 4,
    });

    this.anims.create({
      key: "nyekop-right",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 12,
        end: 13,
      }),
      frameRate: 4,
    });
    this.anims.create({
      key: "nyekop-front",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 14,
        end: 15,
      }),
      frameRate: 4,
    });
    this.anims.create({
      key: "nyekop-back",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 16,
        end: 17,
      }),
      frameRate: 4,
    });

    this.anims.create({
      key: "nyiram-front",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 18,
        end: 19,
      }),
      frameRate: 4,
    });
    this.anims.create({
      key: "nyiram-back",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 20,
        end: 21,
      }),
      frameRate: 4,
    });
    this.anims.create({
      key: "nyiram-right",
      frames: this.anims.generateFrameNumbers("player-farming-ss", {
        start: 22,
        end: 23,
      }),
      frameRate: 4,
    });
  }

  private playIdle() {
    if (this.playerCurrentDirection === "front") {
      this.player.anims.play("idle-front", true);
    } else if (this.playerCurrentDirection === "back") {
      this.player.anims.play("idle-back", true);
    } else if (this.playerCurrentDirection === "right") {
      this.player.anims.play("idle-right", true);
    } else if (this.playerCurrentDirection === "left") {
      this.player.setFlipX(true);
      this.player.anims.play("idle-right", true);
    }
  }

  private startActivity() {
    const type = this.playerCurrentAcifity;
    const dir = this.playerCurrentDirection;

    const flipLeft = dir === "left";
    this.player.setFlipX(flipLeft);

    const animKey = `${type}-${flipLeft ? "right" : dir}`;

    // Cek tile di depan pemain
    let offsetX = 0;
    let offsetY = 0;

    switch (dir) {
      case "front":
        offsetY = 1;
        break;
      case "back":
        offsetY = -1;
        break;
      case "left":
        offsetX = -1;
        break;
      case "right":
        offsetX = 1;
        break;
    }

    const playerTileX = this.map.worldToTileX(this.player.x);
    const playerTileY = this.map.worldToTileY(this.player.y);
    const targetTileX = playerTileX! + offsetX;
    const targetTileY = playerTileY! + offsetY;

    const tileKey = `${targetTileX},${targetTileY}`;

    if (type === "nyekop") {
      const currentValue = this.farmTreshHold.get(tileKey) || 0;
      const newValue = Math.min(currentValue + 0.1, 20.0);
      this.farmTreshHold.set(tileKey, newValue);
    }

    this.player.anims.play(animKey, true);
  }

  private plantSomething(name: string) {
    let id: number = 20;

    let offsetTileX = 0;
    let offsetTileY = 0;

    switch (this.playerCurrentDirection) {
      case "front":
        offsetTileY = 1;
        break;
      case "back":
        offsetTileY = -1;
        break;
      case "left":
        offsetTileX = -1;
        break;
      case "right":
        offsetTileX = 1;
        break;
    }

    const playerTileX = this.map.worldToTileX(this.player.x);
    const playerTileY = this.map.worldToTileY(this.player.y);

    const targetTileX = playerTileX! + offsetTileX;
    const targetTileY = playerTileY! + offsetTileY;
    const tileKey = `${targetTileX},${targetTileY}`;

    const progress = this.farmTreshHold.get(tileKey) || 0;

    if (progress < 20.0) {
      return;
    }

    switch (name.toLowerCase()) {
      case "carrot":
        id = 17;
        break;
      case "wheat":
        id = 20;
        break;
      case "turnip":
        id = 13;
        break;
      default:
        id = 20;
        break;
    }

    const worldX = targetTileX * 16 + 8;
    const worldY = targetTileY * 16 + 8;

    const plant = this.add.sprite(worldX, worldY, "Outdoor_Decor_Free");
    plant.setFrame(id);

    this.farmTreshHold.set(tileKey, 0);

    return plant;
  }
}
