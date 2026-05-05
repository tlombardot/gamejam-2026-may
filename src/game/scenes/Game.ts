import { Physics, Scene, Math as PhaserMath } from "phaser";
import { Player } from "../entities/Player";

export class Game extends Scene {
  score: number = 0;
  isGameStarted: boolean = false;
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  pipes: Phaser.Physics.Arcade.Group;
  instructions: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  pipeTimer: Phaser.Time.TimerEvent;
  player: Player;

  constructor() {
    super("Game");
  }

  create() {
    this.score = 0;
    const { width, height } = this.scale;

    // 1. Fond
    this.background = this.add.image(width / 2, height / 2, "sky");
    this.background.setDisplaySize(1920, 1080);

    // 2. Score (Couleur Crème / Off-white)
    this.scoreText = this.add.text(50, 50, "Score: 0", {
      fontSize: "40px",
      color: "#fdfcf0",
      stroke: "#2c3e50",
      strokeThickness: 6,
    });
    this.scoreText.setDepth(100);

    this.physics.pause();
    this.pipes = this.physics.add.group();

    // Pré-générer des tuyaux
    for (let i = 0; i < 3; i++) {
      this.spawnPipes(800 + i * 450);
    }

    this.player = new Player(this, 100, 400);

    this.input.on("pointerdown", () => {
      if (!this.isGameStarted) {
        this.isGameStarted = true;
        if (this.instructions) this.instructions.destroy();
        this.physics.resume();
        this.pipeTimer.paused = false;
      }
      this.player.jump();
    });

    this.physics.world.on("worldbounds", (body: Physics.Arcade.Body) => {
      if (body.gameObject == this.player) {
        this.gameOver();
      }
    });

    this.pipeTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true,
      paused: true,
    });

    this.physics.add.collider(
      this.player,
      this.pipes,
      this.gameOver,
      undefined,
      this,
    );

    this.instructions = this.add
      .text(width / 2, height / 2, "Clique pour sauter", {
        fontSize: "40px",
        color: "#fdfcf0",
        stroke: "#2c3e50",
        strokeThickness: 6,
      })
      .setOrigin(0.5);
  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xae445a);
    this.time.delayedCall(1000, () => {
      this.isGameStarted = false;
      this.scene.restart();
    });
  }

  addPipe(x: number, y: number, width: number, height: number, isTop: boolean) {
    const pipe = this.add.rectangle(x, y, width, height, 0x7ea04d);
    this.pipes.add(pipe);
    const body = pipe.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(-200);
    body.setAllowGravity(false);
    body.setImmovable(true);

    if (isTop) {
      pipe.setData("scored", false);
    }
  }

  spawnPipes(customX?: number) {
    const { width, height } = this.scale;
    const x = typeof customX === "number" ? customX : width + 60;
    const gap = 250;
    const pipeWidth = 80;

    const minHeight = 100;
    const maxHeight = height - 100;
    const gapCenter = PhaserMath.Between(
      minHeight + gap / 2,
      maxHeight - gap / 2,
    );

    const topHeight = gapCenter - gap / 2;
    this.addPipe(x, topHeight / 2, pipeWidth, topHeight, true);

    const bottomHeight = height - (gapCenter + gap / 2);
    this.addPipe(x, height - bottomHeight / 2, pipeWidth, bottomHeight, false);
  }

  update(): void {
    if (!this.isGameStarted) return;

    this.pipes.getChildren().forEach((pipe) => {
      const p = pipe as Phaser.GameObjects.Rectangle;

      if (p.getData("scored") === false && p.x < this.player.x) {
        p.setData("scored", true);
        this.score++;
        this.scoreText.setText("Score: " + this.score);
      }

      if (p.x < -100) p.destroy();
    });
  }
}
