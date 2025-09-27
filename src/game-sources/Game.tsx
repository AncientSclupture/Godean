import React from "react";
import Phaser from "phaser";
import PlayScene from "./scene/PlayScene";

const Game = ({ accountId }: { accountId: string }) => {

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
            // scene: [PlayScene],
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            }
        };

        const game = new Phaser.Game(config);
        game.scene.add("PlayScene", PlayScene, true, { accountId });
        console.log(accountId)

        return () => {
            game.destroy(true)
        }
    }, [accountId]);

    return <div id="game-container" />
}

export default Game;