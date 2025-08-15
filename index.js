const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase connection
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// GET destinations
app.get('/destinations', async (req, res) => {
    const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET hotels
app.get('/hotels', async (req, res) => {
    const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('rating', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET events
app.get('/events', async (req, res) => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST booking
app.post('/bookings', async (req, res) => {
    const payload = req.body;
    const { data, error } = await supabase.from('bookings').insert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// POST event registration
app.post('/event_reg', async (req, res) => {
    const payload = req.body;
    const { data, error } = await supabase.from('event_reg').insert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});