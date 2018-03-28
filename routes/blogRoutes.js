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

  app.get('/api/blogs', requireLogin, async (req, res) => {

    // Create the Redi Cache
    const util = require('util');
    const redis = require('redis');
    const redisURL = 'redis://127.0.0.1:6379';

    //Create the Redis Client
    const client = redis.createClient(redisURL);

    //Promisif the Client.Get function () 
    client.get = util.promisify(client.get);

    // Get the Blogs based on User ID from the Cache
    const cachedBlogs = await client.get(req.user.id);
    
    if(cachedBlogs) {
      console.log("Serving from CACHE");
      return res.send(cachedBlogs);
    }
    const blogs = await Blog.find({ _user: req.user.id });
    console.log("Seving from Mongo DB");
    res.send(blogs);

    client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
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
