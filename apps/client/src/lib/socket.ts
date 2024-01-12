import io, { Socket } from 'socket.io-client'

import { IMeetingConfig } from "@/interface/room"
import useRoomStore from '@/store'

let socket: Socket | null = null

export const useConnectSocketIoServer = (socketDomain: string) => {
  const roomStore = useRoomStore((state) => state)
  socket = io(socketDomain)

  socket.on('connect', () => {
    roomStore.setSocketId(socket?.id as string)
  })

  socket?.volatile.on('room-id', (data: any) => {
    roomStore.setRoomId(data.roomId)
  })

  socket?.volatile.on('room-users', (data: any) => {
    roomStore.setMeetingUsers(data.connectedUsers)
  })

  // socket?.volatile.on('connection-prepare', (data: any) => {
  //   prepareNewPeerConnection(data.connectedUserSocketId, false)

  //   socket?.volatile.emit('connection-init', { connectedUserSocketId: data.connectedUserSocketId })
  // })

  // socket?.volatile.on('connection-signal', (data: any) => {
  //   handleSignalingData(data)
  // })

  // socket?.volatile.on('connection-init', (data: any) => {
  //   prepareNewPeerConnection(data.connectedUserSocketId, true)
  // })

  // socket?.volatile.on('user-disconnected', (data: any) => {
  //   removePeerConnection(data)
  // })
}


export const createNewRoom = (meetingConfig: IMeetingConfig) => {
  const data = {
    meetingName: meetingConfig.meetingName,
    isHostMeeting: meetingConfig.isHostMeeting,
  }

  socket?.volatile.emit('create-new-room', data)
}