# Manus OAuth'u Yerelde Test Etmek

## Neden yerelde çalışmıyor?

1. **Eksik env değişkenleri**  
   Backend'in Manus ile konuşabilmesi için `OAUTH_SERVER_URL`, `VITE_APP_ID` (veya `EXPO_PUBLIC_APP_ID`) gerekir. Frontend için `EXPO_PUBLIC_OAUTH_PORTAL_URL`, `EXPO_PUBLIC_APP_ID` gerekir. Bunlar Manus platformundan alınır; yerelde `.env`'e yazılmazsa OAuth akışı başlamaz veya tamamlanmaz.

2. **Redirect URI whitelist**  
   Manus OAuth, güvenlik için sadece **önceden kayıtlı** callback adreslerine yönlendirme yapar. Yerelde callback adresiniz:
   - Web: `http://localhost:3000/api/oauth/callback`
   Bu adres Manus proje/uygulama ayarlarında "Redirect URI" olarak tanımlı değilse, giriş sonrası localhost'a dönülmez.

3. **Bazı ortamlarda sadece HTTPS**  
   Manus'ta `http://localhost` desteklenmiyorsa, yerelde test için **tünel** (ngrok) kullanmanız gerekir.

---

## Nasıl test edilir?

### Yöntem 1: Manus credentials + localhost

1. Manus platformundan (dashboard / proje ayarları) alın:
   - OAuth API base URL → `OAUTH_SERVER_URL`
   - Login portal URL → `EXPO_PUBLIC_OAUTH_PORTAL_URL`
   - Uygulama ID → `EXPO_PUBLIC_APP_ID` ve `VITE_APP_ID`
2. Manus'ta "Redirect URI" listesine ekleyin:
   - `http://localhost:3000/api/oauth/callback`
   - (İsteğe bağlı) `http://localhost:8081`
3. `.env` (backend):
   ```env
   OAUTH_SERVER_URL="https://..."
   VITE_APP_ID="..."
   JWT_SECRET="gizli-bir-anahtar"
   ```
4. `.env` (frontend – aynı dosyada):
   ```env
   EXPO_PUBLIC_OAUTH_PORTAL_URL="https://..."
   EXPO_PUBLIC_OAUTH_SERVER_URL="https://..."
   EXPO_PUBLIC_APP_ID="..."
   EXPO_PUBLIC_API_BASE_URL="http://localhost:3000"
   ```
5. Backend ve frontend'i yeniden başlatıp giriş butonunu deneyin.

### Yöntem 2: ngrok ile public URL

Manus sadece HTTPS kabul ediyorsa:

1. `ngrok http 3000` çalıştırın; örnek URL: `https://abc123.ngrok-free.app`
2. Manus'ta Redirect URI: `https://abc123.ngrok-free.app/api/oauth/callback`
3. `.env`'de `EXPO_PUBLIC_API_BASE_URL="https://abc123.ngrok-free.app"` ve diğer OAuth değişkenlerini ayarlayın.
4. Backend'i yeniden başlatıp girişi bu URL üzerinden test edin.

### Yöntem 3: Dev login (OAuth olmadan yerelde test)

Manus credentials yoksa veya sadece "giriş yapmış gibi" denemek için:

1. `.env`'e ekleyin:
   ```env
   DEV_AUTH_OPEN_ID="dev-user-local"
   JWT_SECRET="gizli-bir-anahtar"
   VITE_APP_ID="dev-app"
   ```
   (Oturum cookie'si için `JWT_SECRET` ve `VITE_APP_ID` zorunludur; dev için `VITE_APP_ID=dev-app` yeterli.)
2. Backend'i development modunda çalıştırın: `npm run dev:server`
3. Tarayıcıda açın: **http://localhost:3000/api/auth/dev-login**  
   Bu sayfa oturum cookie'si set edip sizi frontend'e yönlendirir.
4. **http://localhost:8081** açın; uygulama sizi giriş yapmış kabul eder.

**Önemli:** Dev login sadece `NODE_ENV=development` iken ve `DEV_AUTH_OPEN_ID` set olduğunda çalışır. Production'da kullanmayın.
