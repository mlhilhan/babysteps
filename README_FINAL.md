# BabySteps - Çocuk Gelişimi ve Ebeveyn Takip Mobil Uygulaması

**BabySteps**, ebeveynlerin çocuklarının büyüme süreçlerini, sağlık verilerini ve özel anlarını takip edebilecekleri kapsamlı bir mobil uygulamadır. Gelişim kilometre taşlarından aşı takvimlerine, beslenme günlüğünden uyku takibine kadar tüm önemli bilgileri bir yerde yönetebilirsiniz.

## Özellikler

### 1. Çocuk Profili Yönetimi
- Birden fazla çocuk profili oluşturma ve yönetme
- Profil fotoğrafı, doğum tarihi ve cinsiyet bilgileri
- Çocuk bazlı tüm verilerin organize edilmesi

### 2. Gelişim Takibi
- **Boy ve Kilo Ölçümleri:** WHO standartlarına göre büyüme eğrileri
- **Gelişim Kilometre Taşları:** Motor, dil, sosyal ve kognitif beceri takibi
- **Grafik Gösterimi:** Chart.js ile görselleştirilmiş veriler
- **Tarih Bazlı Analiz:** Zaman içinde ilerlemeyi izleyin

### 3. Aşı Takvimi
- **Bakanlık Onaylı Aşı Planı:** Türkiye resmi aşı takvimi referansı
- **Aşı Durumu Takibi:** Tamamlanan ve yaklaşan aşıları görüntüleyin
- **Hatırlatıcılar:** Yaklaşan aşılar için otomatik bildirimler
- **Aşı Geçmişi:** Tüm aşıları tarihiyle birlikte kaydedin

### 4. Beslenme Günlüğü
- **5 Beslenme Türü:** Emzirme, mama, ek gıda, atıştırmalık, su
- **Miktar Takibi:** Birim seçimi (ml, gr, oz) ile detaylı kayıt
- **Alerjen Uyarıları:** 9 yaygın alerjen seçimi ve takibi
- **Beslenme Notları:** Gözlemler ve özel durumlar

### 5. Uyku Takibi
- **Uyku Süresi:** Başlangıç ve bitiş saati ile otomatik hesaplama
- **Uyku Kalitesi:** İyi, orta, kötü olarak değerlendirme
- **Gece Uyanışları:** Gece uyanış sayısı kaydı
- **Haftalık Grafik:** Uyku düzeninin görselleştirilmesi
- **Uyku Notları:** Gözlemler ve özel durumlar

### 6. Sağlık Notları
- **Doktor Ziyaretleri:** Kontrol tarihi, doktor adı, bulgular
- **İlaç Takibi:** Kullanılan ilaçlar ve dozaj
- **Alerji Kaydı:** Bilinen alerjiler ve reaksiyonlar
- **Hastalık Takibi:** Geçirilen hastalıklar ve iyileşme süreci
- **Genel Gözlemler:** Sağlık ile ilgili diğer notlar

### 7. Anı Defteri
- **Fotoğraf/Video Yükleme:** Özel anları kaydedin
- **Tarih Bazlı Galeri:** Kronolojik sırada görüntüleyin
- **Notlar ve Açıklamalar:** Her anı için detaylı bilgi
- **Güvenli Depolama:** Bulut depolama desteği (S3)

### 8. AI Asistanı
- **Ebeveynlik Danışmanı:** Sorularınıza yapay zeka destekli cevaplar
- **Gelişim Önerileri:** Çocuğun yaşına uygun aktiviteler
- **Beslenme Tavsiyeleri:** Yaşa uygun beslenme rehberi
- **Uyku Önerileri:** Sağlıklı uyku düzeni tavsiyeleri

### 9. Raporlama
- **Aylık/Yıllık Raporlar:** Gelişim özeti
- **PDF Export:** Doktor ziyaretleri için rapor dışa aktarma
- **Vergi Raporu:** Sağlık giderleri için dokümantasyon

### 10. Bildirimler
- **Aşı Hatırlatıcıları:** Yaklaşan aşılar için uyarı
- **Gelişim Başarıları:** Yeni kilometre taşları için kutlama
- **Günlük İpuçları:** Ebeveynlik tavsiyeleri
- **Özelleştirilebilir:** Bildirim tercihlerini ayarlayın

### 11. Çoklu Dil Desteği
- **Türkçe (tr):** Tam Türkçe arayüz
- **İngilizce (en):** Tam İngilizce arayüz
- **Ayarlardan Değiştirin:** Anında dil değişimi

