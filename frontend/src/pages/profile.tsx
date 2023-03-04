import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { LayoutGroupContext } from "framer-motion";

export default function Profil () {
    const [user, setUser] = useState({username: "", email: "", wins: 0, losses: 0})
    const router = useRouter();

    useEffect(()=>{
        const fetch_profile = async() => {

            //WHAT IF...I'm not logged in ?
           const result = await userService.profile()
            setUser({...result})
        }
        fetch_profile()
    }, [])

    const logout = () => {
        authenticationService.deleteToken()
        router.push('/login')
    }

    return (
         <div className={styles.profilecard}>
            <h3 className={styles.h1}>My profil</h3>
            <img src="https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80" className={styles.profilepicture}>
            </img>
            <h4>My infos</h4>
            <hr/>
                <Asset title={'username'} value={user.username} />
                <Asset title={'email'} value={user.email} />
                <Asset title={'Wins:'} value={user.wins} />
                <Asset title={'Losses:'} value={user.losses} />
                <button onClick={() => logout()} className={styles.button}>Log out</button>
            <hr/>
        </div>
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
