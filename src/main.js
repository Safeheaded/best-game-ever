import Phaser from 'phaser'
import HelloWorldScene from './scenes/HelloWorldScene'
import axios from 'axios'

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

axios.post('http://localhost:8081/create', { 'gui': 'ArrowsHorizontal', 'max_players': 2 })
	.then(res => console.log(res)).catch(error => console.log(error))

const game = new Phaser.Game(config)

export default game;
