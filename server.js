require('dotenv').config(); 
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Konfigurasi App
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// --- KONFIGURASI ENV ---
// Mengambil data dari .env tanpa menulis URL mentah di sini
const BACKEND_URL = process.env.BACKEND_URL;
const PORT = process.env.PORT || 4000;

// Validasi sederhana: Jika BACKEND_URL lupa diisi di .env, beri tahu di console
if (!BACKEND_URL) {
    console.error("⚠️  PERINGATAN: BACKEND_URL tidak ditemukan di file .env!");
}

// --- MIDDLEWARE ---
const isGuest = (req, res, next) => {
    if (req.cookies.user_data) {
        return res.redirect('/');
    }
    next();
};

// --- ROUTES ---

// Halaman Utama (Chat)
app.get('/', (req, res) => {
    let user = { role: 'guest' };
    
    if (req.cookies.user_data) {
        try {
            // Cukup satu baris parse
            user = JSON.parse(req.cookies.user_data);
        } catch (e) {
            console.error("Gagal parse cookie user_data");
        }
    }
    
    res.render('chat', { 
        user, 
        backendUrl: BACKEND_URL 
    });
});

// Halaman Login
app.get('/login', isGuest, (req, res) => {
    res.render('login', { 
        backendUrl: BACKEND_URL // Kirim nilai dari process.env ke file EJS
    });
});

// Proses Logout
app.get('/logout', (req, res) => {
    res.clearCookie('user_data');
    res.redirect('/login');
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`🚀 AIDA Frontend : http://localhost:${PORT}`);
    console.log(`🔗 Koneksi API   : ${BACKEND_URL || 'BELUM DISET'}`);
    console.log(`-----------------------------------------------`);
});