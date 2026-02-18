# BabySteps - Mobil Uygulama Tasarım Planı

## Uygulama Özeti
BabySteps, ebeveynlerin çocuklarının büyüme süreçlerini, sağlık verilerini, aşı takvimini ve özel anlarını takip edebilecekleri kapsamlı mobil uygulamadır. Freemium model ile para kazandırma potansiyeli yüksektir.

## Ekran Listesi (Screen List)

1. **Onboarding Ekranı** - Uygulamaya ilk giriş, kullanıcı kaydı/girişi
2. **Ana Sayfa (Dashboard)** - Çocuk profilleri, hızlı erişim, özet bilgiler
3. **Çocuk Profili Detayı** - Seçilen çocuğun tüm bilgileri
4. **Gelişim Takibi** - Boy/kilo grafikleri, WHO persentil eğrileri
5. **Gelişim Kilometre Taşları** - Yaşa göre beklenen beceriler, kontrol listesi
6. **Aşı Takvimi** - Bakanlık onaylı aşı planı, yapılan/yapılacak aşılar
7. **Beslenme Günlüğü** - Emzirme, mama, ek gıda takibi
8. **Uyku Takibi** - Uyku süresi ve düzeni analizi
9. **Sağlık Notları** - İlaç hatırlatıcıları, doktor notları
10. **Anı Defteri (Baby Journal)** - Fotoğraf/video yükleme, tarihli günlük
11. **AI Ebeveyn Asistanı** - Soru-cevap, tavsiyeler
12. **Raporlama** - PDF export, haftalık/aylık özet
13. **Ayarlar** - Profil, abonelik, bildirimler
14. **Aile Paylaşımı** - Diğer ebeveynleri davet etme (Premium)

## Birincil İçerik ve İşlevsellik (Primary Content and Functionality)

### 1. Onboarding Ekranı
- **İçerik:** Hoş geldiniz mesajı, uygulama özellikleri, kayıt/giriş formu
- **İşlevsellik:** OAuth ile giriş, e-posta/şifre kaydı, profil oluşturma

### 2. Ana Sayfa (Dashboard)
- **İçerik:** 
  - Çocuk profilleri (kart şeklinde)
  - Hızlı erişim butonları (Gelişim, Aşı, Anı Defteri)
  - Günün tavsiyesi / AI önerisi
  - Yaklaşan etkinlikler (aşı, muayene)
- **İşlevsellik:** Çocuk profili seçme, yeni çocuk ekleme, hızlı navigasyon

### 3. Çocuk Profili Detayı
- **İçerik:**
  - Çocuk bilgileri (ad, doğum tarihi, cinsiyet, fotoğraf)
  - Mevcut boy/kilo
  - Son gelişim güncellemesi
  - Yaklaşan aşılar
  - Hızlı eylem butonları
- **İşlevsellik:** Profil düzenleme, veri güncelleme, silme

### 4. Gelişim Takibi
- **İçerik:**
  - Boy/kilo grafikleri (WHO standartlarına göre)
  - Persentil eğrileri (3., 10., 25., 50., 75., 90., 97.)
  - Tarihsel veriler (tablo formatında)
  - Büyüme hızı analizi
- **İşlevsellik:** Yeni ölçüm ekleme, grafik görüntüleme, PDF export

### 5. Gelişim Kilometre Taşları
- **İçerik:**
  - Yaşa göre beklenen beceriler (motor, dil, sosyal)
  - Kontrol listesi (tamamlandı/tamamlanmadı)
  - Açıklama ve ipuçları
  - Fotoğraf/video yükleme
- **İşlevsellik:** Beceri işaretleme, notlar ekleme, anı kaydetme

### 6. Aşı Takvimi
- **İçerik:**
  - Bakanlık onaylı aşı planı (yaşa göre)
  - Yapılan aşılar (tarih, doktor notu)
  - Yaklaşan aşılar (bildirim)
  - Aşı yan etkileri bilgisi
- **İşlevsellik:** Aşı işaretleme, hatırlatıcı ayarlama, doktor notu ekleme

### 7. Beslenme Günlüğü
- **İçerik:**
  - Emzirme takibi (saat, süre)
  - Mama/ek gıda kaydı (tür, miktar, saat)
  - Alerji notları
  - Su tüketimi
  - Beslenme analizi
- **İşlevsellik:** Günlük giriş, hızlı ekleme, istatistik görüntüleme

### 8. Uyku Takibi
- **İçerik:**
  - Uyku süresi kaydı
  - Uyku düzeni grafikleri
  - Uyku kalitesi notu
  - Uyku ortalaması
- **İşlevsellik:** Uyku saati girişi, grafik analiz, tavsiye

### 9. Sağlık Notları
- **İçerik:**
  - İlaç hatırlatıcıları (ad, doz, saat)
  - Doktor kontrol notları
  - Hastalık geçmişi
  - Alerjiler ve uyarılar
- **İşlevsellik:** İlaç ekleme, bildirim ayarlama, notlar yazma

### 10. Anı Defteri (Baby Journal)
- **İçerik:**
  - Tarihli fotoğraf/video galeri
  - Anı yazıları
  - Etiketler (ilk adım, ilk kelime, vb.)
  - Zaman çizelgesi görünümü
- **İşlevsellik:** Fotoğraf yükleme (S3), not yazma, paylaşım

### 11. AI Ebeveyn Asistanı
- **İçerik:**
  - Soru giriş alanı
  - AI yanıtları
  - Sık sorulan sorular
  - Öneriler (gelişim verilerine dayalı)
- **İşlevsellik:** LLM API entegrasyonu, soru-cevap, öneriler

