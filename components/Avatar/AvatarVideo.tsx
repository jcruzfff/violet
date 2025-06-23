import React from 'react'
import { StreamData } from '../../types'

interface AvatarVideoProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  connectionStatus: string
  streamData: StreamData | null
  isConnected: boolean
  onCreateStream: () => void
  onConnect: () => void
  onDisconnect: () => void
}

export const AvatarVideo: React.FC<AvatarVideoProps> = ({
  videoRef,
  connectionStatus,
  streamData,
  isConnected,
  onCreateStream,
  onConnect,
  onDisconnect
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>HeyGen Avatar Stream</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        {!streamData ? (
          <button
            onClick={onCreateStream}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            Create Stream
          </button>
        ) : !isConnected ? (
          <button
            onClick={onConnect}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            Connect to Avatar Stream
          </button>
        ) : (
          <button
            onClick={onDisconnect}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            Disconnect
          </button>
        )}
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls
        width={720}
        height={480}
        style={{ borderRadius: '8px', border: '2px solid #ddd' }}
      />
      
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '14px' }}>
        Status: {connectionStatus}
      </p>

      {streamData && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '10px', 
          backgroundColor: '#e8f5e8', 
          border: '1px solid #4CAF50',
          borderRadius: '6px',
          maxWidth: '600px',
          margin: '1rem auto',
          fontSize: '12px'
        }}>
          <strong>📡 Stream URL:</strong>
          <p style={{ fontFamily: 'monospace', wordBreak: 'break-all', margin: '4px 0 0 0' }}>
            {streamData.stream_url}
          </p>
          <strong>🔑 Access Token:</strong>
          <p style={{ fontFamily: 'monospace', wordBreak: 'break-all', margin: '4px 0 0 0' }}>
            {streamData.access_token.substring(0, 50)}...
          </p>
          <strong>🆔 Session ID:</strong>
          <p style={{ fontFamily: 'monospace', wordBreak: 'break-all', margin: '4px 0 0 0' }}>
            {streamData.session_id}
          </p>
        </div>
      )}
    </div>
  )
} 