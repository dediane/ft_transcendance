import authenticationService from '@/services/authentication-service';
import React, {useEffect} from 'react';

function Auth() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fortyTwoApiCode = searchParams.get("code");
    if (fortyTwoApiCode != null)
      authenticationService.saveToken(fortyTwoApiCode)
  }) 
  return (
    <div>
    </div>
  )
}
export default Auth
