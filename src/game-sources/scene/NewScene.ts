/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";
import { io, Socket } from "socket.io-client";

import mainmap from "../tile-asset/new-asset/main-map.json";
import Beach_Tile from "../tile-asset/new-asset/Beach_Tile.png";
import Bridge_Wood from "../tile-asset/new-asset/Bridge_Wood.png";
import Cliff_Tile from "../tile-asset/new-asset/Cliff_Tile.png";
import House_Tile from "../tile-asset/new-asset/House.png";
import FarmLand_Tile from "../tile-asset/new-asset/FarmLand_Tile.png";
import Grass_Middle from "../tile-asset/new-asset/Grass_Middle.png";
import Outdoor_Decor_Free from "../tile-asset/new-asset/Outdoor_Decor_Free.png";
import Path_Middle from "../tile-asset/new-asset/Path_Middle.png";
import Path_Tile from "../tile-asset/new-asset/Path_Tile.png";
import Player from "../tile-asset/new-asset/Player.png";
import Player_Actions from "../tile-asset/new-asset/Player_Actions.png";
import Water_Middle from "../tile-asset/new-asset/Water_Middle.png";
import Water_Tile from "../tile-asset/new-asset/Water_Tile.png";

export default class NewScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private otherPlayers: { [id: string]: Phaser.Physics.Arcade.Sprite } = {};
  private keys!: any;
  private socket!: Socket;
  private roomId = "p2e";
  private userId!: string;
  private onGateway: boolean = false;
  // private onToW2E: boolean = false;
  private onToCatchChicken: boolean = false;
  private initialXSpawnPosition = 120;
  private initialYSpawnPosition = 670;
  private playerMark!: Phaser.GameObjects.Text;

  constructor() {
    super("NewScene");
  }

  init(data: { accountId: string }) {
    console.log("Scene init data:", data);
    this.userId = data.accountId;
    this.onGateway = false;
    // this.onToW2E = false;
  }

  preload() {
    this.load.tilemapTiledJSON("mainmap", mainmap);

    this.load.image("Beach_Tile", Beach_Tile);
    this.load.image("Bridge_Wood", Bridge_Wood);
    this.load.image("Cliff_Tile", Cliff_Tile);
    this.load.image("FarmLand_Tile", FarmLand_Tile);
    this.load.image("Grass_Middle", Grass_Middle);
    this.load.image("Outdoor_Decor_Free", Outdoor_Decor_Free);
    this.load.image("Path_Middle", Path_Middle);
    this.load.image("Path_Tile", Path_Tile);
    this.load.image("Player", Player);
    this.load.image("Player_Actions", Player_Actions);
    this.load.image("Water_Middle", Water_Middle);
    this.load.image("Water_Tile", Water_Tile);
    this.load.image("House_Tile", House_Tile);
  }

  create() {
    this.createAndSetUpTileMap();
    this.setUpConfigSocket();
    this.setUpKeyController();

    this.player = this.physics.add.sprite(
      this.initialXSpawnPosition,
      this.initialYSpawnPosition,
      "player-idle",
      0
    );
    this.playerMark = this.add
      .text(this.player.x, this.player.y - 20, "You", {
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
      } else if (this.onToCatchChicken) {
        this.scene.start("HideAndSeekScene", { accountId: this.userId });
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

  private createAndSetUpTileMap() {
    const map = this.make.tilemap({ key: "mainmap" });

    const Beach_TileSet = map.addTilesetImage("Beach_Tile", "Beach_Tile");
    const Bridge_WoodSet_Tileset = map.addTilesetImage(
      "Bridge_Wood",
      "Bridge_Wood"
    );
    const Cliff_TileSet = map.addTilesetImage("Cliff_Tile", "Cliff_Tile");
    const FarmLand_TileSet = map.addTilesetImage(
      "FarmLand_Tile",
      "FarmLand_Tile"
    );
    const Grass_MiddleSet = map.addTilesetImage("Grass_Middle", "Grass_Middle");
    const Outdoor_Decor_FreeSet = map.addTilesetImage(
      "Outdoor_Decor_Free",
      "Outdoor_Decor_Free"
    );
    const Path_MiddleSet = map.addTilesetImage("Path_Middle", "Path_Middle");
    const Path_TileSet = map.addTilesetImage("Path_Tile", "Path_Tile");
    const Water_Tileset = map.addTilesetImage("Water_Tile", "Water_Tile");
    const Water_Middle_Tileset = map.addTilesetImage(
      "Water_Middle",
      "Water_Middle"
    );
    const House_Tileset = map.addTilesetImage("House", "House_Tile");

    map.createLayer("grasslayer", [Grass_MiddleSet!], 0, 0);
    map.createLayer(
      "pathlayer",
      [Cliff_TileSet!, Path_TileSet!, Path_MiddleSet!],
      0,
      0
    );
    map.createLayer(
      "waterlayer",
      [Water_Tileset!, Water_Middle_Tileset!, Path_TileSet!, Beach_TileSet!],
      0,
      0
    );
    map.createLayer("bridgelayer", [Bridge_WoodSet_Tileset!], 0, 0);
    map.createLayer("farmlayer", [FarmLand_TileSet!], 0, 0);
    map.createLayer(
      "objectlayer",
      [House_Tileset!, Outdoor_Decor_FreeSet!, Path_TileSet!],
      0,
      0
    );

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  private setUpConfigSocket() {
    this.socket = io(
      "https://godean-game-server.grayhill-39d1a131.southeastasia.azurecontainerapps.io/"
    );
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
  }

  private setUpKeyController() {
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
