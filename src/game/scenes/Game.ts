import { Physics, Scene, Math as PhaserMath } from "phaser";
import { Player } from "../entities/Player";

export class Game extends Scene {
  isGameStarted: boolean = false;
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  pipes: Phaser.Physics.Arcade.Group;
  instructions: Phaser.GameObjects.Text;
  pipeTimer: Phaser.Time.TimerEvent;
  player: Player;

  constructor() {
    super("Game");
  }

  create() {
    this.physics.pause();
    const { width, height } = this.scale;
    this.pipes = this.physics.add.group();
    this.background = this.add.image(width / 2, height / 2, "sky");
    this.background.setDisplaySize(1920, 1080);
    this.player = new Player(this, 100, 400);
    this.input.on("pointerdown", () => {
      if (!this.isGameStarted) {
        this.isGameStarted = true;
        this.instructions.destroy();
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
      .text(width / 2, height / 2, "Clique pour sauter", { fontSize: "40px" })
      .setOrigin(0.5);
  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.time.delayedCall(1000, () => {
      this.isGameStarted = false;
      this.scene.restart();
    });
  }
  addPipe(x: number, y: number, width: number, height: number) {
    const pipe = this.add.rectangle(x, y, width, height, 0x00ff00);
    this.pipes.add(pipe);
    const body = pipe.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(-200);
    body.setAllowGravity(false);
    body.setImmovable(true);
  }

  spawnPipes() {
    const { width, height } = this.scale;
    const gap = 200;
    const pipeWidth = 60;

    const minHeight = 100;
    const maxHeight = height - 100;
    const gapCenter = PhaserMath.Between(
      minHeight + gap / 2,
      maxHeight - gap / 2,
    );

    const topHeight = gapCenter - gap / 2;
    this.addPipe(width + pipeWidth, topHeight / 2, pipeWidth, topHeight);

    const bottomHeight = height - (gapCenter + gap / 2);
    this.addPipe(
      width + pipeWidth,
      height - bottomHeight / 2,
      pipeWidth,
      bottomHeight,
    );
  }
  //@ts-ignore
  update(time: number, delta: number): void {
    this.pipes.getChildren().forEach((pipe) => {
      const p = pipe as Phaser.GameObjects.Rectangle;
      if (p.x < -100) p.destroy();
    });
  }
}
