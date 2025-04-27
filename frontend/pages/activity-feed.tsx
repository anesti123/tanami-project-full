import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useRouter } from 'next/router';

let socket: any;

export default function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }
    socket = io('http://localhost:4000');
    socket.on('new_activity', (activity: any) => {
      setActivities(prev => [activity, ...prev]);
    });
    axios.get('http://localhost:4000/api/activity').then(res => setActivities(res.data));
    return () => {
      if (socket) socket.disconnect();
    }
  }, []);

  const postActivity = async () => {
    try {
      await axios.post('http://localhost:4000/api/activity', { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
    } catch (err) {
      alert('Error posting activity');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Activity Feed</h1>
      <input 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Type activity" 
      />
      <button onClick={postActivity}>Post</button>
      <ul>
        {activities.map(act => (
          <li key={act.id}>{act.content} - {new Date(act.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
