import Phaser from "phaser";

type Direction = "front" | "back" | "right" | "left";
type BotState = "idle" | "walk" | "attack" | "dead";

export default class SkeletonBot extends Phaser.Physics.Arcade.Sprite {
  private sceneRef: Phaser.Scene;
  private player: Phaser.Physics.Arcade.Sprite;
  private speed: number = 70;
  private direction: Direction = "front";
  private botState: BotState = "idle";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    player: Phaser.Physics.Arcade.Sprite
  ) {
    super(scene, x, y, "skleton-actifity-ss");

    this.sceneRef = scene;
    this.player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.play(`skleton-idle-${this.direction}`);
  }

  public update(): void {
    if (this.botState === "dead") return;

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.player.x,
      this.player.y
    );

    if (distance > 200) {
      this.setIdle();
      return;
    }

    if (distance > 60 && distance <= 200) {
      this.chasePlayer();
      return;
    }

    if (distance <= 60) {
      this.attack();
      return;
    }
  }

  /** Diam */
  private setIdle(): void {
    if (this.botState === "idle") return;

    this.botState = "idle";
    this.setVelocity(0, 0);
    this.play(`skleton-idle-${this.direction}`, true);
  }

  /** Kejar player */
  private chasePlayer(): void {
    if (this.botState === "attack") return;

    this.botState = "walk";

    // arah menuju player
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.player.x,
      this.player.y
    );
    const vx = Math.cos(angle) * this.speed;
    const vy = Math.sin(angle) * this.speed;
    this.setVelocity(vx, vy);

    if (Math.abs(vx) > Math.abs(vy)) {
      this.direction = vx > 0 ? "right" : "left";
      this.setFlipX(vx < 0);
    } else {
      this.direction = vy > 0 ? "front" : "back";
    }

    this.play(`skleton-walk-${this.direction}`, true);
  }

  private attack(): void {
    if (this.botState === "attack") return;

    this.botState = "attack";
    this.setVelocity(0, 0);
    this.play(`skleton-atk-${this.direction}`, true);

    // contoh: setelah 1 detik, kembali idle
    this.sceneRef.time.delayedCall(1000, () => {
      this.setIdle();
    });
  }

  public die(): void {
    this.botState = "dead";
    this.setVelocity(0, 0);
    this.play("skleton-dead", false);
  }

  public getState(): BotState {
    return this.botState;
  }
}
