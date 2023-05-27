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
