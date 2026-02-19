# Yerel Ortamda Backend ve Mobile Ayrı Ayrı Çalıştırma

Bu rehber, backend (API) ve mobile (Expo) projesini yerelde **ayrı terminallerde** nasıl çalıştıracağınızı anlatır.

## Ön koşullar

- **Node.js** (LTS önerilir)
- **pnpm** veya **npm**: `npm install -g pnpm` veya doğrudan `npm` kullanın
- **PostgreSQL** yerelde çalışıyor ve bir veritabanı mevcut (örn. `postgres`)

## 1. Ortam değişkenleri (.env)

Proje kökünde `.env` dosyası oluşturun (veya `.env.example`'ı kopyalayın):

```bash
cp .env.example .env
```

**Yerel çalışma için en az şunlar gerekli:**

| Değişken | Açıklama | Örnek |
|----------|----------|--------|
| `DATABASE_URL` | PostgreSQL bağlantı dizisi | `postgresql://KULLANICI@localhost:5432/postgres` |
| `EXPO_PUBLIC_API_BASE_URL` | Mobil/web uygulamasının API adresi | `http://localhost:3000` |

- Backend **sadece** `DATABASE_URL` ile çalışabilir (diğerleri isteğe bağlı).
- Mobile tarafının API’ye istek atabilmesi için `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000` olmalı (backend 3000 portunda çalışıyorsa).

`.env` örneği:

```env
DATABASE_URL="postgresql://plaiteknoloji@localhost:5432/postgres"
EXPO_PUBLIC_API_BASE_URL="http://localhost:3000"
PORT=3000
```

## 2. Bağımlılıkları yükleme

Proje kökünde bir kez:

```bash
pnpm install
# veya
npm install
```

## 3. Backend’i (API) ayrı çalıştırma

**Terminal 1 – Backend**

```bash
pnpm dev:server
# veya
npm run dev:server
```

- Sunucu varsayılan olarak **http://localhost:3000** (veya `PORT` ile belirttiğiniz port) üzerinde açılır.
- Çıktıda `[api] server listening on port 3000` benzeri bir satır görürsünüz.
- Sağlık kontrolü: tarayıcıda **http://localhost:3000/api/health** açın; `{"ok":true,...}` dönmeli.

Backend bu şekilde tek başına çalışır; veritabanı erişimi ve tRPC endpoint’leri hazır olur.

## 4. Mobile / Web’i ayrı çalıştırma

**Terminal 2 – Expo (Mobile + Web)**

```bash
pnpm dev:metro
# veya
npm run dev:metro
```

- Varsayılan port: **8081**.
- **Web:** Tarayıcıda **http://localhost:8081** açın.
- **iOS simülatör:** `i` tuşu veya `pnpm ios` / `npm run ios`.
- **Android emülatör:** `a` tuşu veya `pnpm android` / `npm run android`.

Mobile uygulama, `.env` içindeki `EXPO_PUBLIC_API_BASE_URL` ile backend’e (http://localhost:3000) istek atar. Bu yüzden backend’in önce açık olması gerekir.

## 5. Özet: İki terminal

| Terminal | Komut | Adres |
|----------|--------|--------|
| 1 – Backend | `pnpm dev:server` | http://localhost:3000 |
| 2 – Mobile/Web | `pnpm dev:metro` | http://localhost:8081 (web) |

1. Önce **Terminal 1**’de backend’i başlatın.
2. Sonra **Terminal 2**’de Expo’yu başlatın ve web veya emülatörden uygulamayı açın.

## 6. Tek komutla ikisini birlikte çalıştırma

Backend ve Metro’yu **aynı anda** tek komutla başlatmak isterseniz:

```bash
pnpm dev
# veya
npm run dev
```

Bu komut hem `dev:server` hem `dev:metro`’yu aynı terminalde (concurrently) çalıştırır.

## 7. Sadece backend’i production modunda çalıştırma

Önce build alın, sonra sunucuyu çalıştırın:

```bash
pnpm build
pnpm start
```

`NODE_ENV=production` ve `dist/index.js` kullanılır. Yine `DATABASE_URL` ve isteğe bağlı diğer env değişkenleri `.env` veya ortamdan okunur.

## 8. Sık karşılaşılan durumlar

- **“Database not available” / Veritabanı hatası**  
  `DATABASE_URL` doğru mu, PostgreSQL çalışıyor mu kontrol edin. Migration’lar uygulandı mı: `DATABASE_URL=... pnpm exec drizzle-kit migrate`

- **Mobile’dan API’ye istek gitmiyor / CORS**  
  Backend CORS’u request origin’e göre açıyor; `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000` ile web’de http://localhost:8081 kullanıyorsanız sorun olmaması gerekir. Farklı bir port kullanıyorsanız `.env`’deki `EXPO_PUBLIC_API_BASE_URL` ve backend’in dinlediği `PORT`’u eşleştirin.

- **OAuth / Giriş**  
  OAuth kullanacaksanız ilgili `EXPO_PUBLIC_*` ve `VITE_*` değişkenlerini `.env`’e eklemeniz gerekir. Yerelde sadece API ve veritabanı ile denemek için Detay için **LOCAL_OAUTH.md** dosyasına bakın (Manus OAuth yerelde neden çalışmıyor, nasıl test edilir, dev login).

Bu adımlarla backend’i ve mobile’ı yerelde ayrı ayrı (veya `pnpm dev` ile birlikte) çalıştırabilirsiniz.
