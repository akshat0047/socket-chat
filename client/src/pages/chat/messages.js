import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';

const Messages = ({ socket, username }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);

  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

  useEffect(() => {
    if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesReceived]);

  const formatDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, 
      });
  }

  return (
    <div className={styles.messagesColumn}>
      {messagesReceived.map((msg, i) => (
        <div className={msg.username == username ? styles.rightMsg : styles.leftMsg} key={i}>
            <span className={styles.msgUser}>~ {msg.username}</span>
            <p className={styles.msgText}>{msg.message}</p>
            <span className={styles.msgMeta}>
                {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default Messages;