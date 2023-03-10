import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Login.module.css'
import  axios  from 'axios'
import { useEffect, useState } from 'react'
import userService from '@/services/user-service'
import { useRouter } from 'next/router' 
import authenticationService from '@/services/authentication-service'
import axiosService from '@/services/axios-service'
import Confetti from 'react-dom-confetti';                                                                  

export default function Login () {
    return <>
        <Authentication/>
    </>
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

const handleLogin = async ({email, password, setError, router} : {email :string, password :string, setError :any, router :any}) => {
  if (!email || !password){
      setError('Missing credential')
      return
  }
  const result = await userService.login(email, password)
  console.log(result);
  if (!result.status) {
    setError(result.error)}
  if(result.access_token ) {
    authenticationService.saveToken(result.access_token)
    router.push("/profile");
  }
}  

export const LoginForm = ({setRegister} : {setRegister: any}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if(authenticationService.isAuthentificated()) {
      router.push("/profile");
    }
  }, [])
  return (
  <div>
    <h1 className={styles.title2}>Log in</h1>
    <p className={styles.description}>
    We’re looking for amazing Pong player!<br/>
    Become a part of our rockstar gaming team!</p>
    <div className=" mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">
        <InputBox setData={setEmail} title="email" label="Email" placeholder='Enter email'/>
        <InputBox setData={setPassword} title="password" label="Password" placeholder='Enter password'/>
        <div className={styles.error}>{error}</div>
        <button onClick={() => handleLogin({email, password, setError, router})} className={styles.button}>
            Log in
        </button>
        <Connect42 />
      <p className="text-center text-sm text-gray-500">
        No account? 
        <a className="underline" onClick={() => setRegister(true)}> Register</a>
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
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleRegister = async () => {
        if (password != passwordCheck)
        {
          setError('Password mismatch')
          return;
        }
        const result = await userService.register(username, email, password)
        if (!result.status){
          setError(result.error)
        }
        setSuccess(true)
    }
    return (
      <div>
        <h1 className={styles.title2}>Welcome to Pong game!</h1>
        <p className="mx-auto mt-4 max-w-md text-center text-gray-500 px-8">
        We’re looking for amazing Pong player just like you!
        Become a part of our rockstar gaming team !</p>
        <div className=" mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">
          <InputBox setData={setUsername} title="username" label="Username" placeholder='Enter username'/>
          <InputBox setData={setEmail} title="email" label="Email" placeholder='Enter email'/>
          <InputBox setData={setPassword} title="password" label="Password" placeholder='Enter password'/>
          <InputBox setData={setPasswordCheck} title="password" label="Password" placeholder='Confirm your password'/>
          <div className={styles.error}>{error}</div>
          <button onClick={() => handleRegister()} className={styles.button}>
          Register</button>
          <Connect42 />
          <p className="text-center text-sm text-gray-500">
            Have already an account? 
            <a className="underline" onClick={() => setRegister(false)}> Log in</a>
          </p>
          <Confetti active={success} />
          <Redirect success={success} data={{email, password, setError, router}}/>
        </div>
      </div>
    )
}

const InputBox = ({setData, title ,label, placeholder} : {setData: any, title: string,label :string, placeholder :string}) => {
  return(
      <div>
      <label htmlFor={title} className="sr-only">{label}</label>
      <div className="relative">
        <input
          onChange={(e) => setData(e.target.value)}
          type={title}
          className={styles.input}
          placeholder={placeholder}
        />
        <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
        </span>
      </div>
    </div>
  )
}

export const Connect42 = () => {
  return (
    <div>
    <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5753bb274e59271c67234cf035d516277439caa594f17226ed3e6d40266050cc&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fcallback&response_type=code">
    <button className={styles.button}>
    Connect with 42</button>
    </a>
  </div>
  )
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

const sleep = (milliseconds :number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const Redirect = ({success, data} : {success: boolean, data :any}) => {
  useEffect(() => {
    const timer = async () => {
      if (success){
        await sleep(2000)
        handleLogin(data)
      }
    }
    timer()
  }) 
  return(
    <>
    </>
  )
}