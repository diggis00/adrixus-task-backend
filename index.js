import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { notFoundResponse, unauthorizedResponse } from './helpers/apiResponse.js';
import indexRouter from './routes/index.js';
import apiRouter from './routes/api.js';
dotenv.config();

let app = express();
const port = process.env.PORT || 3000;

// Database Connection
let MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to %s', MONGODB_URL);
      console.log('App is running ... \n');
      console.log('Press CTRL + C to stop the process. \n');
    }
  })
  .catch((err) => {
    console.error('App starting error:', err.message);
    process.exit(1);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use('/', indexRouter);
app.use('/api/', apiRouter);

// throw 404 if URL not found
app.all('*', function (req, res) {
  return notFoundResponse(res, 'Page not found');
});

app.use((err, req, res) => {
  if (err.name == 'UnauthorizedError') {
    return unauthorizedResponse(res, err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
