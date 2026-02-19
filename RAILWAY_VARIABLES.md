# Railway'de Variables Nasıl Ayarlanır?

Yerelde `.env` ile `localhost` kullanıyorsunuz; **Railway'de bu değerler kullanılmamalı**. Railway'de her servisin **Variables** ekranından, **referans** veya **production URL** verin.

---

## Backend servisi (API)

Railway Dashboard → **Backend** (repo’dan deploy ettiğiniz servis) → **Variables**.

### 1. DATABASE_URL – mutlaka düzeltin

- **Yanlış (yerel kopyala-yapıştır):**  
  `postgresql://KULLANICI@localhost:5432/postgres`  
  → Container içinde Postgres yok; **ECONNREFUSED** olur.

- **Doğru:** Postgres’in **private** URL’ini **referans** olarak kullanın:
  1. **New Variable** veya **Add Reference**
  2. **Referenced Variable** seçin
  3. **Service:** PostgreSQL servisinizi seçin
  4. **Variable:** `DATABASE_PRIVATE_URL` (veya sadece private olan; bazen `DATABASE_URL` da private olabiliyor)
  5. **Variable name (backend’de):** `DATABASE_URL`

Sonuç: Backend’de `DATABASE_URL` = `${{Postgres.DATABASE_PRIVATE_URL}}` gibi bir referans olmalı (Postgres servis adınıza göre değişir).

### 2. EXPO_PUBLIC_API_BASE_URL (backend için zorunlu değil)

Backend sadece API sunar; bu değişken **mobil/web uygulamasında** kullanılır. Backend servisinde görmeniz gerekmez. Eğer Railway’de backend’de `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000` varsa:

- **Silebilirsiniz** (backend için kullanılmıyorsa), veya
- Mobil uygulamayı production’a bağlayacaksanız, **mobil build** sırasında (EAS Build / CI) bu değişkeni **Railway backend URL’iniz** ile set edin:  
  `EXPO_PUBLIC_API_BASE_URL=https://SIZIN-BACKEND.up.railway.app`

### 3. JWT_SECRET

Üretin ve **plain text** olarak ekleyin (referans değil):  
örn. `openssl rand -base64 32` çıktısı.

---

## Özet

| Değişken | Railway’de ne yapın? |
|----------|----------------------|
| **DATABASE_URL** | Referans: Postgres → **DATABASE_PRIVATE_URL**. Asla `localhost` yazmayın. |
| **EXPO_PUBLIC_API_BASE_URL** | Backend servisinde gerek yok. Mobil build’de `https://xxx.up.railway.app` kullanın. |
| **JWT_SECRET** | Rastgele bir string (plain text) ekleyin. |

`.env` dosyası **repo’da olmamalı** (`.gitignore`’da `.env` var). Railway sadece Dashboard’daki **Variables** değerlerini kullanır; yerel `.env` Railway’e gitmez.
