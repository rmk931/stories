const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

const Story = mongoose.model('stories');

router.get('/', (req, res) => {
    Story.find({ status: 'public' })
        .populate('user')
        .sort({date: 'desc'})
        .then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    })
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

router.post('/', ensureAuthenticated, (req, res) => {
    let allowComments;
    if (req.body.allowComments) {
        allowComments = false;
    } else {
        allowComments = true;
    };

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    };

    new Story(newStory).save().then(story => {
        res.redirect(`/stories/show/${story.id}`)
    });
});

router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).populate('user')
    .populate('comments.commentUser')
    .then(story => {
        if (story.status == 'public') {
            res.render('stories/show', {
                story: story
            });
        } else {
            if (req.user) {
                if (req.user.id == story.user._id) {
                    res.render('stories/show', {
                        story: story
                    });
                } else {
                    res.redirect('/stories');
                }
            } else {
                res.redirect('/stories');
            }
        }
    });
});

router.get('/edit/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).populate('user').then(story => {
        if (story.user.id != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {
                story: story
            });
        }
    });
});

router.delete('/:id', (req, res) => {
    Story.remove({
        _id: req.params.id
    }).then(() => {
        res.redirect('/dashboard');
    });
});

router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        let allowComments;
        if (req.body.allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        };
        
        story.title = req.body.title;
        story.body = req.body.body;
        story.status = req.body.status;
        story.allowComments = allowComments;

        story.save().then(story => {
            res.redirect(`/dashboard`)
        });
    });
});

router.post('/comment/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }
        story.comments.unshift(newComment);

        story.save().then(story => {
            res.redirect(`/stories/show/${story.id}`);
        })
    });
});

router.get('/user/:userId', (req, res) => {
    Story.find({
        user: req.params.userId,
        status: 'public'
    }).populate('user').then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    });
});

router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
        user: req.user.id
    }).populate('user').then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    });
});

module.exports = router;