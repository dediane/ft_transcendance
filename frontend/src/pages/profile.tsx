import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { LayoutGroupContext } from "framer-motion";
import _, { remove } from "lodash";
import { Activate2fa } from "@/components/TwoFactor";
import { AvatarUploader } from "@/components/Avatar";
import { Friends } from "@/components/FriendComponent";
import { Profil } from "@/components/ProfileComponent";
import { Stats } from "@/components/Stats";

export default function Homepage() {
    return (
        <>
        <div className={styles.container}>
            <FriendModule />
            <StatsModule />
            <ProfileModule />
        </div>
        </>
    )
}
const Buttons = () => {
    const [user, setUser] = useState(false)

    useEffect(()=>{
        const fetch_profile = async() => {
           const result = await userService.profile()
            setUser({...result})
        }
        fetch_profile()
    }, [])
    const handlePlay = () => {
    }
    return (
    <div className="my-auto m-8 min-w-[25%] items-center flex-1">
        <div className="m-4">
        <button className={styles.button}>
            Play PONG!
        </button>
        </div>
        <div className="m-4">
        <button className={styles.button}>
            Join Chat!
        </button>
        </div>
        <div className="m-4">
        <button className={styles.button}>
            See your Stats!
        </button>
        </div>
    </div>
    )
}

const ProfileModule = () => {
    return(
        <div className={styles.card}>
        <Profil />
        </div>
    )
}

const FriendModule = () => {
    return(
        <div className={styles.card}>
        <Friends />
        </div>
    )
}

const StatsModule = () => {
    return(
        <div className={styles.card}>
        <Stats />
        </div>
    )
}

