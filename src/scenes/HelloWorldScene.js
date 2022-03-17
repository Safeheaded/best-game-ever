import axios from 'axios';
import Phaser from 'phaser'
import { getSocket } from '../socket'

class Player extends Phaser.GameObjects.Rectangle {
    id = null;
    down = false;
    up = false;
    left = false;
    right = false;

    constructor(id, scene, posX, posY, width, height, color) {
        super(scene, posX, posY, width, height, color)
        this.id = id;
    }

    update(time, delta) {
        if (this.right && this.x + this.width / 2 < this.scene.physics.world.bounds.right) {
            this.x += delta * 1;
        }
        if (this.left && this.x - this.width / 2 > 0) {
            this.x -= delta * 1;
        }
        if (this.up && this.y - this.height / 2 > 0) {
            this.y -= delta * 1;
        }
        if (this.down && this.y + this.height / 2 < this.scene.physics.world.bounds.bottom) {
            this.y += delta * 1;
        }
        super.update();
    }
}

export default class HelloWorldScene extends Phaser.Scene {

    players = [];

    constructor() {
        super('hello-world')
    }

    create() {

        this.socket = getSocket();
        this.socket.addEventListener('open', () => {
            axios.post('http://localhost:8081/create', { 'gui': 'CrossArrows', 'max_players': 50 })
                .then(res => {
                    this.add.text(this.physics.world.bounds.right - 150, 0, res.data.code, { fontFamily: 'Times, serif', fontSize: '40px' }); this.socket.send(JSON.stringify(res.data))
                }).catch(error => console.log(error))
        })
        this.socket.addEventListener('message', event => {
            if (typeof event.data == 'string') {
                const data = JSON.parse(event.data)
                if (data.event_name == "player_added") {
                    const newPlayer = new Player(
                        data.id, this, 100, 100, 200, 300, 0x6666ff
                    );
                    this.add.existing(newPlayer)
                    this.players.push(newPlayer)
                }
                else if (data.event_name === 'player_removed') {
                    const playerIndex = this.players.findIndex(player => player.id === data.id)
                    const player = this.players.find(player => player.id === data.id)
                    player.destroy()
                    this.players.splice(playerIndex, 1)
                }
            }
            else {
                event.data.arrayBuffer().then(data => {
                    const dataView = new DataView(data);
                    const command = dataView.getUint8(1)
                    const playerId = dataView.getUint8(0)

                    const arrowUp = 0b00000000
                    const arrowLeft = 0b00000110
                    const arrowRight = 0b00000100
                    const arrowDown = 0b00000010
                    const keyUp = 0b00000000
                    const keyDown = 0b00000001

                    const player = this.players.find(player => player.id === playerId)

                    console.log({ players: this.players })

                    if (player) {
                        if (command === (arrowDown | keyDown)) {
                            player.down = true;
                        }
                        if (command === (arrowDown | keyUp)) {
                            player.down = false;
                        }

                        if (command === (arrowUp | keyDown)) {
                            player.up = true;
                        }
                        if (command === (arrowUp | keyUp)) {
                            player.up = false;
                        }

                        if (command === (arrowLeft | keyDown)) {
                            player.left = true;
                        }
                        if (command === (arrowLeft | keyUp)) {
                            player.left = false;
                        }

                        if (command === (arrowRight | keyDown)) {
                            player.right = true;
                        }
                        if (command === (arrowRight | keyUp)) {
                            player.right = false;
                        }
                    }

                })
            }
        })
    }

    update(time, delta) {
        for (const player of this.players) {
            player.update(time, delta)
        }
    }
}
