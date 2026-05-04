import { Scene } from "phaser";

export class Game extends Scene {
  private upKey = Phaser.Input.Keyboard.JustUp;

  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  platform: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Image;

  constructor() {
    super("Game");
  }

  create() {
    const { width, height } = this.scale;
    this.background = this.add.image(width / 2, height / 2, "sky");
    this.background.displayWidth = 1920;
    this.background.displayHeight = 1080;
    this.camera = this.cameras.main;
    this.platform = this.add
      .image(width / 2, height / 2, "mossy")
      .setScale(0.5);
    this.platform = this.add.image(width / 2, height / 2, "mask").setScale(1.5);
    this.upKey.bind("UP");
    this.input.once("UP", () => {
      this.scene.start("GameOver");
    });
  }
}
