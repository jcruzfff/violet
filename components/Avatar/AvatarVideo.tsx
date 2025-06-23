import React from 'react'
import { StreamData } from '../../types'

interface AvatarVideoProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  connectionStatus: string
  streamData: StreamData | null
  isConnected: boolean
  onCreateStream: () => void
  onConnect: () => void
}

export const AvatarVideo: React.FC<AvatarVideoProps> = ({
  videoRef,
  connectionStatus,
  streamData,
  isConnected,
  onCreateStream,
  onConnect
}) => {
  return (
    <div className="relative w-full h-full bg-black rounded-tr-[32px] rounded-br-[32px] overflow-hidden">
      {/* Video Element - Properly fitted to container */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain"
        style={{ backgroundColor: '#000' }}
      />
      
      {/* Connection Status Overlay (only show when not connected) */}
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            {!streamData ? (
              <div>
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg">Preparing stream...</p>
                <button
                  onClick={onCreateStream}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Stream
                </button>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg">Connecting to avatar...</p>
                <p className="text-sm text-gray-300 mb-4">{connectionStatus}</p>
                <button
                  onClick={onConnect}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Connect to Avatar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug Info - Commented out for now */}
      {/* 
      {streamData && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
          <div><strong>Stream URL:</strong></div>
          <div className="font-mono break-all text-[10px] mb-2">{streamData.stream_url}</div>
          <div><strong>Access Token:</strong></div>
          <div className="font-mono break-all text-[10px] mb-2">{streamData.access_token.substring(0, 30)}...</div>
          <div><strong>Session ID:</strong></div>
          <div className="font-mono break-all text-[10px]">{streamData.session_id}</div>
        </div>
      )}
      */}
    </div>
  )
} 