import {useEffect, useState} from "react"
import gameService from "@/services/game-service"
import styles from "@/styles/History.module.css"
import Link from "next/link"
import UserHistory from "./userHistory"
import AuthService from "../services/authentication-service"

export default function History () {
    useEffect(() => {

        const token =  AuthService.getToken();
    
        if (!token) {
          window.location.href = "/login";
        }
      }, []);
    return (
        <>
        <Games />
        <UserHistory />
        </>
    )
}

export const Games = () => {
    const [games, setGames] = useState<any>([])
    useEffect (() => {
        const fetchGames = async () => {
            const res = await gameService.get_games()
            if (res) {
                setGames(res)
            }
        }
        fetchGames();
    },[])
    return (
        <>
        <div className={styles.container}>
        <h1 className={styles.h1}>Match history</h1>
        <table className={styles.table}>
        <thead>
            <tr>
                <th>WINNER</th>
                <th>Player A</th>
                <th>Player B</th>
                <th>Score A</th>
                <th>Score B</th>
            </tr>
        </thead>
        {games.map((current:any) => {
            const { player1, player2, score1, score2 } = current;
            return (
        <tbody key={current.id}>
            <tr>
                <td className={styles.bold2}>👑 <br></br>{score1 < score2 ? player2.username : player1.username}</td>
                <td className={styles.bold}>
                    <div className={styles.avatarContainer}>
                        {player1.avatar && <picture><img src={`${player1.avatar}`} alt="avatar user" className={styles.profilepicture}/></picture>}
                        {!player1.avatar && <picture><img src="/default.png" alt="avatar user" className={styles.profilepicture}></img></picture>}
                        <Link href={`/public?username=${player1.username}`}>
                            {player1.username}
                        </Link>
                    </div>
                </td>
                <td className={styles.bold}>
                    <div className={styles.avatarContainer}>
                        {player2.avatar && <picture><img src={`${player2.avatar}`} alt="avatar user" className={styles.profilepicture}/></picture>}
                         {!player2.avatar && <picture><img src="/default.png" alt="avatar user" className={styles.profilepicture}></img></picture>}
                        <Link href={`/public?username=${player2.username}`}>
                            {player2.username}
                        </Link>
                    </div>
                </td>
                <td className={styles.number}>{score1} {score1 < score2 ? "🔴" : "🟢" }</td>
                <td className={styles.number}>{score2}  {score1 < score2 ? "🟢" : "🔴" }</td>
            </tr>
        </tbody>
            )
        })}
    </table>
    </div>
    </>
    )
}