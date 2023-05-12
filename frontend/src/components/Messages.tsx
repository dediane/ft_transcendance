import React from "react";
import styles from '../styles/Message.module.css';

interface Message {
  text: string;
  isMyMessage: boolean;
}
//from //to a ajouter??
//TO DO : toggle sidebar 
//is mymessage = if sender == myusername then isMyMessage
function Messages({ messages }: { messages: Message[] }): JSX.Element {
  return (
    <div>
      {messages.map((message, index) => {
        const messageClass = message.isMyMessage ? styles['my-message'] : styles['friend-message'];
        return (
            <div key={index} className={`${styles.message} ${messageClass}`}>
            <div className={styles.messageTop}>Username  
                <p className={styles.messageText}>{message}</p>
            </div>
            <div className={styles.messageBottom}>17:57</div>
            </div>
        );
      })}
    </div>
  );
}
export default Messages;


// function Messages({messages}: {messages: string[]}) {
//     // const messageClass = isMyMessage ? styles['my-message'] : styles['friend-message'];

//     return (
//     //  <div className={`${styles.message} ${messageClass}`}>
//         // <div className={styles.message}>
//         <div>
//             {messages.map((message, index) => (
//             <div key={index}>{message}</div>
//             ))}
//         </div>
//     )
// }

// export default Messages;

/*
change my function so that   const messageClass = isMyMessage ? styles['my-message'] : styles['friend-message'];
  
*/
/* eslint-disable @next/next/no-img-element */
// import styles from '../styles/Message.module.css';
// import React from 'react'

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
