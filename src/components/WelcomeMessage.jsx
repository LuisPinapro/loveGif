import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRandomWelcomeMessage } from '../constants/messages';
import './WelcomeMessage.css';

export default function WelcomeMessage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setMessage(getRandomWelcomeMessage(user.username));
    }
  }, [user]);

  if (!message) return null;

  return (
    <div className="welcome-banner">
      <p className="welcome-text">{message}</p>
    </div>
  );
}
