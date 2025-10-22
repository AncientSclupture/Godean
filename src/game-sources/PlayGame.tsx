import React from "react";
import Phaser from "phaser";
import NewScene from "./scene/NewScene";

const PlayGame = ({ accountId }: { accountId: string }) => {
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
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            }
        }
        const game = new Phaser.Game(config);
        game.scene.add("NewScene", NewScene);
        game.scene.start("NewScene", { accountId });
        return () => {
            game.destroy(true)
        }
    }, [accountId]);

    return <div id="game-container" />
}

export default PlayGame;