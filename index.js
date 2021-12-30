const Joi = require ('joi');
const express = require('express');
const app = express();

app.use(express.json());

const images = [
    { id: 1, name: 'image1' },
    { id: 2, name: 'image2' },
    { id: 3, name: 'image3' },
];

app.get('/', function(req,res) {
    res.send('Welcome to Front Page');
});

app.get('/api/images', function(req,res) {
    res.send(images);
});

app.get('/api/images/:id', function(req,res) {
    const image = images.find(c => c.id === parseInt(req.params.id));
    if (!image) return res.status(404).send('No such Image ID');
    res.send(image)
});

app.post('/api/images', function(req,res) {
    const { error } = validateImage(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const image = {
        id: images.length + 1,
        name: req.body.name
    };
    images.push(image)
    res.send(image)
});

app.put('/api/images/:id', (req, res) => {
    const image = images.find(c => c.id === parseInt(req.params.id));
    if (!image) return res.status(404).send('No such Image ID');

    const { error } = validateImage(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    image.name = req.body.name;
    res.send(image);
});

app.delete('/api/images/:id', (req, res) => {
    const image = images.find(c => c.id === parseInt(req.params.id));
    if (!image) return res.status(404).send('No such Image ID');

    const index = images.indexOf(image);
    images.splice(index, 1);

    res.send(image);
});

function validateImage(image) {
    const schema = Joi.object ({
        name: Joi.string().min(3).required()
    });

    return schema.validate(image);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));