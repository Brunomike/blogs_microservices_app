const express = require('express');
const axios = require('axios');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

app.use(express.json());

// app.use((req,res,next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');    
//     next();
// });

app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, 
        title,
    };
    
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {
            id, title,
        }
    });

    res.status(201).send(posts[id])
});

app.post('/events', (req, res) => {
    console.log({ Received_Event: req.body.type });
    res.send({});
});


app.listen(4000, () => {    
    console.log('Listening on port 4000')
})