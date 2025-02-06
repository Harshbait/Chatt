// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

import express from 'express';
import {Server as httpserver} from 'http'
import {Server as socket} from 'socket.io';
// Initialize express app and create an HTTP server

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const dirname1 = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = new httpserver(app);
const io = new socket(server, {
  cors: {
    origin: "*", // Allow all origins for now; restrict later for security
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

const users = {};

// app.use(express.static("public" , ""))

// Serve the static files (e.g., client.js, HTML, CSS)
// app.use(express.static('public'));


app.use("/public", express.static("public"))


app.get("/" , (req,res)=>{
  res.sendFile(dirname1+"/index.html")
})

// Socket.io logic for handling connections
io.on('connection', socket => {
  socket.on('new-user-joined', name => {
    console.log('User is connected');
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('recive', { message: message, name: users[socket.id] });
  });

  socket.on('sendImage', (Image) => {
    socket.broadcast.emit('receiveImage', { Image, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', users[socket.id]);
    delete users[socket.id];
  });
});


server.listen( 3000, () => {
   console.log("Server is running");
});