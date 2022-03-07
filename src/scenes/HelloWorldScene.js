import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super('hello-world')
    }

    preload() {
        this.load.setBaseURL('http://labs.phaser.io')

        this.load.image('sky', 'assets/skies/space3.png')
        this.load.image('logo', 'assets/sprites/phaser3-logo.png')
        this.load.image('red', 'assets/particles/red.png')
    }

    create() {
        this.rect = this.add.rectangle(100, 100, 200, 300, 0x6666ff)
        console.log(this.physics.world.bounds)

        this.key_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.key_a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.key_w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.key_s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    }

    update(time, delta) {
        if (this.key_d.isDown && this.rect.x + this.rect.width / 2 < this.physics.world.bounds.right) {
            this.rect.x += delta * 1;
        }
        if (this.key_a.isDown && this.rect.x - this.rect.width / 2 > 0) {
            this.rect.x -= delta * 1;
        }
        if (this.key_w.isDown && this.rect.y - this.rect.height / 2 > 0) {
            this.rect.y -= delta * 1;
        }
        if (this.key_s.isDown && this.rect.y + this.rect.height / 2 < this.physics.world.bounds.bottom) {
            this.rect.y += delta * 1;
        }
    }
}
