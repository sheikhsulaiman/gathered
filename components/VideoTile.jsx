'use client'

import { useEffect, useRef } from 'react'

export default function VideoTile({ stream, name, isLocal = false, videoMuted = false }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      if (isLocal) videoRef.current.muted = true
    }
  }, [stream, isLocal])

  return (
    <div className="relative rounded-2xl overflow-hidden bg-base-300 w-full h-full min-h-45 flex items-center justify-center group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover ${videoMuted ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Video off placeholder */}
      {videoMuted && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-300">
          <div className="flex flex-col items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16 h-16">
                <span className="text-2xl font-bold">
                  {name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <span className="bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
          {isLocal ? `${name} (You)` : name}
        </span>
      </div>

      {/* Local indicator */}
      {isLocal && (
        <div className="absolute top-3 right-3">
          <span className="badge badge-primary badge-sm">YOU</span>
        </div>
      )}
    </div>
  )
}