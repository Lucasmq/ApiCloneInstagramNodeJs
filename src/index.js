const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io  = require('socket.io')(server);

mongoose.connect('mongodb+srv://semana:semana@cluster0-cggxc.mongodb.net/test?retryWrites=true&w=majority', {
   useNewUrlParser: true, 
});

// midleware
app.use((req, res, next) =>{
    res.io = io;
    next();
})

app.use(require('./routes'));

// diz ao node que quando acessar o /files, vai direto para /uploads/resized
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(cors());

server.listen(3030);