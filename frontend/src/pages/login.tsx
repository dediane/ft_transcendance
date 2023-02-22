import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Login.module.css'
import  axios  from 'axios'
import { useState } from 'react'
import userService from '@/services/user-service'
import authenticationService from '@/services/authentication-service'

export default function Login () {
    return <>
        <Authentication/>
    </>
}

export const Authentication = () => {
    const [register, setRegister] = useState(false)
    return (

        <div className="bg-white rounded-3xl mx-auto px-4 py-16 m-6 sm:px-6 lg:px-8 md:flex flex-wrap">
            <div className='mx-auto max-w-lg flex-1 '>
            <h1 className='bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl text-center md:text-left px-8'>Our Transcendence from 42 school Paris</h1>
            </div>
            <div className='mx-auto max-w-lg flex-1 rounded-2xl shadow-2xl border-gray-100 border-solid border-2'>
            {register && <Registration setRegister={setRegister} />}
            {!register && <LoginForm setRegister={setRegister} />}
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
        <h1 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl p-4">
        Welcome to Pong game!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-center text-gray-500 px-8">
        We’re looking for amazing Pong player just like you! Become a part of our rockstar gaming team !
        </p>
        <div
          className="mt-6 mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">Create your account</p>
            <InputBox3 setUsername={setUsername}/>
            <InputBox1 setEmail={setEmail}/>
            <InputBox2 setPassword={setPassword}/>
            <InputBox4 setPasswordCheck={setPasswordCheck}/>
            <button onClick={() => handleRegister()} 
            className="block w-full rounded-lg bg-gradient-to-r from-blue-700 to-blue-400 px-5 py-3 text-sm font-medium text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300">
            Register
            </button>
            <Button data={'Connect with 42'} />
         
    
          <p className="text-center text-sm text-gray-500">
            Already have an account?
            <a className="underline"  onClick={() => setRegister(false)}> Sign in</a>
          </p>
        </div>
        </div>
    )
}

export const LoginForm = ({setRegister} : {setRegister: any}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        const result = await userService.login(email, password)
        if(result.access_token ) {
            authenticationService.saveToken(result.access_token)
        }
    }
    return (
    <div>
    <h1 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl pt-4">
    Join our team!
    </h1>
    <p className="mx-auto mt-4 max-w-md text-center text-gray-500 px-8">
    We’re looking for amazing Pong player just like you! Become a part of our rockstar gaming team !
    </p>

    <div
      className="mt-6 mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
    >
      <p className="text-center text-lg font-medium">Log in to your account</p>
        <InputBox1 setEmail={setEmail}/>
        <InputBox2 setPassword={setPassword}/>
        <button
            onClick={() => handleLogin()}
            className="block w-full rounded-lg bg-gradient-to-r from-blue-700 to-blue-400 px-5 py-3 text-sm font-medium text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300">
            Log in
        </button>
        <Button data={'Connect with 42'} />
     

      <p className="text-center text-sm text-gray-500">
        No account? 
        <a className="underline" onClick={() => setRegister(true)}> Sign up</a>
      </p>
    </div>
    </div>
    )
}

export const Button = ({data} : {data: string}) => {
    return (
        <button
        className="block w-full rounded-lg bg-gradient-to-r from-blue-700 to-blue-400 px-5 py-3 text-sm font-medium text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300">
        {data}
      </button>
    )
}

export const InputBox1 = ({setEmail} : {setEmail :any}) => {
    return (      <div>
        <label htmlFor="email" className="sr-only">Email</label>

        <div className="relative">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-lg "
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
            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-lg"
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
            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-lg"
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
            className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-lg"
            placeholder="Confirm your password"
          />
          <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
          </span>
        </div>
      </div>
    )
}

