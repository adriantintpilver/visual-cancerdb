const { Router } = require('express');

const path = require('path');
const { unlink } = require('fs-extra');
const router = Router();

// Models
const Image = require('../models/Image');
const { Console } = require('console');

const pageSize = 20;

router.get('/images', async (req, res) => {
    let query = {};
    if(req.query.search){
        query = {$or:[{"title": { $regex: req.query.search, '$options' : 'i'}}, {"description": { $regex: req.query.search , '$options' : 'i'}}]};
    }
    const images = await Image.find(query).skip(req.query.page*pageSize).limit(pageSize);
    res.json(images);
});

router.get('/detail', async (req, res) => {
    const image = await Image.findById(req.query.id);
    res.json(image);
});

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/upload', (req, res) => {
    const { find } = req.params;
    res.render('upload',{ find });
});

router.post('/upload', async (req, res) => {
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.copyright_link = req.body.copyright_link;
    image.copyright_name = req.body.copyright_name;
    image.video_type = req.body.video_type;
    image.video_id = req.body.video_id;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
    await image.save();
    res.redirect('/');
});

router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    res.render('profile', { image,id});
});

router.get('/image/:id/delete/ok', async (req, res) => {
    const id = req.params.id;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + imageDeleted.path));
    res.redirect('/');
});

module.exports = router;