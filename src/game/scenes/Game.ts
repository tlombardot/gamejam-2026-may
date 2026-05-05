import { Physics, Scene, Math as PhaserMath } from "phaser";
import { Player } from "../entities/Player";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  pipes: Phaser.Physics.Arcade.Group;
  player: Player;

  constructor() {
    super("Game");
  }

  create() {
    const { width, height } = this.scale;
    this.pipes = this.physics.add.group();
    this.background = this.add.image(width / 2, height / 2, "sky");
    this.background.setDisplaySize(1920, 1080);
    this.player = new Player(this, 100, 100);
    this.input.on("pointerdown", () => {
      this.player.jump();
    });
    this.physics.world.on("worldbounds", (body: Physics.Arcade.Body) => {
      if (body.gameObject == this.player) {
        this.gameOver();
      }
    });
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.collider(
      this.player,
      this.pipes,
      this.gameOver,
      undefined,
      this,
    );
  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.time.delayedCall(1000, () => {
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
}
