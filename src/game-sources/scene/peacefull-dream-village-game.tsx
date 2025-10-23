import React from "react";
import PeacefullVillageScene from "./peacefull-village";

const PeacefullVillageDreamGame = () => {
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
        game.scene.add("PeacefullVillageScene", PeacefullVillageScene)

        game.scene.start("PeacefullVillageScene");

        return () => {
            game.destroy(true)
        }
    }, [])

    return <div id="game-container" />
}

export default PeacefullVillageDreamGame;
