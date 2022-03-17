import axios from 'axios';
import Phaser from 'phaser'
import { getSocket } from '../socket'

class Player {
    id = null;
    displayImage = null;
    down = false;
    up = false;
    left = false;
    right = false;

    constructor(id, displayImage) {
        this.id = id;
        this.displayImage = displayImage;
    }
}

export default class HelloWorldScene extends Phaser.Scene {

    players = [];
    down = false;

    constructor() {
        super('hello-world')
    }

    create() {
        console.log(this.physics.world.bounds)

        this.socket = getSocket();
        this.socket.addEventListener('open', () => {
            axios.post('http://localhost:8081/create', { 'gui': 'CrossArrows', 'max_players': 50 })
                .then(res => {
                    alert(res.data.code); this.socket.send(JSON.stringify(res.data))
                }).catch(error => console.log(error))
        })
        this.socket.addEventListener('message', event => {
            console.log(event)
            if (typeof event.data == 'string') {
                const data = JSON.parse(event.data)
                console.log('new player requrest')
                if (data.event_name == "player_added") {
                    console.log('added new player ' + data)
                    const newPlayer = new Player(
                        data.id,
                        this.add.rectangle(100, 100, 200, 300, 0x6666ff
                        ));
                    this.players.push(newPlayer)
                }
                else if(data.event_name === 'player_removed'){
                    const playerIndex = this.players.findIndex(player => player.id === data.id)
                    const player = this.players.find(player => player.id === data.id)
                    player.displayImage.destroy()
                    this.players.splice(playerIndex, 1)
                }
            }
            else {
                const enc = new TextDecoder();
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
            if (player.right && player.displayImage.x + player.displayImage.width / 2 < this.physics.world.bounds.right) {
                player.displayImage.x += delta * 1;
            }
            if (player.left && player.displayImage.x - player.displayImage.width / 2 > 0) {
                player.displayImage.x -= delta * 1;
            }
            if (player.up && player.displayImage.y - player.displayImage.height / 2 > 0) {
                player.displayImage.y -= delta * 1;
            }
            if (player.down && player.displayImage.y + player.displayImage.height / 2 < this.physics.world.bounds.bottom) {
                player.displayImage.y += delta * 1;
            }
        }
    }
}
