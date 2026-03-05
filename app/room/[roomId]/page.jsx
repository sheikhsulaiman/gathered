'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import useSocket from '@/hooks/useSocket'
import useWebRTC from '@/hooks/useWebRTC'
import VideoGrid from '@/components/VideoGrid'
import Controls from '@/components/Controls'
import ChatPanel from '@/components/ChatPanel'

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const roomId = params.roomId
  const userName = searchParams.get('name') || 'Anonymous'

  const { socket, isReady } = useSocket()
  const [chatOpen, setChatOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    localVideoRef,
    localStream,
    peers,
    audioMuted,
    videoMuted,
    screenSharing,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  } = useWebRTC(isReady ? { roomId, userName, socket } : { roomId: null, userName, socket: null })

  const leaveRoom = () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop())
    }
    if (socket) {
      socket.disconnect()
    }
    router.push('/')
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const participantCount = Object.keys(peers).length + 1

  return (
    <div className="h-screen bg-base-100 flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-base-200/80 backdrop-blur-sm border-b border-base-300 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-content" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <span className="font-semibold text-sm">Gathered</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Participant count */}
          <div className="flex items-center gap-1.5 text-xs text-base-content/60">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
          </div>

          {/* Room ID copy */}
          <button
            onClick={copyRoomId}
            className="flex items-center gap-1.5 btn btn-xs btn-ghost border border-base-300 font-mono"
          >
            <span className="text-xs">{roomId}</span>
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Video area */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-300 ${chatOpen ? 'mr-80' : 'mr-0'}`}
      >
        {!isReady ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <span className="loading loading-spinner loading-lg text-primary" />
              <p className="text-sm text-base-content/60">Connecting to room...</p>
            </div>
          </div>
        ) : (
          <VideoGrid
            localVideoRef={localVideoRef}
            peers={peers}
            userName={userName}
            videoMuted={videoMuted}
          />
        )}
      </div>

      {/* Controls */}
      <Controls
        audioMuted={audioMuted}
        videoMuted={videoMuted}
        screenSharing={screenSharing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
        onLeave={leaveRoom}
        onToggleChat={() => setChatOpen((prev) => !prev)}
        chatOpen={chatOpen}
      />

      {/* Chat panel */}
      <ChatPanel
        socket={socket}
        roomId={roomId}
        userName={userName}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  )
}