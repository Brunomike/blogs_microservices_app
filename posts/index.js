const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');    
    next();
});

//app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/posts', (req, res) => {    
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    res.status(201).send(posts[id]);
});


app.listen(4000, () => {
    console.log('Listening on 4000');
});