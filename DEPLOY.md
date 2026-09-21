# PayDay Loyihasini Serverga Yuklash va Deploy Qilish Qo'llanmasi

Ushbu qo'llanmada **`payday.uz`** (Landing sahifa) va **`panel.payday.uz`** (Boshqaruv paneli / Web CRM) tizimlarini serverga yuklash, Nginx sozlash va avtomatlashtirilgan CI/CD orqali deploy qilish bo'yicha to'liq yo'riqnoma keltirilgan.

---

## 1. `payday.uz` (Landing Sahifasi) Deploy Qilish

`payday.uz` — statik HTML5, CSS va JavaScript asosida qurilgan bo'lib, unga Node.js yoki alohida server jarayoni kerak emas. Uni to'g'ridan-to'g'ri **Nginx** orqali eng yuqori tezlikda uzatish mumkin.

### A. Git orqali Serverga Yuklash (Manual Deploy):

1. **Serverga SSH orqali ulanish:**
   ```bash
   ssh root@SERVER_IP
   # yoki
   ssh user@SERVER_IP
   ```

2. **Loyihani serverga klonlash (agar hali klonlanmagan bo'lsa):**
   ```bash
   mkdir -p /var/www/payday.uz
   cd /var/www/payday.uz
   git clone git@github.com:IslomFargoniy/payday.uz.git .
   ```

3. **Yangi o'zgarishlarni yuklab olish (Update):**
   ```bash
   cd /var/www/payday.uz
   git pull origin main
   ```

4. **Fayllar ruxsatlarini to'g'rilash:**
   ```bash
   chown -R www-data:www-data /var/www/payday.uz
   chmod -R 755 /var/www/payday.uz
   ```

---

### B. Nginx Konfiguratsiyasi (`payday.uz`):

`/etc/nginx/sites-available/payday.uz` faylini yarating:

```nginx
server {
    listen 80;
    server_name payday.uz www.payday.uz;

    root /var/www/payday.uz;
    index index.html;

    # Gzip siqish (Tez yuklanish uchun)
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Statik fayllar (rasm, shrift, CSS/JS) keshini sozlash
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # robots.txt va sitemap.xml
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location = /sitemap.xml {
        allow all;
        log_not_found off;
        access_log off;
    }
}
```

Saytni faollashtirish va Nginx'ni qayta yuklash:
```bash
ln -s /etc/nginx/sites-available/payday.uz /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### C. SSL Sertifikatini O'rnatish (HTTPS / Let's Encrypt):
```bash
apt update && apt install -y certbot python3-certbot-nginx
certbot --nginx -d payday.uz -d www.payday.uz
```

---

## 2. `panel.payday.uz` (Boshqaruv Paneli) Qanday Yuklanadi?

`panel.payday.uz` odatda quyidagi 2 xil arxitekturadan birida ishlaydi:

### 1-Variant: Docker / Docker Compose orqali (Tavsiya etiladi)

1. **Serverdagi panel katalogiga kirish:**
   ```bash
   cd /var/www/panel.payday.uz
   ```

2. **Yangi kodni tortish va konteynerlarni qayta qurish:**
   ```bash
   git pull origin main
   docker compose down
   docker compose up -d --build
   ```

---

### 2-Variant: Node.js / React / Next.js SPA yoki PM2 orqali

1. **SPA (Frontend Build):**
   ```bash
   cd /var/www/panel.payday.uz
   git pull origin main
   npm install --production=false
   npm run build
   # Build qilingan 'dist' yoki 'build' papkasini Nginx orqali uzatish
   ```

2. **SSR / Node Backend (PM2 orqali):**
   ```bash
   pm2 restart panel-payday || pm2 start npm --name "panel-payday" -- start
   ```

---

### D. Nginx Konfiguratsiyasi (`panel.payday.uz`):

`/etc/nginx/sites-available/panel.payday.uz` fayli:

```nginx
server {
    listen 80;
    server_name panel.payday.uz;

    # Agar Docker / Node.js server portda ishlayotgan bo'lsa (Reverse Proxy):
    location / {
        proxy_pass http://127.0.0.1:3000; # Panel porti
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Agar Panel statik SPA (dist/build) bo'lsa:
    # root /var/www/panel.payday.uz/dist;
    # index index.html;
    # location / {
    #     try_files $uri $uri/ /index.html;
    # }
}
```

SSL sertifikat:
```bash
certbot --nginx -d panel.payday.uz
```

---

## 3. Avtomatlashtirilgan CI/CD (GitLab CI / GitHub Actions)

Loyihada [.gitlab-ci.yml](file:///Users/iosdevelopmentcenter/Desktop/AddProjects/payday.uz/.gitlab-ci.yml) mavjud.

GitLab'ga kod yuklanganda (Push `main`), GitLab Runner serverga avtomatik kirib `git pull` qiladi. Buning uchun GitLab repository sozlamalarida quyidagi o'zgaruvchilarni (Variables) kiritish kifoya:
* `SSH_PRIVATE_KEY` — Serverga kirish uchun xususiy kalit (Ed25519 / RSA)
* `SSH_HOST` — Serverning IP manzili yoki domeni
* `SSH_USER` — Server foydalanuvchi nomi (`root` yoki maxsus deployer)
* `WORK_DIR` — `/var/www/payday.uz`

---

## 4. Bir Qatorli Tezkor Deploy Skripti

Lokal kompyuterdan serverga to'g'ridan-to'g'ri yangilash uchun:
```bash
git add .
git commit -m "feat: update landing page and seo"
git push origin main
```
So'ngra serverda:
```bash
ssh user@server "cd /var/www/payday.uz && git pull origin main"
```
