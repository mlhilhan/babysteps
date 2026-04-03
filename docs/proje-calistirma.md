# Proje çalıştırma komutları

Bu dosya BabySteps geliştirme ortamında projeyi nasıl çalıştıracağınızı özetler.

## Ön koşullar

- Node.js ve bağımlılıklar yüklü olmalı: proje kökünde `npm install`
- Yerel API kullanacaksanız **PostgreSQL** çalışır durumda ve `.env` içinde geçerli bir `DATABASE_URL` tanımlı olmalı
- Android cihazda **USB hata ayıklama** açık olmalı; bilgisayarda `adb devices` cihazı göstermeli
- Telefonda **Expo Go** yüklü olmalı (geliştirme için)

## Backend (API sunucusu)

Express + tRPC API’yi yerelde başlatmak için proje kökünden:

```powershell
cd C:\Project\babysteps
npm run dev:server
```

- Varsayılan port: `.env` içindeki `PORT` (genelde `3000`).
- Açılışta migrasyonlar çalışır; başarılı olduğunda terminalde yaklaşık olarak `[api] migrations completed` ve `[api] server listening on port ...` görünür.
- Mobil istemcinin bu API’ye bağlanması için `EXPO_PUBLIC_API_BASE_URL` ayarını kökteki `.env` dosyasında yapın; Android USB + `127.0.0.1` kullanıyorsanız gerektiğinde `adb reverse tcp:3000 tcp:3000` çalıştırın.

## Mobil uygulama — Android (Expo Go)

Projeyi kök dizinden çalıştırın:

```powershell
cd C:\Project\babysteps
npx expo start --clear --localhost --android
```

Bu komut Metro’yu temiz cache ile başlatır, `localhost` üzerinden dinler ve Android’de açmayı dener. USB ile bağlı cihazda genelde en sorunsuz yol budur.

### USB ile `localhost` kullanırken (gerekirse)

Bazı kurulumlarda Metro’ya yönlendirme için `adb reverse` gerekir:

```powershell
adb reverse tcp:8081 tcp:8081
```

Metro farklı bir portta ise (ör. `8082`), aynı portu iki tarafta eşleştirin:

```powershell
adb reverse tcp:8082 tcp:8082
npx expo start --clear --localhost --android --port 8082
```

### Aynı Wi‑Fi üzerinden (tunnel olmadan)

Telefon ve bilgisayar aynı yerel ağdaysa:

```powershell
npx expo start --clear --android
```

### `8081` dolu hatası (`EADDRINUSE`)

Önce 8081’i kullanan süreci kapatın veya Metro’yu başka portta başlatın:

```powershell
npx expo start --clear --localhost --android --port 8082
```

### Tunnel (`--tunnel`) notu

`npx expo start --tunnel` bazı ağlarda ngrok zaman aşımına düşebilir. Tunnel şart değildir; yukarıdaki `--localhost` + USB veya aynı Wi‑Fi ile `tunnel` olmadan deneyin.

## Diğer script’ler (`package.json`)

| Amaç              | Komut |
|-------------------|--------|
| Web + sunucu (tanımlı script) | `npm run dev` — projede `pnpm` ile alt komutlar çağrılır; ortamınıza göre `pnpm` kurulu olmalı |
| Sadece API sunucusu | `npm run dev:server` (ayrıntı: [Backend (API sunucusu)](#backend-api-sunucusu)) |
| Lint                | `npm run lint` |
| Typecheck           | `npm run check` |

Yerel backend adresi ve API tabanı için kökteki `.env` dosyasına bakın (`EXPO_PUBLIC_API_BASE_URL`, `PORT` vb.).
