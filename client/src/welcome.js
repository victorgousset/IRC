import React, {Component} from 'react';

import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://127.0.0.1:4242");

function Welcome(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}
export { Welcome };