### 12. Premium Abonelik
- **Freemium Modeli:** Temel özellikler ücretsiz
- **Premium Özellikleri:** Sınırsız depolama, AI asistanı, detaylı raporlar
- **Esnek Fiyatlandırma:** ₺49.99/ay

## Teknoloji Stack

### Frontend
- **Expo SDK 54:** React Native mobil uygulama geliştirme
- **React Native 0.81:** Mobil UI bileşenleri
- **TypeScript 5.9:** Tip güvenliği
- **React 19:** Bileşen mimarisi
- **Expo Router 6:** Navigasyon sistemi
- **NativeWind 4:** Tailwind CSS desteği
- **TailwindCSS 3.4:** Stil yönetimi
- **React Native Reanimated 4:** Animasyonlar

### Backend
- **Node.js:** Sunucu ortamı
- **Express:** Web framework
- **tRPC:** Type-safe API
- **Drizzle ORM:** Veritabanı yönetimi
- **MySQL/TiDB:** İlişkisel veritabanı

### Harici Entegrasyonlar
- **Manus OAuth:** Kullanıcı kimlik doğrulama
- **S3 Storage:** Dosya depolama (fotoğraf, video)
- **LLM API:** AI asistanı (Yapay zeka)
- **Expo Notifications:** Push bildirimler
- **Chart.js:** Grafik gösterimi

### Kütüphaneler
- **i18next:** Çoklu dil desteği
- **React Query:** Veri yönetimi
- **AsyncStorage:** Yerel veri depolama
- **DateTimePicker:** Tarih/saat seçimi
- **ImagePicker:** Fotoğraf seçimi
- **Picker:** Dropdown seçimi

## Kurulum ve Başlangıç

### Gereksinimler
- Node.js 18+ ve pnpm
- Expo CLI
- iOS 13+ veya Android 8+

### Adımlar

1. **Proje Klonlama:**
```bash
git clone <repository-url>
cd babysteps
```

2. **Bağımlılıkları Yükleme:**
```bash
pnpm install
```

3. **Veritabanı Kurulumu:**
```bash
pnpm db:push
```

4. **Geliştirme Sunucusunu Başlatma:**
```bash
pnpm dev
```

5. **Uygulamayı Açma:**
- **Web:** http://localhost:8081
- **iOS:** `pnpm ios`
- **Android:** `pnpm android`
- **Expo Go:** QR kodu tarayıcı ile tarayın

## Kullanıcı Kılavuzu

### Başlangıç

1. **Hesap Oluşturma:** Onboarding ekranında OAuth ile giriş yapın
2. **Çocuk Profili Ekleme:** "Çocuk Ekle" butonuna tıklayın
3. **Profil Bilgileri:** Ad, doğum tarihi ve cinsiyet girin

### Günlük Kullanım

1. **Gelişim Takibi:** Boy ve kilo ölçümlerini kaydedin
2. **Beslenme Günlüğü:** Günlük beslenme bilgilerini girin
3. **Uyku Takibi:** Uyku saatlerini ve kalitesini kaydedin
4. **Sağlık Notları:** Doktor ziyaretleri ve ilaçları kaydedin
5. **Anı Defteri:** Özel anları fotoğraflarla kaydedin

### Raporlar ve Analiz

1. **Dashboard:** Ana sayfada özet bilgileri görüntüleyin
2. **Grafikler:** Gelişim ve uyku grafiklerini analiz edin
3. **Raporlar:** PDF olarak dışa aktarın
4. **AI Asistanı:** Sorularınızı sorun ve tavsiyeleri alın

### Ayarlar

1. **Dil Değişimi:** Ayarlar > Dil Seçimi
2. **Bildirimler:** Ayarlar > Bildirim Tercihleri
3. **Premium:** Ayarlar > Premium'a Yükselt
4. **Çıkış:** Ayarlar > Çıkış Yap

## Proje Yapısı

