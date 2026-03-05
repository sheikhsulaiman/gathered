'use client'

import { useEffect, useRef, useState } from 'react'

export default function ChatPanel({ socket, roomId, userName, isOpen, onClose }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!socket) return

    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message])
    }

    socket.on('chat-message', handleMessage)
    return () => socket.off('chat-message', handleMessage)
  }, [socket])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const sendMessage = () => {
    if (!inputValue.trim() || !socket) return

    const message = {
      text: inputValue.trim(),
      senderName: userName,
      timestamp: Date.now(),
    }

    socket.emit('chat-message', { roomId, message })
    setInputValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-base-200 border-l border-base-300 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <h2 className="font-semibold text-sm">Meeting Chat</h2>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-base-content/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <p className="text-xs text-center">No messages yet.<br />Say hello to everyone!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isOwn = msg.senderName === userName
          return (
            <div key={i} className={`chat ${isOwn ? 'chat-end' : 'chat-start'}`}>
              {!isOwn && (
                <div className="chat-header text-xs opacity-60 mb-0.5">{msg.senderName}</div>
              )}
              <div className={`chat-bubble chat-bubble-sm text-sm ${isOwn ? 'chat-bubble-primary' : ''}`}>
                {msg.text}
              </div>
              <div className="chat-footer opacity-40 text-xs mt-0.5">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-base-300 bg-base-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="input input-sm input-bordered flex-1 bg-base-100 text-sm"
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim()}
            className="btn btn-sm btn-primary btn-square"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}