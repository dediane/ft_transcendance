import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { LayoutGroupContext } from "framer-motion";
import _, { remove } from "lodash";
import { PublicProfil } from "@/components/PublicProfile";

export default function Homepage() {
    return (
        <>
        <div className={styles.container}>
            <PublicProfil />
            
        </div>
        </>
    )
}