import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Input } from '@/components/ui/input'

function App() {
  const [count, setCount] = useState(0)
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  // const [cookieValue, setCookieValue] = useState(null);
  const [cookieStatus, setCookieStatus] = useState('Not checked');

  const checkCookie = () => {
    // const cookieName = 'authToken';
    const cookieName = 'sessionId';
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(`${cookieName}=`));
    return cookie ? cookie.split('=')[1] : null;
  };

  const generateCookie = async () => {
    try {
      const response = await fetch('http://localhost:3030/', {
        method: 'GET',
        credentials: 'include',
      });


      if (response.ok) {
        setCookieStatus('Cookie should be set');
      } else {
        setCookieStatus('Failed to set cookie');
      }
    } catch (error) {
      setCookieStatus('Error occurred');
    }
  }


  useEffect(() => {

    const token = checkCookie();
    if (token) {
      console.log('Cookie found:', token);
      // Proceed with authenticated user logic
    } else {
      console.log('No cookie found, begin create cookie');
      generateCookie()
      // Handle unauthenticated user logic
    }

    const socket = new WebSocket('ws://localhost:3030')
    setWs(socket);

    socket.onmessage = (event) => {
      console.log("socket checking if theres new message")
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      socket.close()
    }
  }, [])

  const sendMessage = () => {
    console.log("triggeresdd")
    if (ws && ws.readyState === WebSocket.OPEN && message.trim()) {
      ws.send(message);
      setMessage('')
    }
    else if (ws && message) {
      console.log("triggerr send")
      ws.send(message);
      setMessage('')
    }
  }

  return (
    <>
      <h1>Chat App</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <Input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && sendMessage()}
      // onClick={(e) => e.key sendMessage()}
      />
      {/* <button onClick={sendMessage}>Send</button> */}


      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
