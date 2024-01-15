import express from 'express';

const router = express.Router();

router.get('/codeRetrieved', (req, res) => {
  try {
    if (req.query.code) {
      res.render('codeRetrieved.html', { code: req.query.code });
    } else {
      res.status(400).send('No code retrieved');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

export default router;
