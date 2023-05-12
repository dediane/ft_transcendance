/* eslint-disable @next/next/no-img-element */
import styles from '../styles/Message.module.css';
import React from 'react'

// export default function Message({ isMyMessage }) {
//     const messageClass = isMyMessage ? styles['my-message'] : styles['friend-message'];
  
//   return (
//     <div className={`${styles.message} ${messageClass}`}>
//         <div className={styles.messageTop}>Username  
//         <p className={styles.messageText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
//         </div>
//         <div className={styles.messageBottom}>17:57</div>
//     </div>
//   )
// }


export default function Message({ me, sender, content }) {
  const isMyMessage = me === sender;
  const messageClass = isMyMessage ? styles['my-message'] : styles['friend-message'];
  return (
    <div className={`${styles.message} ${messageClass}`}>
      <div className={styles.messageTop}>
        <h3>{sender}</h3>
        <p className={styles.messageText}>{content}</p>
      </div>
      {/* <div className={styles.messageBottom}></div> */}
    </div>
  );
}
