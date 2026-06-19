const express = require('express');
const router = express.Router();
const ytdl = require('@distube/ytdl-core');

const validQualities = ['144', '240', '360', '480', '720', '1080'];

router.get('/', async (req, res) => {
    const { url, quality = '360' } = req.query;

    if (!url) {
        return res.status(400).json({
            status: false,
            creator: 'elvigilante',
            error: 'El parámetro url es requerido'
        });
    }

    if (!validQualities.includes(quality)) {
        return res.status(400).json({
            status: false,
            creator: 'elvigilante',
            error: `Calidad no válida. Usa: ${validQualities.join(', ')}`
        });
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, {
            quality: quality === '1080' ? 'highestvideo' : `${quality}p`,
            filter: 'videoandaudio'
        }) || ytdl.chooseFormat(info.formats, { filter: 'videoandaudio' });

        return res.json({
            status: true,
            creator: 'elvigilante',
            result: {
                title: info.videoDetails.title,
                duration: info.videoDetails.lengthSeconds,
                thumbnail: info.videoDetails.thumbnails.pop()?.url,
                quality: format.qualityLabel,
                format: 'MP4',
                download_url: format.url
            },
            timestamp: new Date().toISOString()
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            creator: 'elvigilante',
            error: e.message
        });
    }
});

module.exports = router;
