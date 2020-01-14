const express = require('express');

const router = express.Router();

const Database = require('../../data/db');

router.use(express.json());

router.get('/', (req, res) => {
    Database.find(req.query)
    .then(db => {
        res.status(200).json(db);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the post'
        })
    })
})

router.get('/:id', (req, res) => {

    const id = req.params.id;

    Database.findById(id)
    .then(db => {
        res.status(200).json(db);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving post'});
    });
});

router.get('/:id/comments', (req, res) => {

    const id = req.params.id;

    Database.findPostComments(id)
    .then(db => {
        res.status(200).json(db);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving post'});
    });
});

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    const newPost = { title, contents };

    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        Database.insert(newPost)
        .then(addedPost => {
            res.json(addedPost);
            res.status(201);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        });
    }
});

router.post('/:id/comments', (req, res) => {
    const { text, post_id } = req.body;
    const post_id = req.params.id;

    if (!post_id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    } else {
        Database.insertComment({ text, post_id })
        .then(newComment => {
            res.status(201).json(newComment);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        });
    }
});



module.exports = router;