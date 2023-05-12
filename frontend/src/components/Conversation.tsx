/* eslint-disable @next/next/no-img-element */

import React from 'react'
import styles from '../styles/Conversation.module.css';

export default function Conversation() {
  return (
    <div className={styles.conversation}>
        <img
            className={styles.conversationImg}
            src="https://ledepot-canape.fr/img/cms/amenagement-salon-sarah.jpeg"
            alt="Jane Doe"
        />
        <span className={styles.conversationName}>Jane Doe</span>
    </div>
  )
}
