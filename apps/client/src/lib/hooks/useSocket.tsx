import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { connectSocketIoServer } from "../socket";
import useRoomStore from "@/store";
import { API_URL } from "../constants";

interface MyContextSocket {
  socket: Socket | null;
  setSocket: Dispatch<SetStateAction<Socket | null>>;
}

const SocketContext = createContext<MyContextSocket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketInitation = ({ children }: { children: React.ReactNode }) => {
  const socketContext = useSocket();
  const meetingStore = useRoomStore((state) => state);

  useEffect(() => {

    const newSocket = io(API_URL || '');
    socketContext?.setSocket(newSocket);

    connectSocketIoServer(newSocket, meetingStore);

    return () => {
      newSocket.disconnect();
    };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <main>{children}</main>;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <SocketInitation>{children}</SocketInitation>
    </SocketContext.Provider>
  );
};
