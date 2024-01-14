import { prismaClient } from "../../application/database";
import { IUser } from "../../interface";

export const createSocketRoom = () => {
  return prismaClient["socket_room"].create({
    data: {
      isActive: true,
    },
    select: {
      roomId: true,
      createdAt: true,
      isActive: true,
    },
  });
};

export const insertSocketUser = (createUser: IUser) => {
  return prismaClient["socket_user"].create({
    data: {
      name: createUser.name,
      roomId: createUser.roomId,
      socketId: createUser.socketId,
      isHostRoom: createUser.isHostRoom,
    },
    select: {
      roomId: true,
      createdAt: true,
    },
  });
};

export const queryUsersByRoomId = (roomId: string) => {
  return prismaClient["socket_user"].findMany({
    where: {
      roomId: roomId,
    },
    select: {
      userId: true,
      name: true,
      socketId: true,
    },
  });
};

export const queryUserBySocketId = (socketId: string) => {
  return prismaClient["socket_user"].findFirst({
    where: {
      socketId,
    },
    select: {
      userId: true,
      roomId: true,
      socketId: true,
      name: true,
    },
  });
};

export const removeUserByUserId = (socketId: string) => {
  return prismaClient["socket_user"].delete({
    where: {
      userId: socketId,
    },
    select: {
      roomId: true,
      socketId: true,
      name: true,
    },
  });
};
