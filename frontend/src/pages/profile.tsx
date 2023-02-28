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
        <>
         <div className={styles.profilecard}>
            <h3 className={styles.h1}>
                My profil
            </h3>
            <img src="https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80" className={styles.profilepicture}>
            </img>
            <h4>
                My infos
            </h4>
            <hr/>
            <div className="p-4">
                <div className="pb-2 ">
                <p className="text-xs text-gray-500 ">
                    username
                </p>
                <p>{user.username}</p>
                </div>
                <div className="pb-2 ">
                <p className="text-xs text-gray-500">
                    email
                </p>
                <p>{user.email}</p>
                </div>
            </div>
            <h4>
                My infos
            </h4>
            <hr/>
            <div className="p-4">
                <div className="pb-2 flex justify-between">
                <p className="text-xs text-gray-500 ">
                    Wins: 
                </p>
                <p className="flex-1">{user.wins}</p>
                </div>
                <div className="pb-2 flex justify-between">
                <p className="text-xs text-gray-500">
                    Losses:
                </p>
                <p>{user.losses}</p>
                </div>
                <button onClick={() => logout()}>
                    Log out
                </button>
            </div>
            <hr/>
        </div>
        </>
    )
}
