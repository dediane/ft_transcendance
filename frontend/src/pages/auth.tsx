import authenticationService from '@/services/authentication-service';
import React, {useEffect} from 'react';
import { useRouter } from 'next/router';
import userService from '@/services/user-service';

function Auth() {
  const router = useRouter()
  useEffect(() =>{
    const searchParams = new URLSearchParams(window.location.search);
    const fortyTwoApiCode = searchParams.get("code");
    if (fortyTwoApiCode != null)
    {
      authenticationService.saveToken(fortyTwoApiCode)
      const user = userService.profile();
      router.push('/profile')
    }
  }) 
  return (
    <div>
    </div>
  )
}
export default Auth
