import Phaser from 'phaser';

export default class ExplanationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'explanationScene' });
    }

    preload() {
        // Load audio file
        this.load.audio('trickedAudio', '../Assets/tricked.mp3');
    }

    create() {
        // Play the audio file
        this.sound.play('trickedAudio');

        // Add text
        const message = "Hi hun! Hope you've been having a good day! However, I actually tricked you... into spelling something by moving your character, you'll see exactly what on the next screen";
        const textStyle = {
            fontSize: '24px',
            fill: '#ffffff',
            wordWrap: { width: this.cameras.main.width - 40 }
        };
        this.add.text(20, 20, message, textStyle);

        // Add button
        const buttonText = "Next Screen";
        const button = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, buttonText, {
            fontSize: '32px',
            fill: '#ff0000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Button click event
        button.on('pointerdown', () => {
            this.scene.start('ReplayScene');
        });
    }
}
