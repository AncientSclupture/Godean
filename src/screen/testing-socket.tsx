import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:7890"); // ganti sesuai alamat server

function TestSocket() {
    const [players, setPlayers] = useState<{ [id: string]: { x: number; y: number } }>({});
    const roomId = "p2e";

    useEffect(() => {
        // Join room waktu komponen mount
        socket.emit(`join:${roomId}`);

        // Listen update state
        socket.on(`listenupdate:${roomId}`, (state) => {
            setPlayers(state);
        });

        socket.on(`update:${roomId}`, (state) => {
            setPlayers(state);
        });

        // Bersihin listener waktu unmount
        return () => {
            socket.off(`listenupdate:${roomId}`);
            socket.off(`update:${roomId}`);
        };
    }, []);

    // Kontrol keyboard → kirim dx, dy ke server
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            let dx = 0, dy = 0;
            if (e.key === "ArrowUp") dy = -5;
            if (e.key === "ArrowDown") dy = 5;
            if (e.key === "ArrowLeft") dx = -5;
            if (e.key === "ArrowRight") dx = 5;

            if (dx || dy) {
                socket.emit(`update:${roomId}`, { dx, dy });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div>
            <h1>Hallo Test Socket - Room {roomId}</h1>
            <h2>Players:</h2>
            <ul>
                {Object.entries(players).map(([id, pos]) => (
                    <li key={id}>
                        {id}: ({pos.x}, {pos.y})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TestSocket;
