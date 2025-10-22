import React from "react";
import MainActifityScene from "./main-acifity";

const MainActivityGame = () => {
    React.useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "game-container",
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 }
                },
            },
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        const game = new Phaser.Game(config);
        game.scene.add("MainActifityScene", MainActifityScene)

        game.scene.start("MainActifityScene");

        return () => {
            game.destroy(true)
        }
    }, [])

    return <div id="game-container" />
}

export default MainActivityGame;
