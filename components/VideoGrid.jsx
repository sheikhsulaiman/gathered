'use client'

import { useEffect, useRef } from 'react'
import VideoTile from './VideoTile'

function LocalVideo({ localVideoRef, userName, videoMuted }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-base-300 w-full h-full min-h-45 flex items-center justify-center">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${videoMuted ? 'opacity-0' : 'opacity-100'}`}
      />
      {videoMuted && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-300">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-16 h-16">
              <span className="text-2xl font-bold">
                {userName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-3">
        <span className="bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
          {userName} (You)
        </span>
      </div>
      <div className="absolute top-3 right-3">
        <span className="badge badge-primary badge-sm">YOU</span>
      </div>
    </div>
  )
}

export default function VideoGrid({ localVideoRef, peers, userName, videoMuted }) {
  const totalCount = Object.keys(peers).length + 1

  const gridClass =
    totalCount === 1
      ? 'grid-cols-1 max-w-2xl mx-auto'
      : totalCount === 2
      ? 'grid-cols-2'
      : totalCount <= 4
      ? 'grid-cols-2'
      : 'grid-cols-3'

  return (
    <div className={`grid ${gridClass} gap-3 w-full h-full p-3`}>
      <LocalVideo
        localVideoRef={localVideoRef}
        userName={userName}
        videoMuted={videoMuted}
      />
      {Object.entries(peers).map(([socketId, { stream, userName: peerName }]) => (
        <VideoTile
          key={socketId}
          stream={stream}
          name={peerName || 'Guest'}
        />
      ))}
    </div>
  )
}