### 12. Raporlama
- **İçerik:**
  - Haftalık/aylık özet rapor
  - Gelişim analizi
  - Beslenme özeti
  - Sağlık notları özeti
  - PDF export
- **İşlevsellik:** Rapor oluşturma, PDF indirme, e-posta gönderme

### 13. Ayarlar
- **İçerik:**
  - Profil bilgileri
  - Abonelik durumu
  - Bildirim ayarları
  - Dil/tema seçimi
  - Gizlilik politikası
- **İşlevsellik:** Profil düzenleme, abonelik yönetimi, ayarlar

### 14. Aile Paylaşımı (Premium)
- **İçerik:**
  - Aile üyeleri listesi
  - Davet kodu
  - Paylaşım izinleri
  - Üye yönetimi
- **İşlevsellik:** Üye davet, izin yönetimi, veri senkronizasyonu

## Temel Kullanıcı Akışları (Key User Flows)

### Akış 1: Yeni Ebeveyn Kaydı ve İlk Çocuk Ekleme
1. Uygulama açılır → Onboarding ekranı
2. "Kaydol" butonuna tıkla → Kayıt formu
3. E-posta ve şifre gir → Hesap oluştur
4. Profil bilgilerini doldur → Devam et
5. İlk çocuk bilgilerini gir (ad, doğum tarihi, cinsiyet)
6. Fotoğraf yükle → Ana sayfaya git
7. Ana sayfa: Çocuk kartı görüntülenir

### Akış 2: Gelişim Verisi Ekleme ve Takip Etme
1. Ana sayfadan çocuk kartına tıkla
2. "Gelişim Takibi" seçeneğine tıkla
3. "Yeni Ölçüm Ekle" butonuna tıkla
4. Boy ve kilo gir, tarih seç → Kaydet
5. Grafik otomatik güncellenir
6. WHO persentil eğrisi görüntülenir
7. "PDF İndir" butonuyla rapor indir

### Akış 3: Aşı Takvimi Takibi
1. Çocuk profili detayından "Aşı Takvimi" seçeneğine tıkla
2. Bakanlık onaylı aşı planı görüntülenir
3. Yapılan aşıya tıkla → "Tamamlandı" işaretle
4. Doktor notu ekle → Kaydet
5. Bildirim ayarla (hatırlatıcı)
6. Yaklaşan aşılar listelenir

### Akış 4: Anı Kaydetme (Baby Journal)
1. Ana sayfadan "Anı Defteri" seçeneğine tıkla
2. "Fotoğraf Ekle" butonuna tıkla
3. Galeri veya kamera seç → Fotoğraf seç
4. Başlık ve açıklama yaz
5. Etiket seç (ilk adım, ilk gülüş, vb.)
6. Kaydet → Zaman çizelgesinde görüntülenir

### Akış 5: AI Asistanından Tavsiye Alma
1. Ana sayfadan "AI Asistanı" seçeneğine tıkla
2. Soru gir (örn: "Bebeğim 3 ayda neler yapabilmeli?")
3. AI yanıtı görüntülenir
4. Yanıtı kaydet veya paylaş
5. Sık sorulan sorulardan seçim yapabilir

### Akış 6: Aylık Rapor Oluşturma
1. "Raporlama" seçeneğine tıkla
2. Ay ve yıl seç
3. "Rapor Oluştur" butonuna tıkla
4. Özet rapor görüntülenir (gelişim, beslenme, sağlık)
5. "PDF İndir" veya "E-posta Gönder" seçeneğini seç

## Renk Seçimleri (Color Choices)

BabySteps uygulaması için ılık, güvenilir ve ebeveynler için rahatlatıcı bir renk paleti seçilmiştir:

| Renk | Hex Kodu | Kullanım |
|------|----------|----------|
| **Ana Renk (Teal)** | `#0A9B8E` | Butonlar, başlıklar, vurgular |
| **Arka Plan (Açık Krem)** | `#FFFBF5` | Sayfa arka planı |
| **Yüzey (Beyaz)** | `#FFFFFF` | Kartlar, yükseltilmiş alanlar |
| **Metin (Koyu Gri)** | `#2C3E50` | Başlıklar, ana metin |
| **İkincil Metin (Açık Gri)** | `#7F8C8D` | Alt başlıklar, açıklamalar |
| **Başarı (Yeşil)** | `#27AE60` | Tamamlanan görevler, başarı mesajları |
| **Uyarı (Turuncu)** | `#E67E22` | Yaklaşan etkinlikler, hatırlatıcılar |
| **Hata (Kırmızı)** | `#E74C3C` | Hata mesajları, silme işlemleri |
| **Bilgi (Mavi)** | `#3498DB` | Bilgi mesajları, ipuçları |

## Tasarım İlkeleri

1. **Ebeveyn Odaklı:** Tasarım, meşgul ebeveynlerin hızlı ve kolay kullanabilmesi için optimize edilmiştir.
2. **Güvenilirlik:** Çocuk sağlığı verilerine güvenli erişim ve şifreleme.
3. **Erişilebilirlik:** Büyük yazı tipi, yüksek kontrast, kolay navigasyon.
4. **Oyunlaştırma:** Başarı rozetleri, ilerleme göstergesi, motivasyon mesajları.
5. **Kişiselleştirme:** Her çocuk için özel profil ve takip.

## Teknik Notlar

- **Uygulamada Kullanılan Teknolojiler:** Expo + React Native + TypeScript + Drizzle + MySQL
- **Depolama:** S3 (fotoğraf/video), AsyncStorage (yerel veri)
- **API:** RESTful API, LLM entegrasyonu
- **Bildirimler:** Expo Notifications
- **Para Kazanma:** Freemium model (Premium: AI asistan, sınırsız depolama, PDF raporlama)
