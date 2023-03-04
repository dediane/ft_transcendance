// import styles from '@/styles/Messenger.module.css'
import Conversations from '@/components/Conversation';
import Message from '@/components/Message';
import styles from '../styles/Messenger.module.css';

function Messenger() {
  return (
    <div className={styles.messenger}>
      <div className={styles.chatMenu}>
        <div className={styles.chatMenuWrapper}>
            <input placeholder="Search for friends" className={styles.chatMenuInput}/>
            <Conversations/>
            <Conversations/>
            <Conversations/>
            <Conversations/>
        </div>
      </div>
      <div className={styles.chatBox}>
        <div className={styles.chatBoxWrapper}>
          <div className={styles.chatBoxTop}>
          <Message/>
          <Message/>
          <Message/>
          <Message/>

          </div>
          <div className={styles.chatBoxBottom}></div>
        </div>
      </div>
      <div className={styles.chatOnline}>
        <div className={styles.chatOnlineWrapper}>
          online
        </div>
      </div>
    </div>
  );
}

export default Messenger;
