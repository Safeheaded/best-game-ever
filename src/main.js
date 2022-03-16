import Phaser from 'phaser'
import HelloWorldScene from './scenes/HelloWorldScene'
import axios from 'axios'
import { getSocket } from './socket'

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
	scene: [HelloWorldScene]
}


const game = new Phaser.Game(config)

export default game;
