const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id })
    res.send(blogs);
  });

  app.get('/api/bloglist', async (req, res) => {
    let user = "Test"
    console.log(user);
    const blogs = await Blog.find({ title: user })
    res.send(blogs);
  });

  //5ac1d9a5cb8cc82c8c7ed278

  app.post('/api/blogs', requireLogin , async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};