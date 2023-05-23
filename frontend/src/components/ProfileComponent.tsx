import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { Activate2fa } from "@/components/TwoFactor";
import { AvatarUploader } from "@/components/Avatar";
import { Button } from "@chakra-ui/react";

const Asset = ({title , value} : {title: string, value :any}) => {
    return(
        <div className="p-3">
        <p className="text-lg text-zinc-500 ">{title} </p>
        <p className="font-normal text-base">{value}</p>
        </div>
    )
}

export const Profil = () => {
    const [user, setUser] = useState({username: "", email: "", wins: 0, losses: 0, is2fa: false, avatar: ""})
    const [qrcode, setQrcode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatar, setIsAvatar] = useState(false);

    useEffect(()=>{
        const fetch_profile = async() => {

            //WHAT IF...I'm not logged in ?
           const result = await userService.profile()
            setUser({...result})
        }
        if(!authenticationService.getToken()) 
            router.push('/login')
        fetch_profile()
    }, [])

    const logout = () => {
        authenticationService.deleteToken()
        router.push('/login')
    }

    const active2fa = async() => {
        const  qrcode = await userService.generate2fa()
        setQrcode(qrcode)
        setShowModal(true)
    }

    const disable2fa = async (code: any, setUser: any) => {
        if(code.length === 6) {
            const result = await userService.disable2fa(code)
            if(result.status) {
                setUser({...user, is2fa: false})
            }
            else {
                alert("Wrong code")
            }
        }
    }

    const handleAvatarUpload = (newAvatarUrl: any) => {
        setUser((prevUser) => ({ ...prevUser, avatar: newAvatarUrl }));
    };

    const handleIsAvatar = () => {
        setIsAvatar(!isAvatar);
    };

    return (
        <>
            <div className={styles.mainbox}>
                <h3 className={styles.h1}>My profile</h3>
                <div>
                {!user.avatar && <img src="https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80" className={styles.profilepicture}>
                </img>}
                {user.avatar && <img src={`${user.avatar}`} className={styles.profilepicture}/> }
                {isAvatar ? <button onClick={handleIsAvatar} className={styles.editbutton}>close</button> : <button onClick={handleIsAvatar} className={styles.editbutton}>edit</button>}
                {isAvatar && <AvatarUploader handleUpload={handleAvatarUpload}/>}
                </div>
                    
                <h4 className={styles.subtitle}>My infos</h4>
                <div className={styles.stats}>
                    <Asset title={'username'} value={user.username} />
                    <Asset title={'email'} value={user.email} />
                </div>
                
                {/* 2FA & Logout */}
                <div>
                    {!user.is2fa ? (
                        <button onClick={() => active2fa()} className={styles.buttonalert}>
                        Activate 2FA
                        </button>
                    ) : (
                        <div>
                        <button onClick={() => setIsOpen(!isOpen)} className={styles.buttonalert}>
                            Disable 2FA
                        </button>
                        {isOpen && (
                            <input
                            placeholder="Enter 2FA code"
                            className={styles.inputbox}
                            onChange={(e) => disable2fa(e.target.value, setUser)}
                            />
                        )}
                        </div>
                    )}
                    {showModal && (
                        <div className={styles.qrCodeContainer}>
                        <Activate2fa qrcode={qrcode} is2fa={user.is2fa} />
                        </div>
                    )}
                </div>
                <button onClick={() => logout()} className={styles.buttonalert}>Log out</button>
            </div>
        </>
    )
}