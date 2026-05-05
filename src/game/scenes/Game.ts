import { Physics, Scene } from "phaser";
import { Player } from "../entities/Player";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  platform: Phaser.Physics.Arcade.Image;
  player: Player;

  constructor() {
    super("Game");
  }

  create() {
    const { width, height } = this.scale;
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
  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.time.delayedCall(1000, () => {
      this.scene.restart();
    });
  }
}
