import { Physics } from "phaser";

export class Player extends Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    (this.body as Physics.Arcade.Body).onWorldBounds = true;
  }

  jump() {
    this.setVelocityY(-300);
  }
}
