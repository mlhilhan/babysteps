# Railway ile Backend + PostgreSQL Yayınlama

Bu rehber, BabySteps backend API’nizi ve PostgreSQL veritabanınızı **Railway** üzerinde nasıl yayınlayacağınızı adım adım anlatır.

## Ön koşullar

- **GitHub** (veya GitLab/Bitbucket) hesabı – proje repo’da olmalı
- **Railway** hesabı – [railway.app](https://railway.app) üzerinden (GitHub ile giriş yapabilirsiniz)

---

## 1. Railway projesi ve PostgreSQL oluşturma

1. [Railway Dashboard](https://railway.app/dashboard) → **New Project**
2. **Deploy from GitHub repo** seçin, BabySteps repo’nuzu bağlayın
3. Repo seçildikten sonra **Add variables** veya önce servisleri ekleyin:
   - **+ New** → **Database** → **PostgreSQL** ekleyin  
     Railway otomatik olarak `DATABASE_URL` değişkenini oluşturur ve servise bağlar.
4. Ana servisiniz (backend) zaten “repo’dan gelen” servis olacak. PostgreSQL’i bu servise **bağlamak** için:
   - Backend servisine tıklayın → **Variables** → **Add variable** veya **Reference**
   - PostgreSQL servisinin **Variables** kısmından `DATABASE_URL`’i **Referenced Variable** olarak ekleyin (örn. `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`)

---

## 2. Build ve Start komutları

Proje kökünde **railway.toml** var; Railway bunu kullanır. İsterseniz Dashboard’dan da ayarlayabilirsiniz:

| Ayar | Değer |
|------|--------|
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |
| **Pre-deploy Command** | `npm run db:migrate` (her deploy öncesi migration) |

- **Build:** Bağımlılıklar kurulur, `dist/index.js` oluşturulur.  
  `--include=dev` ile `drizzle-kit` (migration) da kurulur.
- **Pre-deploy:** Her deploy öncesi `drizzle-kit migrate` çalışır.
- **Start:** `NODE_ENV=production node dist/index.js` – Railway `PORT`’u otomatik verir.

---

## 3. Ortam değişkenleri (Variables)

Backend servisi → **Variables** bölümünde en az şunları ayarlayın:

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `DATABASE_URL` | Evet | PostgreSQL bağlantı dizini (Postgres servisinden referans alın) |
| `JWT_SECRET` | Evet (OAuth/oturum için) | Güçlü, rastgele bir string (oturum cookie imzası) |
| `NODE_ENV` | Otomatik | Railway production’da `production` yapar |

**Manus OAuth kullanacaksanız** (production giriş):

- `OAUTH_SERVER_URL`
- `VITE_APP_ID` veya `EXPO_PUBLIC_APP_ID`

İsteğe bağlı: `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `OPENAI_API_KEY` vb.

**Not:** `DATABASE_URL`’i PostgreSQL servisinden “Referenced Variable” olarak eklediyseniz ayrıca manuel girmeniz gerekmez.

---

## 4. İlk deploy ve migration

1. Değişkenleri kaydettikten sonra **Deploy** tetiklenir (veya **Deploy** butonuna basın).
2. Build ve pre-deploy (migration) bittikten sonra backend ayağa kalkar.
3. **Settings** → **Networking** → **Generate Domain** ile public URL üretin (örn. `https://xxx.up.railway.app`).

Eğer **pre-deploy** kullanmıyorsanız veya ilk kurulumda migration’lar çalışmadıysa, yerelde Railway CLI ile bir kez migration çalıştırabilirsiniz:

```bash
# Railway CLI: npm i -g railway
railway login
railway link   # Proje ve backend servisini seçin
railway run npm run db:migrate
```

---

## 5. Mobil / Web frontend’i backend’e bağlama

Yayındaki API adresiniz örnek: `https://babysteps-production-xxx.up.railway.app`

- **Expo / React Native** projesinde (veya web build’de) API base URL’i bu adrese çevirin:
  - `.env` veya EAS/Railway ortam değişkeni:  
    `EXPO_PUBLIC_API_BASE_URL=https://babysteps-production-xxx.up.railway.app`
- Manus OAuth kullanıyorsanız, Manus dashboard’da **Redirect URI** olarak şunu ekleyin:  
  `https://babysteps-production-xxx.up.railway.app/api/oauth/callback`

Böylece mobil uygulama ve web, production backend’inize istek atar.

---

## 6. Özet kontrol listesi

- [ ] Railway’de yeni proje, repo bağlandı
- [ ] PostgreSQL eklendi, `DATABASE_URL` backend servisine referans olarak verildi
- [ ] `JWT_SECRET` (ve gerekirse OAuth değişkenleri) tanımlandı
- [ ] Build / Start / Pre-deploy (railway.toml veya Dashboard) doğru
- [ ] Domain üretildi, backend URL’i alındı
- [ ] Mobil/web’de `EXPO_PUBLIC_API_BASE_URL` production URL’e set edildi
- [ ] OAuth kullanılıyorsa Manus’ta redirect URI güncellendi

Sorun yaşarsanız Railway **Deploy Logs** ve **Build Logs** üzerinden hata mesajlarını kontrol edin; `DATABASE_URL` veya `JWT_SECRET` eksikse genelde orada görünür.
