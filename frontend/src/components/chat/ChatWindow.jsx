import React, { useEffect, useRef, useState } from 'react'

const ChatWindow = ({ roomName = 'demo' }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: `Joined room ${roomName}` }
  ])
  const [input, setInput] = useState('')
  const socketRef = useRef(null)

  useEffect(() => {
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${roomName}/`
    const socket = new WebSocket(wsUrl)
    socketRef.current = socket

    socket.onopen = () => {
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'system', text: 'Connected' }])
    }
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setMessages((prev) => [...prev, { id: Date.now(), sender: data.sender || 'peer', text: data.message }])
      } catch (e) {
        setMessages((prev) => [...prev, { id: Date.now(), sender: 'peer', text: event.data }])
      }
    }
    socket.onclose = () => {
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'system', text: 'Disconnected' }])
    }

    return () => {
      socket.close()
    }
  }, [roomName])

  const sendMessage = () => {
    if (!input.trim()) return
    const payload = JSON.stringify({ message: input, sender: 'me' })
    socketRef.current?.send(payload)
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'me', text: input }])
    setInput('')
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-4">
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">RM</div>
            <div>
              <h3 className="font-bold text-slate-800">Room: {roomName}</h3>
              <span className="text-xs text-green-600 flex items-center gap-1">● Live</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
              {msg.sender === 'system' ? (
                <span className="bg-slate-200 text-slate-600 text-xs py-1 px-3 rounded-full">{msg.text}</span>
              ) : (
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow