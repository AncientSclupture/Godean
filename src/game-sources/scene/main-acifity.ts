/* eslint-disable @typescript-eslint/no-explicit-any */

import Phaser from "phaser";

import basemap from "../map-json/base-map.json";
import bridgewoodtilesetImage from "../asset-and-tileset/Bridge_Wood.png";
import clifftileImage from "../asset-and-tileset/Cliff_Tile.png";
import farmlandtileImage from "../asset-and-tileset/FarmLand_Tile.png";
import housewoodbasetileImage from "../asset-and-tileset/House_1_Wood_Base_Blue.png";
import pathtileImage from "../asset-and-tileset/Path_Tile.png";
import watertileImage from "../asset-and-tileset/Water_Tile.png";
import oaktreetileImage from "../asset-and-tileset/Oak_Tree_Small.png";
import outdordecortileImage from "../asset-and-tileset/Outdoor_Decor_Free.png";

import playeractifitySpriteSheet from "../asset-and-tileset/Player.png";
import playerfarmingSpriteSheet from "../asset-and-tileset/Player_Actions.png";

export default class MainActifityScene extends Phaser.Scene {
  private keys!: any;
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerLabel!: Phaser.GameObjects.Text;
  private map!: Phaser.Tilemaps.Tilemap;
  private roadnhouselayer!: Phaser.Tilemaps.TilemapLayer;

  // private howtoDefineLayer!: Phaser.Tilemaps.TilemapLayer;

  private initialXSpawnPosition = 243;
  private initialYSpawnPosition = 310;
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
    this.load.image("Oak_Tree_Small", oaktreetileImage);
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

    this.setupKeys();
    this.setUpMapAndTileSet();
    this.setupSpriteSheet();
    this.setupPlayer();
    this.collisionLogic();
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
      this.plantSomething("carrot", this.player.x, this.player.y);
    } else {
      this.playIdle();
    }

    if (this.player && this.playerLabel) {
      this.playerLabel.setPosition(this.player.x, this.player.y - 20);
    }
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
    this.map.addTilesetImage(
      "Outdoor_Decor_Free",
      "Outdoor_Decor_Free"
    );

    this.map.createLayer("base", pathTile!, 0, 0);
    this.map.createLayer("grassnwater", [waterTile!, cliffTile!], 0, 0)!;
    this.roadnhouselayer = this.map.createLayer(
      "roadnhouse",
      [pathTile!, cliffTile!, houseTile!, farmTile!, bridgeTile!],
      0,
      0
    )!;
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

  private collisionLogic() {
    this.roadnhouselayer!.setCollisionByProperty({ collision: true });
    this.physics.add.collider(this.player, this.roadnhouselayer!);
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

    this.player.anims.play(animKey, true);
  }

  private plantSomething(name: string, x: number, y: number) {
    let id: number = 20; // default wheat

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
        console.log(`Unknown plant: ${name}, using default (wheat)`);
        id = 20;
        break;
    }

    const plant = this.add.sprite(x, y, "Outdoor_Decor_Free");
    plant.setFrame(id);

    return plant;
  }
}
