import React from "react";
import FiSimScene from "./scene/FiSimulation";

const FiGame = ({ accountId }: { accountId: string }) => {
    React.useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "game-container",
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                }
            },
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            }
        };

        const game = new Phaser.Game(config);
        game.scene.add("FiSimScene", FiSimScene);

        game.scene.start("FiSimScene", { accountId });

        return () => {
            game.destroy(true)
        }
    }, [accountId]);

    return <div id="game-container" />
}

export default FiGame;