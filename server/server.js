require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json({limit: '2mb'}));

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err => console.error('Mongo error', err));

app.use('/api', apiRoutes);

app.listen(PORT, ()=> console.log(`Server listening ${PORT}`));
