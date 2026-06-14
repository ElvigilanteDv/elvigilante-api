const express = require('express');
const router = express.Router();
const axios = require('axios');

// Voces dulces seleccionadas de ElevenLabs
const voces = {
    mujer: '21m00Tcm4TlvDq8ikWAM', // Rachel - voz femenina dulce y natural
    hombre: 'TxGEqnHWrfWFTfGW9XjX'  // Josh - voz masculina suave y agradable
};

// GET /api/tools/tts?texto=Hola mundo&genero=mujer
router.get('/', async (req, res) => {
    const { texto, genero = 'mujer' } = req.query;

    if (!texto || texto.trim().length === 0) {
        return res.status(400).json({
            status: false,
            error: 'El parámetro texto es requerido'
        });
    }

    if (texto.length > 500) {
        return res.status(400).json({
            status: false,
            error: 'El texto no puede superar los 500 caracteres'
        });
    }

    const voiceId = voces[genero.toLowerCase()] || voces.mujer;

    try {
        const response = await axios({
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
            responseType: 'stream',
            timeout: 30000
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `inline; filename="tts_${genero}_${Date.now()}.mp3"`);
        response.data.pipe(res);

    } catch (error) {
        const msg = error.response?.data?.detail?.message || error.message || 'Error al generar el audio';
        res.status(500).json({
            status: false,
            error: msg
        });
    }
});

module.exports = router;
