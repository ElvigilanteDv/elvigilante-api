const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Configurar PayPal Sandbox (para pruebas)
const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

// Modelo de Usuario
const User = mongoose.model('User');

// Planes
const PLANS = {
    vip: { price: 1.00, limit: 1300, role: 'vip', plan: 'VIP', duration: 33 },
    pro: { price: 2.00, limit: 2500, role: 'pro', plan: 'PRO', duration: 33 },
    premium: { price: 4.00, limit: 400000, role: 'premium', plan: 'PREMIUM', duration: 50 }
};

// ============== CREAR ORDEN (VIP, PRO, PREMIUM) ==============
router.post('/create-order', async (req, res) => {
    const { apiKey, plan } = req.body;
    
    if (!apiKey || !plan || !PLANS[plan]) {
        return res.status(400).json({ error: 'Plan no válido' });
    }
    
    try {
        const user = await User.findOne({ key: apiKey });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        
        const planData = PLANS[plan];
        
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: planData.price
                },
                description: `Plan ${planData.plan} - DvWilkerOFC API`,
                custom_id: JSON.stringify({
                    userEmail: user.email,
                    plan: plan,
                    customLimit: null
                })
            }],
            application_context: {
                return_url: `${process.env.APP_URL || 'https://tu-api.onrender.com'}/profile`,
                cancel_url: `${process.env.APP_URL || 'https://tu-api.onrender.com'}/profile`
            }
        });
        
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear orden' });
    }
});

// ============== CREAR ORDEN ADMIN (con límite personalizado) ==============
router.post('/create-admin-order', async (req, res) => {
    const { apiKey, customLimit } = req.body;
    
    if (!apiKey || !customLimit || customLimit < 100) {
        return res.status(400).json({ error: 'Cantidad inválida (mínimo 100)' });
    }
    
    try {
        const user = await User.findOne({ key: apiKey });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: 6.00
                },
                description: `Plan ADMIN - ${customLimit} solicitudes`,
                custom_id: JSON.stringify({
                    userEmail: user.email,
                    plan: 'admin',
                    customLimit: customLimit
                })
            }],
            application_context: {
                return_url: `${process.env.APP_URL || 'https://tu-api.onrender.com'}/profile`,
                cancel_url: `${process.env.APP_URL || 'https://tu-api.onrender.com'}/profile`
            }
        });
        
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear orden' });
    }
});

// ============== CAPTURAR PAGO ==============
router.post('/capture-order', async (req, res) => {
    const { orderId, apiKey } = req.body;
    
    try {
        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        
        const capture = await client.execute(request);
        const result = capture.result;
        
        if (result.status === 'COMPLETED') {
            const customData = JSON.parse(result.purchase_units[0].payments.captures[0].custom_id);
            const { userEmail, plan, customLimit } = customData;
            
            let planData = PLANS[plan];
            let finalLimit = planData ? planData.limit : customLimit;
            let durationDays = planData ? planData.duration : 33;
            let role = plan === 'admin' ? 'admin' : (planData ? planData.role : 'vip');
            let planName = plan === 'admin' ? 'ADMIN' : (planData ? planData.plan : 'VIP');
            
            const expiresDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
            
            await User.updateOne(
                { email: userEmail },
                {
                    role: role,
                    plan: planName,
                    limit: finalLimit,
                    requestToday: 0,
                    vipSince: new Date(),
                    vipExpires: expiresDate
                }
            );
            
            res.json({ 
                status: true, 
                message: `¡Felicidades! Ahora eres ${planName} por ${durationDays} días. Límite: ${finalLimit} solicitudes/día`,
                plan: planName,
                limit: finalLimit
            });
        } else {
            res.status(400).json({ error: 'Pago no completado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al capturar pago' });
    }
});

module.exports = router;