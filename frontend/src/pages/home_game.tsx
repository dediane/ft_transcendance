import React from 'react';
import styles from '@/styles/Login.module.css'
import { useRouter } from "next/router";
import Link from "next/link";


export const home_game = () => {
    const router = useRouter();

    const handleClick = (path: string) => {
      if (path === "pong") {
        router.push(path);
      }
      if (path === "game") {
        router.push(path);
      }}
    return (
        <div>
        <title>Hello</title>
        
        <button className={styles.button} onClick={() => handleClick("pong")}>
        Classic game</button>
        <button  className={styles.button} onClick={() => handleClick("game")}>
        Special game</button>
        </div>
    );
}
export default home_game;