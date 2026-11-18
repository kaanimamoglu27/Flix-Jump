# Flix Jump

Flix oyuncaklarının dikey zıplama oyunu. 20 bölüm (her 5 bölümde bir patron), sonsuz mod, 9 görsel tema, karakter ve kötü karakter kostümleri, 4 dil (TR, EN, ES, ZH).

## 1.3.6 (2026-11-18)
- **Sonsuz mod kilitlenmesi düzeldi:** bir sıranın tek platformu bulut (tek kullanımlık) olabiliyordu; bulut kaybolunca bir sonraki sağlam platform ~270 px yukarıda kalıyordu (zıplama ~160 px), sonsuz modda lav olmadığı için oyuncu sonsuza kadar takılıyordu. Platform üretimi artık iki sağlam platform (normal, buz, hareketli, yanıp sönen, bitiş) arasındaki farkı zıplama yüksekliğinin altında tutuyor; bulut ve cam sayılmıyor. Sonsuz modda düşük yerçekimi bölgesi bitince önceden üretilmiş geniş aralıklara ara platform ekleniyor. Bölüm modundaki aynı sorun (4, 7, 13, 19) da düzeldi.
- Duraklat → **Ana menü** ya da **Yeniden başla** ile çıkınca o turda toplanan altın ve tüyler artık kaybolmuyor (bir kez veriliyor; oyun bitmiş, devam edilmiş turlarda çift verilmiyor).
- Satın alma tamamlanamazsa "Satın alma tamamlanmadı", mağaza yüklenmemişse (fiyatlar "…") "Mağazaya ulaşılamadı" mesajı çıkıyor (4 dilde). Oyuncu ödeme ekranını kendisi kapatırsa mesaj çıkmıyor (`native-bridge.js` artık `'cancelled'` / `'unavailable'` ayırıyor).
- Yasal sayfalar oyunun dilini izliyor (`flixLegalLang`: Türkçe ise tr, değilse en).
- "Gizlilik Seçenekleri" düğmesi oyunun dilini izliyor ve dil değişince güncelleniyor (TR/EN/ES/ZH); Ayarlar'da tam genişlikte, ayrı satırda.
- 320x568 ekranda Ayarlar kartı (Geri dahil) kaydırmadan sığıyor.
- 20. bölüm bitince "Tebrikler! 20 bölümün hepsini bitirdin!" mesajı çıkıyor ve 20. bölüm yerine Sonsuz mod öneriliyor.
- Sürüm: `VERSION` ve TestFlight iş akışı varsayılanı 1.3.6.

## 1.3.5 (2026-11-17)
- **Satın alma hatası düzeldi:** ödeme ekranı açılır açılmaz kalıcı ürün (tema, kostüm, reklamsız) veriliyordu; ödemeyi kapatsan bile kalıyordu. cordova-plugin-purchase, ödeme ekranı açıkken geçici bir "virtual" işlem oluşturuyor ve `store.owned()` onu sahip olunmuş sayıyor. `native-bridge.js` artık sadece gerçek, onaylanmış ya da bitmiş işlemlere bakıyor (`realOwned`).
- Kilitli **Sonsuz mod**'a dokununca açıklama çıkıyor: nasıl açılır (5. bölümü bitir), ilerleme çubuğu (ör. 2/5), 4 adım ve sıradaki bölümü başlatan OYNA düğmesi. İkonda küçük kilit. 4 dilde.
- Onay penceresinin düğme yazısı her açılışta sıfırlanıyor.

## Dosyalar
- `index.html`: oyunun tek dosyalık, oynanabilir hali (tarayıcıda açılır).
- `src/`: kaynak. `python3 src/build.py` ile `index.html` yeniden üretilir.
  - `game.js` oyun, `levels.js` bölümler ve çeviriler, `theme*.js` çizimler ve temalar, `index.src.html` arayüz.
- `app/`: Capacitor 8 iOS paketi (`com.flixtoys.jump`), AdMob ve uygulama içi satın alma köprüleri.
- `.github/workflows/ios-testflight.yml`: bulutta derleyip TestFlight'a yükler.

## Yayın öncesi yapılacaklar
1. App Store Connect'te `com.flixtoys.jump` uygulaması ve provisioning profili.
2. Uygulama içi ürünler: `jump_tuy_100`, `jump_tuy_300`, `jump_tuy_800`, `jump_tuy_2000`, `jump_coin_5000`, `jump_themes_all`, `jump_noads`, `skin_golge`, `jump_theme_clay`, `jump_theme_cel`, `jump_theme_b32`, `jump_theme_orig`, `jump_theme_nes`, `jump_theme_gameboy`, `jump_theme_onebit`, `jump_theme_dark`.
3. AdMob kimlikleri için repo secret'ları: `JUMP_ADMOB_APP_ID`, `JUMP_ADMOB_REWARDED_ID`, `JUMP_ADMOB_INTERSTITIAL_ID`. Boş kalırsa test reklamları çıkar.
4. Diğer Flix oyunlarındaki imzalama secret'ları (bkz. iş akışı dosyası).

## Reklamlar
Ödüllü reklam: düşünce bir kez devam etme ve bölüm sonu ödülünü ikiye katlama. Geçiş reklamı: her 3 oyunda bir. "Reklamsız oyna" paketi geçiş reklamlarını kapatır.

## Lisans notu
Fizik, platform üretimi, kamera ve ses motoru Nova Hop projesinden uyarlanmıştır (ISC, © 2025-2026 Nikhil Rana), bkz. `src/LICENSE_novahop.txt`. Çizimler, karakterler, bölümler ve arayüz Flix'e aittir.
