import authenticationService from "@/services/authentication-service";
import userService from "@/services/user-service";
import { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css"
import { useRouter } from "next/router";
import { Activate2fa } from "@/components/TwoFactor";
import { AvatarUploader } from "@/components/Avatar";
import { Button } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { io } from "socket.io-client";

const Asset = ({title , value} : {title: string, value :any}) => {
    return(
        <div className="p-3">
        <p className="text-lg text-zinc-500 ">{title} </p>
        <p className="font-normal text-base">{value}</p>
        </div>
    )
}

const EditUsername = ({value} : {value :any}) => {
    const [inputValues, setInputValues] = useState<any>();
    const checkAvailability = async() => {
        await userService.updateUsername(value, inputValues);
    }
    return(
        <div className="p-3">
        <p className="text-lg text-zinc-500 ">username editable</p>
        <input 
        onChange={(e) => setInputValues(e.target.value)}
        placeholder={value}
        />
        <button onClick={checkAvailability}>Change</button>
        </div>
    )
}


export const Profil = () => {
    const [user, setUser] = useState({username: "", email: "", wins: 0, losses: 0, is2fa: false, avatar: "", login42: ""})
    const [qrcode, setQrcode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatar, setIsAvatar] = useState(false);
    const [AvatarUrl, setAvatarUrl] = useState("");
    const [isDynamic, setIsDynanic] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [isGaming, setIsGaming] = useState(false);




    const logout = () => {
        authenticationService.deleteToken()
        router.push('/login')
    }

    useEffect(()=>{
        const fetch_profile = async() => {

            //WHAT IF...I'm not logged in ?
           const result = await userService.profile()
            setUser({...result})
        }
        if(!authenticationService.getToken()) 
            router.push('/login')
        try {
        fetch_profile()
        } catch (error) {
            console.log(error)
            authenticationService.deleteToken()
            router.push('/login')
        }
    }, [isDynamic, router])

    useEffect(() => {
        const socket = io('http://localhost:8000'); // Replace with your server URL or access the existing socket instance
        socket.on('connect', () => {
            setIsOnline(true);
        }
        );
    }, [isOnline])


 

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

    const handleAvatar = (user :any) => {
        setAvatarUrl(user.getAvatar());
    }

    const handleDynamic = () => {
        setErrorMessage("");
        setIsDynanic(!isDynamic);
    }

    const [errorMessage, setErrorMessage] = useState('');

    const [inputValues, setInputValues] = useState<any>();
    const checkAvailability = async() => {
        setErrorMessage("");
        if (!inputValues)
        {
            handleDynamic();
            return;
        }
        const res = await userService.updateUsername(user.username, inputValues);
        if (res.status == true)
        {
            setErrorMessage("");
            setUser({...user, username: inputValues})
            handleDynamic()
        }
        else {
            setErrorMessage('Username already taken.');
        }
;
    }


    return (
        
        <>
            <div className={styles.mainbox}>
                <h3 className={styles.h1}>My profile</h3>
                <div>
                {!user.avatar && 
                <picture>
                    <img src="/default.png" alt="user avatar" className={styles.profilepicture}/>
                </picture>}
                {user.avatar && 
                <picture>
                    <img src={`${user.avatar}`} alt="user avatar" className={styles.profilepicture}/>
                </picture> }
                {
                    isAvatar ? <button onClick={handleIsAvatar} className={styles.editbutton}>close</button> : <button onClick={handleIsAvatar} className={styles.editbutton}>edit</button>}
                {isAvatar && <AvatarUploader handleUpload={handleAvatarUpload}/>}
                </div>
                    
                <h4 className={styles.subtitle}>My infos <FaEdit className={styles.icon} onClick={handleDynamic}/></h4>
                <div className={styles.stats}>
                    
                    { isDynamic ?
                    <div className="p-3">
                    <p className="text-lg text-zinc-500 ">username</p>
                    <div className={styles.inputContainer}>
                    <input 
                    onChange={(e) => setInputValues(e.target.value)}
                    placeholder={user.username}
                    className={styles.littleinput}
                    />
                    <button onClick={checkAvailability} className={styles.littlebuttonblack}>update</button>
                    </div>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    </div>
                    //<EditUsername value={user.username}/> 
                    : <Asset title={'username'} value={user.username} />}
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