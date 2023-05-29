import authenticationService from '@/services/authentication-service';
import React, {useEffect} from 'react';
import { useRouter } from 'next/router';
import userService from '@/services/user-service';

const is2faEnabled = async () => {
  const result = await userService.is2fa()
  return result;
}

function Auth() {
  const router = useRouter()
  useEffect(() =>{
    const searchParams = new URLSearchParams(window.location.search);
    const fortyTwoApiCode = searchParams.get("code");
    if (fortyTwoApiCode != null)
    {
      authenticationService.saveToken(fortyTwoApiCode)
      if (!is2faEnabled())
        router.push('/profile')
      else
        router.push('/2fa')
    }
  }) 
  return (
    <div>
    </div>
  )
}
export default Auth
