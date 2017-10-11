const Post =  require('../models/post');

const postPost = function(req, res) {
    const post = new Post({
        image: req.body.image,
        title: req.body.title,
        date: req.body.date,
        text: req.body.text
    });

    post.save()
        .then(() => res.json({ message: 'Post created' }))
        .catch((error) => {
            res.send(error);
        });
};

const getPosts = function(req, res) {
    const limit = +req.query.limit || 10;
    const skip = +req.query.skip || 0;

    let count;

    Post.count({})
        .then((posts) => {
            count = posts;
        });

    Post.find()
        .skip(skip)
        .limit(limit)
        .select([
            'id',
            'title',
            'image',
            'important'
        ])
        .then((posts) => {

            res.json({
                posts: posts,
                count: count
            });
        })
        .catch((error) => {
            res.send(error);
        });
};

const getPost = function(req, res) {
    Post.findById(req.params.post_id)
        .then((post) => {
            res.json(post);
        })
        .catch((error) => {
            res.send(error);
        });
};

const putPost = function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if(err) {
            res.send(err);
        }

        post.title = req.body.title;
        post.text = req.body.text;

        post.save(function(err) {
            if(err) {
                res.send(err);
            }
        });

        res.json({ message: 'Post updated' });
    });
};

const deletePost = function(req, res) {
    Post.remove({
        _id: req.params.post_id
    }, function(err, post) {
        if(err) {
            res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
    });
};

module.exports = {
    postPost: postPost,
    getPosts: getPosts,
    getPost: getPost,
    putPost: putPost,
    deletePost: deletePost
};
