const express = require('express');
const router = express.Router();

const videos = [
    'https://files.catbox.moe/9klm6t.mp4',
    'https://files.catbox.moe/0ltn0t.mp4',
    'https://files.catbox.moe/4ghg0x.mp4',
    // Agrega más URLs aquí
];

router.get('/', (req, res) => {
    const video = videos[Math.floor(Math.random() * videos.length)];

    res.json({
        status: true,
        creator: 'elvigilante',
        tipo: 'anime-kiss',
        url: video,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
  
