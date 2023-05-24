import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { LayoutGroupContext } from "framer-motion";
import _, { remove } from "lodash";

export default function Homepage() {
    return (
        <>
        <div className={styles.container}>
            <PublicProfil />
        </div>
        </>
    )
}

export const PublicProfil = () => {
    const [user, setUser] = useState({username: "", email: "", wins: 0, losses: 0, is2fa: false, avatar: ""})
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

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
    }, [])

    const handleCloseModal = () => {
        setShowModal(false);
    };
    return (
        <>
         <div className={styles.card}>
            <div className="col-span-3">
                <div className="">
                    <h3 className={styles.h1}>{user.username}'s profil</h3>
                    {user.avatar ? <img src={user.avatar} className={styles.profilepicture} /> : <img src="/default.png" className={styles.profilepicture}/>}
                    <h4 className={styles.subtitle}>Profil infos</h4>
                <div className={styles.stats}>
                        <Asset title={'username'} value={user.username} />
                </div>
                        <Asset title={'Wins:'} value={user.wins} />
                        <Asset title={'Losses:'} value={user.losses} />
                    </div>
                <div className={styles.modal}>
                </div>
            <hr/>
            </div>
        </div>
        </>
    )
}


const Asset = ({title , value} : {title: string, value :any}) => {
    return(
        <div className="p-3">
        <p className="text-xs text-gray-500 ">{title} </p>
        <p>{value}</p>
        </div>
    )
}

