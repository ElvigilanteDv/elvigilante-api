const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');

const KY = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
const VALID_QUALITIES = ['144', '240', '360', '480', '720', '1080'];
const YT_REGEX = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/;

const is = axios.create({
    headers: {
        'content-type': 'application/json',
        'origin': 'https://yt.savetube.me',
        'referer': 'https://yt.savetube.me/',
        'user-agent': 'Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0'
    },
    timeout: 30000
});

async function decrypt(enc) {
    const sr = Buffer.from(enc, 'base64');
    const ky = Buffer.from(KY, 'hex');
    const iv = sr.slice(0, 16);
    const dt = sr.slice(16);
    const dc = crypto.createDecipheriv('aes-128-cbc', ky, iv);
    return JSON.parse(Buffer.concat([dc.update(dt), dc.final()]).toString());
}

async function getCdn() {
    const res = await axios.get('https://media.savetube.vip/api/random-cdn', { timeout: 10000 });
    return res.data.cdn;
}

router.get('/', async (req, res) => {
    const { url, quality = '360' } = req.query;

    if (!url) {
        return res.status(400).json({ status: false, creator: 'elvigilante', error: 'El parámetro url es requerido' });
    }

    if (!VALID_QUALITIES.includes(quality)) {
        return res.status(400).json({ status: false, creator: 'elvigilante', error: `Calidad no válida. Usa: ${VALID_QUALITIES.join(', ')}` });
    }

    const id = url.match(YT_REGEX)?.[3];
    if (!id) {
        return res.status(400).json({ status: false, creator: 'elvigilante', error: 'URL de YouTube no válida' });
    }

    try {
        const cdn = await getCdn();

        const infoRes = await is.post(`https://${cdn}/v2/info`, {
            url: `https://www.youtube.com/watch?v=${id}`
        });

        const decrypted = await decrypt(infoRes.data.data);

        const dlRes = await is.post(`https://${cdn}/download`, {
            id,
            downloadType: 'video',
            quality,
            key: decrypted.key
        });

        return res.json({
            status: true,
            creator: 'elvigilante',
            result: {
                title: decrypted.title,
                duration: decrypted.duration,
                thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                quality: quality + 'p',
                format: 'MP4',
                download_url: dlRes.data.data.downloadUrl
            },
            timestamp: new Date().toISOString()
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            creator: 'elvigilante',
            error: e.response?.data?.message || e.message
        });
    }
});

module.exports = router;
