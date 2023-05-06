import Game from '@/components/Game'
import React, { useEffect, useRef } from 'react'
import styles from "../styles/Game.module.css"
import io, {Socket} from "socket.io-client"


export default function Pong() {

    // // our socket 
    // const connect = () => {
    //     const socket = io("http://localhost:8000")
    //     //socket.emit("join_game");
    //     socket.on("connect", () => {
    //         socket.emit("custom_event", { name : "Alex", age: 19});
    //     });

    // };

    // useEffect(() => {
    //     connect();
    // }, []);

    return (
        <Game />
    )
}
