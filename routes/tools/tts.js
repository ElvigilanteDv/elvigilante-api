const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');

const voces = {
    mujer: '21m00Tcm4TlvDq8ikWAM', // Rachel
    hombre: 'TxGEqnHWrfWFTfGW9XjX'  // Josh
};

async function subirCatbox(buffer) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, {
        filename: `tts_${Date.now()}.mp3`,
        contentType: 'audio/mpeg'
    });

    const response = await axios.post('https://catbox.moe/user.php', form, {
        headers: form.getHeaders(),
        timeout: 30000
    });

    return response.data.trim(); // devuelve la URL directa
}

router.get('/', async (req, res) => {
    const { texto, genero = 'mujer' } = req.query;

    if (!texto || texto.trim().length === 0) {
        return res.status(400).json({ status: false, error: 'El parámetro texto es requerido' });
    }

    if (texto.length > 500) {
        return res.status(400).json({ status: false, error: 'El texto no puede superar los 500 caracteres' });
    }

    const voiceId = voces[genero.toLowerCase()] || voces.mujer;

    try {
        // 1. Generar audio con ElevenLabs
        const elevenlabs = await axios({
            method: 'POST',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            headers: {
                'xi-api-key': '0009d90b0ebda9c2c334f1f0c01bc5f2b24809831e72fe3974a39573799ee059',
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            },
            data: {
                text: texto.trim(),
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                    style: 0.3,
                    use_speaker_boost: true
                }
            },
            responseType: 'arraybuffer',
            timeout: 30000
        });

        // 2. Subir a catbox y obtener URL
        const buffer = Buffer.from(elevenlabs.data);
        const url = await subirCatbox(buffer);

        if (!url.startsWith('https://')) {
            throw new Error('Error al subir el audio a catbox');
        }

        res.json({
            status: true,
            creator: 'elvigilante',
            genero,
            texto: texto.trim(),
            url,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        const msg = error.response?.data?.detail?.message || error.message || 'Error al generar el audio';
        res.status(500).json({ status: false, error: msg });
    }
});

module.exports = router;
