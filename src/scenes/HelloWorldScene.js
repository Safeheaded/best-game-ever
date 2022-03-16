import axios from 'axios';
import Phaser from 'phaser'
import { getSocket } from '../socket'

export default class HelloWorldScene extends Phaser.Scene {
    player = null;
    down = false;
    constructor() {
        super('hello-world')


    }

    create() {
        console.log(this.physics.world.bounds)

        this.socket = getSocket();
        this.socket.addEventListener('open', () => {
            axios.post('http://localhost:8081/create', { 'gui': 'CrossArrows', 'max_players': 50 })
                .then(res => { alert(res.data.code); this.socket.send(JSON.stringify(res.data)) }).catch(error => console.log(error))
        })
        this.socket.addEventListener('message', event => {
            if (event.data.text != null) {
                // const dataView = new DataView(event.data)
                const enc = new TextDecoder();
                event.data.arrayBuffer().then(data => {
                    const val = new Uint8Array(data)
                    const dataView = new DataView(data);
                    const command = dataView.getUint8(1)

                    const arrowUp = 0b00000000
                    const arrowLeft = 0b00000110
                    const arrowRight = 0b00000100
                    const arrowDown = 0b00000010
                    const keyUp = 0b00000000
                    const keyDown = 0b00000001

                    if (command === (arrowDown | keyDown)) {
                        this.down = true;
                    }
                    if (command === (arrowDown | keyUp)) {
                        this.down = false;
                    }

                    if (command === (arrowUp | keyDown)) {
                        this.up = true;
                    }
                    if (command === (arrowUp | keyUp)) {
                        this.up = false;
                    }

                    if (command === (arrowLeft | keyDown)) {
                        this.left = true;
                    }
                    if (command === (arrowLeft | keyUp)) {
                        this.left = false;
                    }

                    if (command === (arrowRight | keyDown)) {
                        this.right = true;
                    }
                    if (command === (arrowRight | keyUp)) {
                        this.right = false;
                    }


                })
            }
            else {
                const data = JSON.parse(event.data)
                if (data.event_name == "player_added") {

                    this.player = this.add.rectangle(100, 100, 200, 300, 0x6666ff)
                }
            }


        })

        this.key_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.key_a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.key_w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.key_s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    }

    update(time, delta) {
        if (this.player == null) return;
        if (this.right && this.player.x + this.player.width / 2 < this.physics.world.bounds.right) {
            this.player.x += delta * 1;
        }
        if (this.left && this.player.x - this.player.width / 2 > 0) {
            this.player.x -= delta * 1;
        }
        if (this.up && this.player.y - this.player.height / 2 > 0) {
            this.player.y -= delta * 1;
        }
        if (this.down && this.player.y + this.player.height / 2 < this.physics.world.bounds.bottom) {
            this.player.y += delta * 1;
        }
    }
}
