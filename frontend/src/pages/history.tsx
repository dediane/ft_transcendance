import {useEffect, useState} from "react"
import gameService from "@/services/game-service"
import styles from "@/styles/History.module.css"

export default function History () {
    return (
        <>
        <Games />
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
                console.log(res)
            }
        }
        fetchGames();
    },[])
    return (
        <>
        <div className={styles.container}>
        <h1>This is the match history</h1>
        <table className={styles.table}>
      <thead>
        <tr>
          <th>Player A</th>
          <th>Player B</th>
          <th>Score A</th>
          <th>Score B</th>
        </tr>
      </thead>
        {games.map((current:any) => {
            const { player1, player2, score1, score2 } = current;
            return (
      <tbody>
        <tr key={current.id} >
                <td>{player1.username}</td>
                <td>{player2.username}</td>
                <td>{score1}</td>
                <td>{score2}</td>
        </tr>
      </tbody>
            )
        })}
    </table>
    </div>
    </>
    )
}