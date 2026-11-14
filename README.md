# Flix Jump

Flix oyuncaklarının dikey zıplama oyunu. 20 bölüm (her 5 bölümde bir patron), sonsuz mod, 9 görsel tema, karakter ve kötü karakter kostümleri, 4 dil (TR, EN, ES, ZH).

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
