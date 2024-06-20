import Phaser from 'phaser';
import GlobalData from './GlobalData';

const sceneScales = [0.3, 0.3, 0.3, 0.3, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];

export default class ReplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ReplayScene' });
        this.scenecounter = 0;
    }

    preload() {
        // Load audio file
        this.load.audio('bdayAudio', '../Assets/bday.mp3');
    }

    create() {
        // Set background color
        this.cameras.main.setBackgroundColor('#444444'); // Dark grey background

        // Access movement data from GlobalData
        const levels = Object.keys(GlobalData.playerMovementData);

        this.time.delayedCall(500, () => {
            this.drawPaths(levels);
        });
    }

    drawPaths(levels) {
        levels.forEach((level, index) => {
            if (this.scenecounter >= sceneScales.length) return;
            const data = GlobalData.playerMovementData[level];
            const scale = sceneScales[this.scenecounter];
            const position = this.calculatePosition(this.scenecounter);

            // Display the replay data at the calculated position with the specified scale
            this.displayReplayData(position, data, scale, this.scenecounter * 2000);
            this.scenecounter++;
        });
    }

    calculatePosition(scenecounter) {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const topHalfY = screenHeight / 4 - 100;
        const bottomHalfY = (3 * screenHeight) / 4 - 100;
        const topHalfCount = 5;
        const bottomHalfCount = 8;

        let x, y;
        if (scenecounter < topHalfCount) {
            // Top half, left to right
            x = (screenWidth / (topHalfCount + 1)) * (scenecounter + 1) - screenWidth / (2 * (topHalfCount + 1));
            y = topHalfY;
        } else {
            // Bottom half, left to right
            x = (screenWidth / (bottomHalfCount + 1)) * (scenecounter - topHalfCount + 1) - screenWidth / (2 * (bottomHalfCount + 1));
            y = bottomHalfY;
        }

        return { x, y };
    }

    displayReplayData(position, data, scale, delay) {
        if (data.length === 0) return;

        // Create a graphics object to draw the movement path
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xff0000);

        // Use the initial point as the starting position
        graphics.beginPath();
        graphics.moveTo(position.x + data[0].x * scale, position.y + data[0].y * scale);

        // Create a tween to draw the path dynamically
        this.tweens.addCounter({
            from: 0,
            to: data.length - 1,
            duration: data.length * 50, // Adjust speed as needed
            delay: delay,
            onUpdate: (tween) => {
                const index = Math.floor(tween.getValue());
                if (index < data.length - 1) {
                    const nextPoint = data[index + 1];
                    graphics.lineTo(position.x + nextPoint.x * scale, position.y + nextPoint.y * scale);
                    graphics.strokePath();
                }
            },
            onComplete: () => {
                // Finalize the path if needed
                graphics.strokePath();
                
                
            }
        });
        this.sound.play('bdayAudio');
    }
}
