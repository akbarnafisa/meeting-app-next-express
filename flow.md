**Creating a New Room:**
- Navigate to the /room route.
- Initialize a socket connection.
- Retrieve the current socket ID and save it.
- Create a new room by the user (trigger setMeetingConfig).
- Redirect to /room/meeting.

**Inside the Meeting Room:**
- Check the socket connection.
- Initiate the room by executing getLocalPreviewAndRoomConnection.
- Get user media for audio and video.
- Show the video stream for the user.
- Create a new room -> hit BE socket.
- In the BE inside create-new-room:
  - Create a new user.
  - Create a new room.
  - Join the current user to the new room ID that has just been created.
  - Emit room-id to send the room information.
  - Emit connected user to the current room.
- In the FE, save the current roomId and current connected user to the store.
- Toggle microphone and video.

**Joining a New Room:**
- Enter meeting ID and meeting name.
- Hit API to check if the meeting exists.
- Set meeting config, then redirect it to /room/meeting.

**Inside the Meeting Room:**
- Check socket connection.
- Initiate the room by executing getLocalPreviewAndRoomConnection.
- Get user media for audio and video.
- Show the video stream for the user.
- Join the room -> hit BE socket.
- In the BE inside join-room (new joiner):
  - Create a new user.
  - Join the current user to the meeting ID.
  - Emit room-id to send the room information.
  - Notify all connected users to do "connection-prepare."
  - Emit to all users in the meeting room to inform the latest connected users via room-users.
- In the FE (host):
  - connection-prepare -> hit prepareNewPeerConnection to create a WebRTC connection by passing the new joiner's socket ID to it as a non-initiator.
  - connection-init -> init connection to the server by sending the new joiner's socket id.
- In the BE (host):
  - listen connection-init -> the host sends its socket id to the new joiner.
- In the FE (new joiner):
  - new joiner init simple-peer connection by passing the host's socket id.
  - as a peer initiator, the new joiner will trigger .on('signal') listener.
  - send the signal data and host/responder by using connection-signal to BE.
- In the BE (new joiner):
  - listen connection-signal -> send signal data and new joiner's socket.id to the host.
- In the FE (host):
  - listening to connection-signal then exec handleSignalingData.
  - apply the signal data from the initiator.
  - send the signal data from the responder to the initiator.
- In the BE (host):
  - listen connection-signal -> send signal data and host socket.id to the new joiner.
- In the FE (new joiner):
  - listen to the connection then apply the signal.