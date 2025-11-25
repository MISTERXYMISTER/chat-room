import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NextApiResponse['socket'] & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};