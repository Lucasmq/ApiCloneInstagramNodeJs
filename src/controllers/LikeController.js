const Post = require('../models/Post');
const User = require('../models/User');

module.exports = {
  async store(req, res) {
    const post = await Post.findById(req.params.id);

    post.likes += 1;

    await post.save();
    
    // indico os dados dos autores quando houver o like
    post.author = await User.findById(post.author);

    req.io.emit('like', post);

    return res.json(post);
  },

};
