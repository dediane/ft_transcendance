import authenticationService from '@/services/authentication-service';
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import userService from '@/services/user-service';
import { connect } from 'http2';

const ConnectOTP = () => {
  const router = useRouter()
  const otpLoad = (code: string) => {
    if(code.length === 6) {
      userService.authenticate2fa(code).then((res: any) => { 
        authenticationService.saveToken(res.access_token)
        router.push("/profile")
      }).catch((err: any) => {
        // console.log(err)
      })
    }
  }
  return (
    <div>
      <input onChange={(e) => otpLoad(e.target.value)} title="otp" placeholder='Enter OTP'/>
    </div>
  )
}

function Auth() {
  const router = useRouter()
  const [otp, setOtp] = useState(false)
  useEffect(() =>{

    const get_code = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const fortyTwoApiCode = await searchParams.get("code");
      if (fortyTwoApiCode != null)
      {
        await authenticationService.saveToken(fortyTwoApiCode)
        const result = await userService.is2fa()
        if (result.status == false) {
          console.log("2fa not enabled")
          router.push('/profile')
        }
        if(result.status == true) {
          setOtp(true)
          console.log("2fa enabled")
        }
      }
    }

    get_code()
  }, []) 
  return (
    <div>
      {otp && <ConnectOTP/>}
    </div>
  )
}
export default Auth