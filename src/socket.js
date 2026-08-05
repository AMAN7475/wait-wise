import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

// Creating the connection here, once, at module load time -- rather
// than inside a component -- means every component that imports
// "socket" from this file shares the exact same connection, instead
// of each one opening its own separate socket.
export const socket = io(API_URL);