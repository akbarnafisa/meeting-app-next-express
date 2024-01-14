import { Request } from "express";
import { prismaClient } from "../../application/database";
import { ResponseError } from "../../utils/responseError";

export const rtcService = async (request: Request) => {
  const { id } = request.params;

  if (!id) {
    throw new ResponseError(422, 'Room ID is not provided');
  }

  const room = await prismaClient["socket_room"].findFirst({
    where: {
      roomId: id,
    },
    select: {
      roomId: true,
      isActive: true,
    },
  });

  if (!room) {
    throw new ResponseError(404, 'Room not found!');
  }

  return room
};
