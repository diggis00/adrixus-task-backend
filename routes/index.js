import express from 'express';
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.send('The server is running');
});

export default router;
