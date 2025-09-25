import React from "react";
import Phaser from "phaser";
import PlayScene from "./scene/PlayScene";

const Game = () => {
    React.useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "game-container",
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    // debug: true
                }
            },
            scene: [PlayScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            }
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true)
        }
    }, []);

    return <div id="game-container" />
}

export default Game;