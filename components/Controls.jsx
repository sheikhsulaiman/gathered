'use client'

export default function Controls({
  audioMuted,
  videoMuted,
  screenSharing,
  toggleAudio,
  toggleVideo,
  startScreenShare,
  stopScreenShare,
  onLeave,
  onToggleChat,
  chatOpen,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none">
      <div className="flex items-center gap-3 bg-base-200/90 backdrop-blur-md border border-base-300 rounded-2xl px-6 py-3 shadow-2xl pointer-events-auto">

        {/* Mic */}
        <div className="tooltip tooltip-top" data-tip={audioMuted ? 'Unmute' : 'Mute'}>
          <button
            onClick={toggleAudio}
            className={`btn btn-circle btn-md ${audioMuted ? 'btn-error' : 'btn-ghost border border-base-300'}`}
          >
            {audioMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
        </div>

        {/* Camera */}
        <div className="tooltip tooltip-top" data-tip={videoMuted ? 'Start Video' : 'Stop Video'}>
          <button
            onClick={toggleVideo}
            className={`btn btn-circle btn-md ${videoMuted ? 'btn-error' : 'btn-ghost border border-base-300'}`}
          >
            {videoMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            )}
          </button>
        </div>

        {/* Screen share */}
        <div className="tooltip tooltip-top" data-tip={screenSharing ? 'Stop Sharing' : 'Share Screen'}>
          <button
            onClick={screenSharing ? stopScreenShare : startScreenShare}
            className={`btn btn-circle btn-md ${screenSharing ? 'btn-success' : 'btn-ghost border border-base-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
        </div>

        {/* Chat */}
        <div className="tooltip tooltip-top" data-tip="Chat">
          <button
            onClick={onToggleChat}
            className={`btn btn-circle btn-md ${chatOpen ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-base-300" />

        {/* Leave */}
        <div className="tooltip tooltip-top" data-tip="Leave">
          <button onClick={onLeave} className="btn btn-circle btn-md btn-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.33-2.67 19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91" />
              <line x1="23" y1="1" x2="1" y2="23" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}