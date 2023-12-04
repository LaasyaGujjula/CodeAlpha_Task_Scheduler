const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/taskScheduler', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Task model
const taskSchema = new mongoose.Schema({
  title: String,
  dueDate: Date,
  userEmail: String,
});

const Task = mongoose.model('Task', taskSchema);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vaish0228@gmail.com',
    pass: '',
  },
});

// API endpoint to create a new task
app.post('/api/tasks', async (req, res) => {
  const { title, dueDate, userEmail } = req.body;

  try {
    const task = new Task({ title, dueDate, userEmail });
    await task.save();

    sendEmail(userEmail, 'Upcoming Task', `Task "${title}" is due on ${dueDate}`);

    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to send email using Nodemailer
function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'laasya.gujjula@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
