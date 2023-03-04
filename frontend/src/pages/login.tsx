import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Login.module.css'
import  axios  from 'axios'
import { useEffect, useState } from 'react'
import userService from '@/services/user-service'
import { useRouter } from 'next/router' 
import authenticationService from '@/services/authentication-service'
import axiosService from '@/services/axios-service'

export default function Login () {
    return <>
        <Authentication/>
    </>
}

export const PongAnimation = () => {
  return (
    <>
      <div className={styles.field}>
      <div className={styles.net}></div>
      <div className={styles.ping}></div>
      <div className={styles.pong}></div>
      <div className={styles.ball}></div>
      </div>
    </>
  )
}

export const Authentication = () => {
  const [register, setRegister] = useState(false)
  return (
    <div className="mx-auto flex-wrap md:flex md:m-10 md:px-8">
      <div className='mx-auto max-w-lg flex-1 lg:pr-8 my-4'>
        <h1 className={styles.title}>Transcendence</h1>
        <h2 className={styles.h2}>Come and play Pong!</h2>
        <PongAnimation/>
      </div>
      <div className={styles.card}>
        {register && <Registration setRegister={setRegister} />}
        {!register && <LoginForm setRegister={setRegister} />}
      </div>
    </div>
  )
}

export const LoginForm = ({setRegister} : {setRegister: any}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    if(authenticationService.isAuthentificated()) {
      router.push("/profile");
    }
  }, [])
  const handleLogin = async () => {
    const result = await userService.login(email, password)
    if(result.access_token ) {
      // console.log("Success")
      // console.log(result.access_token)
      authenticationService.saveToken(result.access_token)
      router.push("/profile");
    }
  }
  return (
  <div>
    <h1 className={styles.title2}>Log in</h1>
    <p className={styles.description}>
    We’re looking for amazing Pong player!<br/>
    Become a part of our rockstar gaming team!</p>
    <div className=" mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">
        <InputBox1 setEmail={setEmail}/>
        <InputBox2 setPassword={setPassword}/>
        <button onClick={() => handleLogin()} className={styles.button}>
            Log in
        </button>
        <div>
        <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5753bb274e59271c67234cf035d516277439caa594f17226ed3e6d40266050cc&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fcallback&response_type=code">
        <button className={styles.button}>
          Connect with 42
        </button>
        </a>
        </div>
      <p className="text-center text-sm text-gray-500">
        No account? 
        <a className="underline" onClick={() => setRegister(true)}> Sign up</a>
      </p>
    </div>
  </div>
  )
}

export const Registration = ({setRegister} : {setRegister :any}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [username, setUsername] = useState('')

    const handleRegister = async () => {
        if (password != passwordCheck)
        {
            //send alert password mismatch
            return;
        }
        const result = await userService.register(username, email, password)
        //send success
    }
    return (
        <div>
          <h1 className={styles.title2}>Welcome to Pong game!</h1>
          <p className="mx-auto mt-4 max-w-md text-center text-gray-500 px-8">
          We’re looking for amazing Pong player just like you!
          Become a part of our rockstar gaming team !</p>
          <div className="mt-6 mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">
            <p className="text-center text-lg font-medium">Create your account</p>
              <InputBox3 setUsername={setUsername}/>
              <InputBox1 setEmail={setEmail}/>
              <InputBox2 setPassword={setPassword}/>
              <InputBox4 setPasswordCheck={setPasswordCheck}/>
              <button onClick={() => handleRegister()} className={styles.button}>
              Register
              </button>
              <button onClick={() => userService.finduser()} className={styles.button}>
                Connect with 42
              </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?
              <a className="underline"  onClick={() => setRegister(false)}> Sign in</a>
            </p>
          </div>
        </div>
    )
}

export const InputBox1 = ({setEmail} : {setEmail :any}) => {
    return (      <div>
        <label htmlFor="email" className="sr-only">Email</label>

        <div className="relative">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className={styles.input}
            placeholder="Enter email"
          />
          <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
          </span>
        </div>
      </div>)
}

export const InputBox2 = ({setPassword} : {setPassword :any}) => {
    return (
        <div>
        <label htmlFor="password" className="sr-only">Password</label>

        <div className="relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className={styles.input}
            placeholder="Enter password"
          />
          <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
          </span>
        </div>
      </div>
    )
}

export const InputBox3 = ({setUsername} : {setUsername :any}) => {
    return (
        <div>
        <label htmlFor="username" className="sr-only">Username</label>

        <div className="relative">
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="username"
            className={styles.input}
            placeholder="Choose a username"
          />
          <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
          </span>
        </div>
      </div>
    )
}

export const InputBox4 = ({setPasswordCheck} : {setPasswordCheck :any}) => {
    return (
        <div>
        <label htmlFor="password" className="sr-only">Password</label>

        <div className="relative">
          <input
            onChange={(e) => setPasswordCheck(e.target.value)}
            type="password"
            className={styles.input}
            placeholder="Confirm your password"
          />
          <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
          </span>
        </div>
      </div>
    )
}

