/* eslint-disable @next/next/no-img-element */
import styles from '../styles/Message.module.css';
import React from 'react'

export default function Message(data: any) {
  const { me, sender, content } = data;
  if (content == '')
    return (<></>)
  const isMyMessage = me === sender;
  const messageClass = isMyMessage ? styles['my-message'] : styles['friend-message'];
  return (
    <div className={`${styles.message} ${messageClass}`}>
      <div className={styles.messageTop}>
        <h3>{sender}</h3>
        <p className={styles.messageText}>{content}</p>
      </div>
    </div>
  );
}
