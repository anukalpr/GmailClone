const express = require('express');
const cors = require('cors');
const axios = require('axios');

const connection = require('./Database/DB');
const router = require('./Routes/route');
const fetchMail = require('./Services/receiveMail'); 

const app = express();
const port = 4000;

connection();

app.use(cors());
app.use(express.json());

app.use('/', router);

app.get('/image-proxy', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send('Missing url parameter');

    if (!/^https?:\/\//i.test(imageUrl)) {
      return res.status(400).send('Invalid URL');
    }

    const response = await axios.get(imageUrl, { responseType: 'stream' });

    res.set('Content-Type', response.headers['content-type'] || 'image/png');

    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying image:', error.message);
    res.status(500).send('Failed to load image');
  }
});

app.get('/', (req, res) => {
  res.send("Server is Running ✅");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  fetchMail();
});
