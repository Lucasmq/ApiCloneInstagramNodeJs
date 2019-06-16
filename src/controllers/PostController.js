const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports = {
  async index(req, res) {
    // populate indica para popular o campo author com a sua referencia em ref
    const posts = await Post.find().populate('author').sort('-createdAt');

    return res.json(posts);
  },
  async store(req, res) {
    const {
      author, place, description, hashtags,
    } = req.body;
    const { filename: image } = req.file;

    const [name] = image.split('.');
    const fileName = `${name}.jpg`;

    await sharp(req.file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(
        path.resolve(req.file.destination, 'resized', fileName),
      );

    fs.unlinkSync(req.file.path);
        // console.log(req.user)
    const post = await Post.create({
      author: req.userId,
      place,
      description,
      hashtags,
      image: fileName,
    });

    req.io.emit('post', post);

    return res.json(post);
  },

};
