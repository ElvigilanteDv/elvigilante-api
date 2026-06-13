const axios = require('axios');
const crypto = require('crypto');

class SaveTubeVideo {
    constructor() {
        this.ky = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        this.fmt = ['144', '240', '360', '480', '720', '1080'];
        this.m = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/;
        this.is = axios.create({
            headers: {
                'content-type': 'application/json',
                'origin': 'https://yt.savetube.me',
                'user-agent': 'Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0'
            }
        });
    }

    async decrypt(enc) {
        try {
            const sr = Buffer.from(enc, 'base64');
            const ky = Buffer.from(this.ky, 'hex');
            const iv = sr.slice(0, 16);
            const dt = sr.slice(16);
            const dc = crypto.createDecipheriv('aes-128-cbc', ky, iv);
            return JSON.parse(Buffer.concat([dc.update(dt), dc.final()]).toString());
        } catch (e) {
            throw new Error(`Error al desencriptar: ${e.message}`);
        }
    }

    async getCdn() {
        const response = await this.is.get("https://media.savetube.vip/api/random-cdn");
        if (!response.data) return { status: false, msg: "No se pudo obtener CDN" };
        return { status: true, data: response.data.cdn };
    }

    async download(url, quality = '360') {
        const id = url.match(this.m)?.[3];
        if (!id) return { status: false, msg: "No se pudo extraer el ID del video" };
        if (!quality || !this.fmt.includes(quality)) {
            return { status: false, msg: "Calidad no soportada", list: this.fmt };
        }

        try {
            const cdn = await this.getCdn();
            if (!cdn.status) return cdn;

            const infoRes = await this.is.post(`https://${cdn.data}/v2/info`, {
                url: `https://www.youtube.com/watch?v=${id}`
            });
            const decrypted = await this.decrypt(infoRes.data.data);

            const dlRes = await this.is.post(`https://${cdn.data}/download`, {
                id: id,
                downloadType: 'video',
                quality: quality,
                key: decrypted.key
            });

            return {
                status: true,
                title: decrypted.title,
                thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                duration: decrypted.duration,
                quality: quality + 'p',
                download_url: dlRes.data.data.downloadUrl,
                cached: decrypted.fromCache || false
            };
        } catch (error) {
            return { status: false, error: error.message };
        }
    }
}

// Endpoint para descargar video (con la misma estructura que ytaudio)
const ytvideo = async (req, res) => {
    const { url, quality = '360' } = req.query;
    const endpointPrefix = req.baseUrl || '';

    if (!url) {
        return res.status(400).json({
            status: false,
            creator: "elvigilante",
            error: "URL parameter is required",
            message: "Please provide a YouTube URL: ?url=YOUTUBE_URL"
        });
    }

    // Validar calidad
    const validQualities = ['144', '240', '360', '480', '720', '1080'];
    if (!validQualities.includes(quality)) {
        return res.status(400).json({
            status: false,
            creator: "elvigilante",
            error: `Invalid quality. Use: ${validQualities.join(', ')}`,
            message: "Example: ?url=...&quality=720"
        });
    }

    try {
        const st = new SaveTubeVideo();
        const video = await st.download(url, quality);

        if (!video.status) {
            return res.status(500).json({
                status: false,
                creator: "elvigilante",
                error: video.error || video.msg
            });
        }

        // Si se solicita descarga directa
        if (req.query.download === 'true') {
            return res.redirect(video.download_url);
        }

        return res.json({
            status: true,
            creator: "elvigilante",
            result: {
                title: video.title,
                duration: video.duration,
                thumbnail: video.thumbnail,
                quality: video.quality,
                format: "MP4",
                download_url: video.download_url,
                api_download: `${endpointPrefix}/download/ytvideo?url=${encodeURIComponent(url)}&quality=${quality}&download=true`
            },
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            creator: "elvigilante",
            error: e.message
        });
    }
};

module.exports = ytvideo;