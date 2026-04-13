# Gunakan Node.js 20 berbasis Debian Slim agar ringan namun stabil
FROM node:20-slim

# 1. Tentukan direktori kerja di dalam container
WORKDIR /app

# 2. Install PM2 secara global
RUN npm install pm2 -g

# 3. Salin file package.json dan package-lock.json terlebih dahulu
# Ini dilakukan agar 'npm install' hanya jalan jika ada perubahan pada dependensi (cache optimization)
COPY package*.json ./

# 4. Install semua dependensi Node.js
RUN npm install

# 5. Salin seluruh kode sumber aplikasi ke dalam container
COPY . .

# 6. Expose port 4000 (sesuai konfigurasi di server.js kamu)
EXPOSE 4000

# 7. Jalankan aplikasi menggunakan PM2-Runtime
# --name digunakan untuk memberi nama proses di dalam PM2
CMD ["pm2-runtime", "start", "server.js", "--name", "aida-voice-frontend"]