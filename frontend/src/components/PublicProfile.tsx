import userService from "@/services/user-service";
import { useContext, useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { Asset, Asset2, Asset3, Asset4, Asset5, Asset6 } from "./Stats";
import { ContextGame } from "@/game/GameContext";
import { Socket } from "socket.io-client";
type DefaultEventsMap = /*unresolved*/ any;

export default function Homepage() {
    return (
        <>
        <div className={styles.container}>
            <PublicProfil />
        </div>
        </>
    )
}

export const Online = () => {
    return(
    <div className={styles.inline}>
        <div className={styles.pastille}/>
        <p className={styles.status}>Online</p>
    </div>
    )
}

export const Offline = () => {
    return(
    <div className={styles.inline}>
        <div className={styles.pastille2}/>
        <p className={styles.status}>Offline</p>
    </div>
    )
}

export const InGame = () => {
    return(
    <div className={styles.inline}>
        <div className={styles.pastille3}/>
        <p className={styles.status}>Playing Pong</p>
    </div>
    )
}

export const PublicProfil = () => {
    const [user, setUser] = useState({username: "", email: "", wins: 0, losses: 0, is2fa: false, avatar: ""})
    const[userStatus, setUserStatus] = useState("offline") // ["online", "offline", "ingame"
    const router = useRouter();
    //socket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> 
    const {socket} = useContext(ContextGame);

    // public?username={username}
    useEffect(()=>{
        const fetch_profile = async() => {
            const urlParams = new URLSearchParams(window.location.search);
            const username = urlParams.get('username');
            if (!username) router.push('profile');
            const result = await userService.findPublicUser(username as string)
            setUser({...result})
            console.log(result)
        }
        fetch_profile()
    }, [router])

    useEffect(() => {
        const handleSocket = async () => {
        if (socket && socket.current) {
            socket.current.on("user_status", (data: any) => {
                console.log("ici dans handlesocket")
                if (data.username === user.username) {
                    setUserStatus(data.status)
                }
            })
        }
    }
    handleSocket()
    }, [socket, user])

    return (
        <>
        <div className={styles.card}>
            <div className="col-span-3">
                <div className="">
                    <h3 className={styles.h1}>{user.username}&apos;s profil</h3>
                    {user.avatar && <picture><img src={user.avatar} alt="user avatar" className={styles.profilepicture}/></picture>}  
                    {!user.avatar && <picture><img src="/default.png" alt="user avatar" className={styles.profilepicture}/></picture>}
                    <h4 className={styles.subtitle}>Profil infos</h4>
                    <div className={styles.stats}>
                    <Online />
                    <Offline />
                    <InGame />
                    <Asset title={'username'} value={user.username} />
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.card}>
            <h4 className={styles.h1}>{user.username}&apos;s Stats</h4>
                <div className={styles.stats}>
                     <div className={styles.row}>
                        <Asset4 title={'Games'} value={user.wins + user.losses} />
                        <Asset2 title={'Wins'} value={user.wins} />
                        <Asset3 title={'Losses'} value={user.losses} />
                    </div>
                    {/* <StackedBarChart percentage={user.wins + user.losses === 0 ? 0 : Math.round((user.wins / (user.wins + user.losses)) * 100)} /> */}
                    <Asset5 title={'Points'} value={(user.wins * 50) + (user.losses * 10)}/>
                    <Asset6 title={'Winrate'} value={user.wins + user.losses === 0 ? 0 : Math.round((user.wins / (user.wins + user.losses)) * 100)} />
                </div>
             </div>
        </>
    )
}
