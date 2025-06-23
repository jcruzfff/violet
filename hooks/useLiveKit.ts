import { useState, useCallback, useRef, useEffect } from 'react'
import { Room, RoomEvent, RemoteTrack } from 'livekit-client'
import { StreamData } from '../types'

export const useLiveKit = (streamData: StreamData | null, setConnectionStatus: (status: string) => void) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const connectToLiveKit = useCallback(async (): Promise<void> => {
    try {
      if (!streamData) {
        setConnectionStatus('❌ No stream data! Create stream first.')
        return
      }

      setConnectionStatus('Connecting to LiveKit...')
      
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      })

      newRoom.on(RoomEvent.Connected, () => {
        setConnectionStatus('Connected! Waiting for video stream...')
        setIsConnected(true)
      })

      newRoom.on(RoomEvent.Disconnected, () => {
        setConnectionStatus('Disconnected')
        setIsConnected(false)
      })

      newRoom.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
        console.log('Track subscribed:', track.kind, track.source)
        
        if (track.kind === 'video' && videoRef.current) {
          track.attach(videoRef.current)
          setConnectionStatus('🎉 Video stream active!')
        }
        
        if (track.kind === 'audio' && videoRef.current) {
          track.attach(videoRef.current)
          
          if (videoRef.current) {
            videoRef.current.muted = false
            videoRef.current.volume = 1.0
            
            videoRef.current.play().catch(e => {
              console.log('Autoplay prevented, user interaction required:', e)
            })
          }
          
          console.log('Audio track attached and unmuted')
          setConnectionStatus('🔊 Audio enabled!')
        }
      })

      newRoom.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
        track.detach()
        if (track.kind === 'video') {
          setConnectionStatus('Video stream ended')
        }
      })

      setRoom(newRoom)
      await newRoom.connect(streamData.stream_url, streamData.access_token)
      
    } catch (error) {
      console.error('Error connecting to LiveKit:', error)
      setConnectionStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [streamData, setConnectionStatus])

  const disconnect = useCallback(async (): Promise<void> => {
    try {
      setConnectionStatus('Disconnecting...')

      if (room) {
        room.disconnect()
        setRoom(null)
      }

      setIsConnected(false)
      setConnectionStatus('Disconnected')
      
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }, [room, setConnectionStatus])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect()
      }
    }
  }, [room])

  return {
    videoRef,
    isConnected,
    connectToLiveKit,
    disconnect
  }
} 