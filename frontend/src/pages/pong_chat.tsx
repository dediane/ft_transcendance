import Game from '@/components/GameChat'
import React, { useEffect, useRef } from 'react'
import styles from "../styles/Game.module.css"
import io, {Socket} from "socket.io-client"


export default function Pong() {

    return (
        <Game />
    )
}