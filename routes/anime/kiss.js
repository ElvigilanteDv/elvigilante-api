const express = require('express');
const router = express.Router();

const videos = [
    'https://files.catbox.moe/9klm6t.mp4',
    'https://files.catbox.moe/0ltn0t.mp4',
    'https://files.catbox.moe/4ghg0x.mp4',
    'https://files.catbox.moe/q52gel.webp'
    'https://files.catbox.moe/d6yycp.webp'
    'https://files.catbox.moe/kgvlr0.webp'
    'https://files.catbox.moe/lgwsc9.webp'
    'https://files.catbox.moe/87gm66.webp'
    'https://files.catbox.moe/cx6v44.webp'
    'https://files.catbox.moe/r6371n.webp'
    'https://files.catbox.moe/zfd963.webp'
    'https://files.catbox.moe/buh0py.webp'
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
  
