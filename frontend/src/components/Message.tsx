/* eslint-disable @next/next/no-img-element */
import styles from '../styles/Message.module.css';
import React from 'react'

export default function Message({own}) {
  return (
    <div className={styles.message}>
    {/* <div className='message own'> */}
     {/* <div style={{ alignItems: 'flex-end' }} className="message own"> */}
    
    <div className={styles.messageTop}>
    <img
            className={styles.messageImg}
            src="https://ledepot-canape.fr/img/cms/amenagement-salon-sarah.jpeg"
            alt="Jane Doe"
            />
        <p className={styles.messageText}> Hello this is a message</p>
    </div>
    <div className={styles.messageBottom}>1 hour ago</div>
    </div>
  )
}
