import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { LayoutGroupContext } from "framer-motion";
import _, { remove } from "lodash";
import { PublicProfil } from "@/components/PublicProfile";
import authServiceInstance from "@/services/authentication-service";
export default function Homepage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    useEffect(()=>{
        if(!authServiceInstance.isAuthentificated()) {
            router.push('/login')
        } else {
            setLoading(true)
        }
    }, [])
    return (
        <>
        <div className={styles.container}>
           {loading && <PublicProfil />}
            
        </div>
        </>
    )
}