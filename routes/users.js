const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { generateKey } = require('../middlewares/auth');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://zenith_agent:rx2CSutif3hgsjcy@dbzenithapi.sio7jth.mongodb.net/?appName=DBZenithAPI';
const MONGODB_DB = process.env.MONGODB_DB || 'wilker_api';

// Leer admin desde JSON
const adminPath = path.join(__dirname, '../database/users.json');
let adminUser = null;
try {
    adminUser = JSON.parse(fs.readFileSync(adminPath, 'utf-8'));
    console.log('✅ Admin cargado desde JSON:', adminUser.username);
} catch (err) {
    console.error('❌ Error cargando admin desde JSON:', err.message);
}

// Conectar a MongoDB
if (mongoose.connection.readyState === 0) {
    mongoose.connect(`${MONGODB_URI}/${MONGODB_DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('✅ Conectado a MongoDB Atlas'))
      .catch(err => console.error('❌ Error MongoDB:', err));
}

// Esquema de Usuario
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    plan: { type: String, default: 'free' },
    limit: { type: Number, default: 100 },
    requestToday: { type: Number, default: 0 },
    totalRequest: { type: Number, default: 0 },
    profile_img: { type: String, default: 'https://raw.githubusercontent.com/dvwilker/gohan-storage/main/1778169562859-IMG-20260504-WA0386.jpg' },
    lastRequestDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// ============== FUNCIÓN PARA VERIFICAR ADMIN ==============
async function verificarAdminEnMongo() {
    if (!adminUser) return;
    
    try {
        const adminExiste = await User.findOne({ email: adminUser.email });
        
        if (!adminExiste) {
            // Si no existe el admin en MongoDB, lo creamos
            const admin = new User({
                username: adminUser.username,
                email: adminUser.email,
                password: adminUser.password,
                key: adminUser.key,
                role: adminUser.role || 'admin',
                plan: adminUser.plan || 'ADMIN VIP',
                limit: adminUser.limit || 100000,
                requestToday: 0,
                totalRequest: adminUser.totalRequest || 0,
                lastRequestDate: new Date().toISOString().split('T')[0]
            });
            await admin.save();
            console.log('✅ Admin sincronizado con MongoDB');
        } else {
            // Si ya existe pero algo cambió en JSON, actualizamos
            await User.updateOne(
                { email: adminUser.email },
                {
                    role: adminUser.role || 'admin',
                    plan: adminUser.plan || 'ADMIN VIP',
                    limit: adminUser.limit || 100000
                }
            );
            console.log('✅ Admin actualizado desde JSON');
        }
    } catch (err) {
        console.error('❌ Error sincronizando admin:', err);
    }
}

// Ejecutar sincronización al iniciar
setTimeout(() => {
    verificarAdminEnMongo();
}, 2000);

// ============== REGISTRO (solo usuarios normales a MongoDB) ==============
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ status: false, message: "Faltan datos obligatorios" });
    }

    // No permitir registrar el email del admin
    if (adminUser && email === adminUser.email) {
        return res.status(400).json({ status: false, message: "Este email no puede ser registrado" });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ status: false, message: "El correo o usuario ya existe" });
        }

        const newUser = new User({
            username,
            email,
            password,
            key: generateKey(),
            role: "user",
            plan: "free",
            limit: 100,
            requestToday: 0,
            totalRequest: 0,
            lastRequestDate: new Date().toISOString().split('T')[0]
        });

        await newUser.save();
        res.json({ status: true, creator: "Félix Ofc", message: "Registro exitoso", key: newUser.key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Error en el servidor durante el registro" });
    }
});

// ============== LOGIN (busca primero en admin JSON, luego en MongoDB) ==============
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: "Email y contraseña requeridos" });
    }

    try {
        let user = null;
        
        // Verificar si es el admin del JSON
        if (adminUser && email === adminUser.email && password === adminUser.password) {
            user = adminUser;
            user.role = 'admin';
            user.plan = 'ADMIN VIP';
        } else {
            // Buscar en MongoDB
            user = await User.findOne({ email, password });
        }

        if (!user) {
            return res.status(401).json({ status: false, message: "Credenciales incorrectas" });
        }

        res.json({
            status: true,
            creator: "DvWilkerOFC",
            data: {
                username: user.username,
                email: user.email,
                key: user.key,
                role: user.role || 'user',
                plan: user.plan || 'free',
                limit: user.limit || 100,
                profileImg: user.profile_img || 'https://raw.githubusercontent.com/dvwilker/gohan-storage/main/1778169562859-IMG-20260504-WA0386.jpg'
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Error interno en el servidor" });
    }
});

// ============== OBTENER MI PERFIL ==============
router.get('/me', async (req, res) => {
    const { apiKey } = req.query;
    if (!apiKey) return res.status(400).json({ status: false, message: "ApiKey requerida" });

    try {
        let user = null;
        
        // Verificar si es el admin
        if (adminUser && apiKey === adminUser.key) {
            user = adminUser;
            user.role = 'admin';
            user.plan = 'ADMIN VIP';
        } else {
            user = await User.findOne({ key: apiKey });
        }

        if (!user) return res.status(404).json({ status: false, message: "Usuario no encontrado" });

        res.json({
            status: true,
            creator: "DvWilkerOFC",
            data: {
                username: user.username,
                email: user.email,
                key: user.key,
                role: user.role || 'user',
                plan: user.plan || 'free',
                profile_img: user.profile_img,
                requests: {
                    today: user.requestToday || 0,
                    total: user.totalRequest || 0,
                    limit: user.limit || 100,
                    remaining: (user.limit || 100) - (user.requestToday || 0)
                }
            }
        });
    } catch (err) {
        res.status(500).json({ status: false, message: "Error interno" });
    }
});

// ============== DASHBOARD GLOBAL ==============
router.get('/dashboard-global', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const topUsers = await User.find({ totalRequest: { $gt: 0 } })
            .sort({ totalRequest: -1 })
            .limit(5);
        
        const top5 = topUsers.map(u => ({
            username: u.username,
            total: u.totalRequest,
            initial: u.username.charAt(0).toUpperCase()
        }));

        res.json({ 
            status: true, 
            totalUsers: totalUsers + 1, // +1 por el admin
            globalRequests: 0, 
            uptime: global.startTime || Date.now(), 
            top5 
        });
    } catch (err) {
        res.status(500).json({ status: false });
    }
});

// ============== ADMIN: VER TODOS ==============
router.get('/admin/all', async (req, res) => {
    const { apiKey } = req.query;
    try {
        // Verificar si es admin por JSON o MongoDB
        let isAdmin = false;
        if (adminUser && apiKey === adminUser.key) {
            isAdmin = true;
        } else {
            const adminCheck = await User.findOne({ key: apiKey, role: 'admin' });
            isAdmin = !!adminCheck;
        }

        if (!isAdmin) return res.status(403).json({ status: false, message: "No autorizado" });

        const users = await User.find({});
        // Agregar el admin al listado
        if (adminUser) {
            users.unshift({
                username: adminUser.username,
                email: adminUser.email,
                key: adminUser.key,
                role: 'admin',
                plan: 'ADMIN VIP',
                limit: adminUser.limit
            });
        }
        res.json({ status: true, users });
    } catch (err) {
        res.status(500).json({ status: false });
    }
});

// El resto de rutas (update-profile, stats, etc.) se mantienen igual...

module.exports = router;