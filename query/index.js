const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === "CommentCreated") {
        const { id, postId, content, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === "CommentUpdated") {
        const { id, postId, content, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    //console.log(posts);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on port 4002');

    const res = await axios.get("http://localhost:4005/events");

    res.data.forEach(event => {
        console.log('Processing event: ', event.type);
        handleEvent(event.type, event.data);
    });
});