```
babysteps/
├── app/                          # Uygulama ekranları
│   ├── (tabs)/                   # Tab bar ekranları
│   │   ├── index.tsx             # Ana sayfa (Dashboard)
│   │   └── settings.tsx          # Ayarlar
│   ├── onboarding.tsx            # Giriş/Kayıt
│   ├── add-child-modal.tsx       # Çocuk ekleme
│   ├── growth-tracking.tsx       # Gelişim takibi
│   ├── vaccination-schedule.tsx  # Aşı takvimi
│   ├── nutrition-log.tsx         # Beslenme günlüğü
│   ├── sleep-tracking.tsx        # Uyku takibi
│   ├── memory-journal.tsx        # Anı defteri
│   ├── ai-assistant.tsx          # AI asistanı
│   ├── health-notes.tsx          # Sağlık notları
│   └── _layout.tsx               # Root layout
├── server/                       # Backend API
│   ├── _core/index.ts            # Sunucu başlatma
│   ├── db.ts                     # Veritabanı işlemleri
│   └── routers.ts                # tRPC routers
├── drizzle/                      # Veritabanı şeması
│   └── schema.ts                 # Tablo tanımları
├── lib/                          # Yardımcı kütüphaneler
│   ├── i18n.ts                   # i18n konfigürasyonu
│   ├── notifications.ts          # Bildirim servisi
│   ├── trpc.ts                   # tRPC client
│   └── utils.ts                  # Yardımcı fonksiyonlar
├── locales/                      # Dil dosyaları
│   ├── tr.json                   # Türkçe
│   └── en.json                   # İngilizce
├── components/                   # UI bileşenleri
│   ├── screen-container.tsx      # Ekran wrapper
│   └── ui/                       # UI bileşenleri
├── hooks/                        # Custom hooks
│   ├── use-i18n.ts              # i18n hook
│   ├── use-auth.ts              # Auth hook
│   └── use-colors.ts            # Tema hook
├── assets/                       # Statik dosyalar
│   └── images/                   # Görseller ve ikonlar
├── app.config.ts                 # Expo konfigürasyonu
├── tailwind.config.js            # Tailwind konfigürasyonu
├── theme.config.js               # Tema konfigürasyonu
└── package.json                  # Bağımlılıklar
```

## API Endpoints

Tüm API endpoint'leri tRPC üzerinden sağlanır. Başlıca router'lar:

- **children:** Çocuk profili yönetimi
- **growth:** Gelişim takibi
- **milestones:** Gelişim kilometre taşları
- **vaccinations:** Aşı takvimi
- **nutrition:** Beslenme günlüğü
- **sleep:** Uyku takibi
- **health:** Sağlık notları
- **journal:** Anı defteri
- **subscription:** Premium abonelik

## Veritabanı Şeması

### Ana Tablolar

| Tablo | Açıklama |
|-------|----------|
| `users` | Kullanıcı hesapları |
| `childProfiles` | Çocuk profilleri |
| `growthMeasurements` | Boy ve kilo ölçümleri |
| `developmentalMilestones` | Gelişim kilometre taşları |
| `vaccinationSchedule` | Aşı takvimi |
| `nutritionLog` | Beslenme günlüğü |
| `sleepLog` | Uyku takibi |
| `healthNotes` | Sağlık notları |
| `memoryJournal` | Anı defteri |
| `subscriptions` | Premium abonelikler |
| `familySharing` | Aile paylaşımı |

## Güvenlik

- **OAuth Kimlik Doğrulama:** Manus OAuth sistemi
- **Şifreli İletişim:** HTTPS/TLS
- **Veri Gizliliği:** Kişisel veriler şifreli depolanır
- **Erişim Kontrolü:** Kullanıcı bazlı veri izolasyonu
- **Bildirim Gizliliği:** Push bildirimler güvenli kanallardan gönderilir

## Performans

- **Lazy Loading:** Ekranlar ihtiyaç duyulduğunda yüklenir
- **Caching:** React Query ile API sonuçları önbelleğe alınır
- **Optimized Images:** Fotoğraflar S3'te optimize edilir
- **Efficient Queries:** Veritabanı sorguları optimize edilmiştir

## Desteklenen Platformlar

- **iOS 13+:** Apple iPhone ve iPad
- **Android 8+:** Android telefonlar ve tabletler
- **Web:** Modern tarayıcılar (Chrome, Safari, Firefox)

## Lisans

Bu proje özel kullanım için geliştirilmiştir. Tüm hakları saklıdır.

## İletişim ve Destek

Sorularınız veya önerileriniz için lütfen iletişime geçin:
- **Email:** support@babysteps.app
- **Web:** www.babysteps.app

## Sürüm Bilgisi

- **Versiyon:** 1.0.0
- **Son Güncelleme:** Şubat 2026
- **Durum:** Üretim Hazır (Production Ready)

---

**BabySteps** ile çocuğunuzun büyüme yolculuğunu takip edin ve özel anıları saklamaya başlayın! 👶💕
