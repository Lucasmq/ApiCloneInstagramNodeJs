const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController');
const AuthController = require('./controllers/AuthController');
const ProjectController = require('./controllers/ProjectController');
const authMiddleware = require('./middlewares/auth');

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.post('/auth/register', AuthController.register);
routes.post('/auth/autenticate', AuthController.autenticate);

// middleware para validar o login, caso esteja ok, pode passar para as proximas rotas
//routes.use(authMiddleware);

routes.get('/posts', PostController.index);
routes.post('/posts', upload.single('image'), PostController.store);
routes.post('/projects/', ProjectController.resposta);



routes.post('/posts/:id/like', LikeController.store);


module.exports = routes;
