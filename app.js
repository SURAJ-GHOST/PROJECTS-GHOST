const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Todo = require('./models/Todo');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.render('index', { todos });
});

app.post('/add', async (req, res) => {
  const todo = new Todo({
    task: req.body.task,
  });
  await todo.save();
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Todo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

app.post('/update/:id', async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, {
    task: req.body.task,
    completed: req.body.completed === 'on',
  });
  res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
