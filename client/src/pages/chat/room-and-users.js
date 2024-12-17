import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off('chatroom_users');
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit('leave_room', { username, room, __createdtime__ });
    // Redirect to home page
    navigate('/', { replace: true });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.roomAndUsersColumn}>
      <div className={styles.userLeftBox}>
        <span className={styles.roomTitle}>{room}</span>
        {/* Desktop User List */}
        <div className={styles.userBox}>
          <span className={styles.usersTitle}>Users</span>
          <ul className={styles.usersList}>
            {roomUsers.map((user) => (
              <li 
                className={styles.userListItem}
                key={user.id}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.portraitIcons}>
        <label className={styles.modalBtn}>
          <i className="fa-solid fa-users"></i>
          <button className='btn btn-outline' onClick={toggleModal}>
          </button>
        </label>
        <label className={styles.leaveBtn}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <button className='btn btn-outline' onClick={leaveRoom}>
            Leave
          </button>
        </label>
      </div>

      {/* Modal for Mobile View */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Users in {room}</span>
              <button className={styles.closeModal} onClick={toggleModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <ul className={styles.usersList}>
                {roomUsers.map((user) => (
                  <li className={styles.userListItem} key={user.id}>
                    {user.username}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAndUsers;