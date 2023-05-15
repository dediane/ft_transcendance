import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { LayoutGroupContext } from "framer-motion";
import _, { remove } from "lodash";
import { Activate2fa } from "@/components/TwoFactor";
import { AvatarUploader } from "@/components/Avatar";
import { Searchbar, Friends } from "@/components/FriendComponent";
export default function Homepage() {
    return (
        <>
        <div className={styles.container}>
            <FriendModule />
            {/* <Buttons /> */}
            <Profil />
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
        console.log(user)
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

const Profil = () => {
    const [user, setUser] = useState({username: "", email: "", wins: 0, losses: 0, is2fa: false, avatar: ""})
    const [qrcode, setQrcode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

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

    const handleCloseModal = () => {
        setShowModal(false);
    };

    
    const handleAvatarUpload = (newAvatarUrl: any) => {
        setUser((prevUser) => ({ ...prevUser, avatar: newAvatarUrl }));
    };


    return (
        <>
         <div className={styles.card}>
            <div className="col-span-3">
                <div className="">
                    <h3 className={styles.h1}>My profil</h3>
                    
                    {!user.avatar && <img src="https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGZhY2V8ZW58MHx8MHx8&w=1000&q=80" className={styles.profilepicture}>
                    </img>}
                    {user.avatar && <img src={`${user.avatar}`} className={styles.profilepicture}/> }
                    <AvatarUploader handleUpload={handleAvatarUpload}/>
                    <h4>My infos</h4>
                    <hr/>
                        <Asset title={'username'} value={user.username} />
                        <Asset title={'email'} value={user.email} />
                        <Asset title={'Wins:'} value={user.wins} />
                        <Asset title={'Losses:'} value={user.losses} />
                        <div>
                        {!user.is2fa ? <button onClick={() => active2fa()} className={styles.buttonalert}>Activate 2FA</button> : ""}
                        {user.is2fa ? 
                        <div>
                            <button onClick={() => setIsOpen(!isOpen)} className={styles.buttonalert}>Disable 2FA </button> 
                            {isOpen && <input placeholder="Enter 2FA code" className={styles.inputbox} onChange={(e) => disable2fa(e.target.value, setUser)}/>}
                        </div>
                        : ""}
                        
                        {showModal && (
                            <div className="">
                            <Activate2fa qrcode={qrcode}/>
                            </div>
                         )}
                        </div>
                        <button onClick={() => logout()} className={styles.buttonalert}>Log out</button>
                </div>
                <div className={styles.modal}>
                </div>
                {/* <img src={qrcode ? qrcode: ''} className={styles.qrcode}/> */}
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

const FriendModule = () => {
    return(
        <div className={styles.card}>
        <Searchbar />
        <Friends />
        </div>
    )
}
