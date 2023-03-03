import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { Inter } from '@next/font/google'
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from '@/components/Modal'
import React, { useState, useEffect } from 'react';
import { Authentication } from './login'
import { Navbar } from '@/components/Navbar'
import { BackgroundAnimation } from '@/components/BackgroundAnimation'


function Home() {
  const [showModal, setShowModal] = useState(false);
  return (
    <Authentication />
  )
}
export default Home


{/* <div className='mx-auto text-2xl text-center'>Welcome to our Transcendance!
  <button onClick={() => setShowModal(true)} className='bg-red-400 px-6 py-2 rounded-2xl'>
    Modal
  </button> 
  <Modal show={showModal} view={<Authentication/>} onClose={() => setShowModal(false)}>
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
  </Modal>
</div> */}