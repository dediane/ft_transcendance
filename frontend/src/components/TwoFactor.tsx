import React, { useState } from 'react';
import userService from '@/services/user-service';
import styles from '@/styles/Profile.module.css';
import { useRouter } from 'next/router';
import authenticationService from '@/services/authentication-service';

export const Activate2fa = ({qrcode}: any, {is2fa} :any) => {
    const router = useRouter();
    const [inputValues, setInputValues] = useState({
        twoFactorAuthenticationCode: '',});
    const logout = () => {
        authenticationService.deleteToken()
        router.push('/login')
    }
    // const [TwoFactorAuthenticationCode, setTwoFactorAuthenticationCode] = useState('')
    const enable2fa = async() => {
        console.log("Code = ", inputValues.twoFactorAuthenticationCode)
        const result = await userService.activate2fa(inputValues.twoFactorAuthenticationCode);
        if(result.status) {
            console.log("2FA ACTIVATED")
            logout();
            //Logout
            //Redirect to login
        }
    }

    const disable2fa = async() => {
        console.log("Code =     ", inputValues.twoFactorAuthenticationCode)
        const result = await userService.disable2fa(inputValues.twoFactorAuthenticationCode);
    }
    return (
        <>
        <p>Scan the QR code with your 2FA app</p> 
        {console.log(qrcode)}
        <img src={qrcode} className={styles.qrcode}/>
        <input 
        onChange={(e) => setInputValues({...inputValues, twoFactorAuthenticationCode: e.target.value})}
        type="text" 
        placeholder="Enter your 2FA code" 
        className={styles.inputbox}
        />
        {console.log("INPUT VALUES: ", inputValues)}
        {is2fa ?  <button className={styles.button} onClick={() => disable2fa()}>Disable</button> : <button className={styles.button} onClick={() => enable2fa()}>Activate</button>}
        </>
    )
}