import React from "react";
import FisimWhoIsFraudScene from "./fisim-who-is-fraud";

const FisimWhoIsFraudGame = () => {
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
        game.scene.add("FisimWhoIsFraudScene", FisimWhoIsFraudScene)

        game.scene.start("FisimWhoIsFraudScene");

        return () => {
            game.destroy(true)
        }
    }, [])

    return <div id="game-container" />
}

export default FisimWhoIsFraudGame;
