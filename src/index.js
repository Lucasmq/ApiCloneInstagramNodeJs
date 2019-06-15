const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const jwt = require('jsonwebtoken');
const authConfig = require('./config/auth.json')

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect('mongodb+srv://semana:semana@cluster0-cggxc.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});

// para receber json no body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// // validar login
// app.use((req,res,next) =>{
//   const authHeader = req.headers.authorization;

//   if(!authHeader){
//     return res.status(401).send({ error: 'No token provided' });
//   }

//   const parts = authHeader.split(' ');

//   if(!parts.length === 2){
//     return res.status(401).send({ error: 'Token error' });
//   }

//   const [ scheme, token ] = parts;
   
//   // regex para saver se tem a palavra Bearer no token
//   if(!/^Bearer&/i.test(scheme)){
//     return res.status(401).send({ error: 'Token malformated '});
//   }

//   jwt.verify(token, authConfig.secret, (err, decoded) => {
//     if(err){
//       return res.status(401).send({ error: 'Token invalid'})
//     }
//     req.userId = decoded.id;
//     next();
//   });

// });

// midleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());

// diz ao node que quando acessar o /files, vai direto para /uploads/resized
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'));


server.listen(3030);
