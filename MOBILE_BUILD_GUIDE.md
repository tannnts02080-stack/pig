# 📱 Hướng Dẫn Build APK Android cho Ứng Dụng Quản Lý Heo

## 🎯 Tổng Quan

Ứng dụng này đã được tối ưu hóa để chạy trên cả desktop và mobile. Document này hướng dẫn bạn cách build thành APK Android để cài đặt trên điện thoại.

## 🛠️ Phương Pháp Build Khuyến Nghị

Có 3 phương pháp chính để build APK từ web app:

### ⭐ Phương Pháp 1: Ionic Capacitor (Khuyến Nghị)
- **Ưu điểm**: Native performance, access native APIs, dễ maintain
- **Nhược điểm**: Cần setup môi trường Android Studio

### 📦 Phương Pháp 2: Cordova
- **Ưu điểm**: Mature, nhiều plugins
- **Nhược điểm**: Performance kém hơn Capacitor

### 🌐 Phương Pháp 3: PWA (Progressive Web App)
- **Ưu điểm**: Không cần build APK, chạy trong browser
- **Nhược điểm**: Giới hạn native features

---

## 🚀 PHƯƠNG PHÁP 1: BUILD VỚI IONIC CAPACITOR (Khuyến Nghị)

### Bước 1: Cài Đặt Dependencies

```bash
# Cài đặt Capacitor
npm install @capacitor/core @capacitor/cli

# Cài đặt Android platform
npm install @capacitor/android

# Initialize Capacitor (chỉ chạy 1 lần)
npx cap init
```

Khi được hỏi:
- **App name**: `Quản Lý Kho Heo`
- **Package ID**: `com.pig.warehouse` (hoặc domain của bạn ngược lại, vd: `com.yourcompany.pigapp`)
- **Web asset directory**: `dist`

### Bước 2: Cấu Hình Capacitor

Tạo/cập nhật file `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pig.warehouse',
  appName: 'Quản Lý Kho Heo',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true, // Cho phép HTTP trong dev (production nên tắt)
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      showSpinner: true,
      spinnerColor: "#f59e0b"
    }
  }
};

export default config;
```

### Bước 3: Build Web App

```bash
# Build production-ready web app
npm run build

# Kiểm tra folder dist đã được tạo
dir dist
```

### Bước 4: Add Android Platform

```bash
# Add Android platform (chỉ chạy 1 lần đầu)
npx cap add android

# Sync web assets sang Android project
npx cap sync android
```

### Bước 5: Cài Đặt Android Studio

1. **Download Android Studio**: https://developer.android.com/studio
2. **Cài đặt Android SDK**:
   - Mở Android Studio
   - Tools → SDK Manager
   - Cài SDK Platform 33 (Android 13) trở lên
   - Cài SDK Build-Tools
   - Cài Android SDK Command-line Tools

3. **Cài đặt Java JDK** (nếu chưa có):
   - Download JDK 11 hoặc 17: https://adoptium.net/
   - Set environment variable `JAVA_HOME`

### Bước 6: Mở Project trong Android Studio

```bash
# Mở Android project trong Android Studio
npx cap open android
```

Hoặc mở manually: `android/` folder trong Android Studio

### Bước 7: Build APK trong Android Studio

1. **Build Debug APK** (để test):
   - Menu: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - APK sẽ được tạo ở: `android/app/build/outputs/apk/debug/app-debug.apk`

2. **Build Release APK** (để deploy):
   - Menu: `Build` → `Generate Signed Bundle / APK`
   - Chọn `APK`
   - Tạo keystore mới (lần đầu) hoặc dùng keystore có sẵn
   - **LƯU Ý**: Giữ keystore cẩn thận! Mất keystore = không thể update app

**Tạo Keystore:**
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias pig-app -keyalg RSA -keysize 2048 -validity 10000
```

Lưu thông tin:
- Keystore password: [mật khẩu của bạn]
- Alias: pig-app
- Alias password: [mật khẩu alias]

### Bước 8: Cài APK lên điện thoại

**Via USB:**
```bash
# Enable USB debugging trên điện thoại
# Kết nối điện thoại qua USB
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Via File:**
- Copy file APK sang điện thoại
- Mở file APK trên điện thoại
- Cho phép "Install from unknown sources"
- Install

---

## 🔄 Update App Sau Khi Sửa Code

Mỗi khi thay đổi code:

```bash
# 1. Build lại web app
npm run build

# 2. Sync changes sang Android
npx cap sync android

# 3. Build lại APK trong Android Studio
# Hoặc run lại từ Android Studio để test
```

---

## 📦 PHƯƠNG PHÁP 2: BUILD VỚI CORDOVA

### Bước 1: Cài Đặt Cordova

```bash
# Cài Cordova CLI globally
npm install -g cordova

# Tạo Cordova project
cordova create pig-app com.pig.warehouse "Quản Lý Kho Heo"
cd pig-app
```

### Bước 2: Copy Web Assets

```bash
# Build web app trước
cd [path-to-your-project]
npm run build

# Copy dist sang Cordova www folder
xcopy /E /I dist pig-app\www
```

### Bước 3: Add Android Platform

```bash
cd pig-app
cordova platform add android
```

### Bước 4: Build APK

```bash
# Build debug APK
cordova build android

# Build release APK
cordova build android --release

# APK location: platforms/android/app/build/outputs/apk/
```

---

## 🌐 PHƯƠNG PHÁP 3: PROGRESSIVE WEB APP (PWA)

### Không Cần Build APK!

PWA chạy trực tiếp trong browser với app-like experience.

### Bước 1: Thêm PWA Support

Tạo file `public/manifest.json`:

```json
{
  "name": "Quản Lý Kho Heo",
  "short_name": "Kho Heo",
  "description": "Ứng dụng quản lý kho heo sữa tươi và cấp đông",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#f59e0b",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Bước 2: Thêm Service Worker

Tạo file `public/sw.js`:

```javascript
const CACHE_NAME = 'pig-warehouse-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/index.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### Bước 3: Register Service Worker

Thêm vào `index.html`:

```html
<head>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#f59e0b">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>

<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

### Bước 4: Install PWA trên Điện Thoại

1. Mở app trong Chrome/Safari trên điện thoại
2. Nhấn menu → "Add to Home Screen"
3. App sẽ xuất hiện như native app

---

## 🎨 Tối Ưu Hóa Cho Mobile

### Icon & Splash Screen

Tạo các icon sizes:
- 192x192px (required)
- 512x512px (required)
- 1024x1024px (Play Store)

Tool generate icons: https://icon.kitchen/

### Optimization Checklist

✅ **Đã làm:**
- [x] Responsive layout cho tất cả components
- [x] Touch-friendly buttons (min 44px)
- [x] Mobile-optimized modals (fullscreen)
- [x] Bottom navigation bar
- [x] Compact text formatting (formatVNDCompact)
- [x] Prevent zoom on input focus (font-size: 16px)
- [x] Safe area support (notch)
- [x] Touch feedback (active:scale-95)

🔧 **Nên thêm:**
- [ ] Splash screen animation
- [ ] Pull-to-refresh functionality
- [ ] Offline mode (service worker caching)
- [ ] Push notifications (optional)

---

## 🐛 Troubleshooting

### Lỗi: "SDK not found"
```bash
# Set Android SDK path
set ANDROID_HOME=C:\Users\[YourUser]\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

### Lỗi: "Gradle build failed"
- Kiểm tra Java JDK đã cài đúng version (11 hoặc 17)
- Clear gradle cache: `cd android && ./gradlew clean`

### Lỗi: "App crashes on startup"
- Kiểm tra API URLs phải dùng IP thực (không dùng localhost)
- Build lại: `npm run build && npx cap sync`

### APK quá lớn
```bash
# Enable code splitting trong vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
      }
    }
  }
}
```

---

## 📊 So Sánh Các Phương Pháp

| Feature | Capacitor | Cordova | PWA |
|---------|-----------|---------|-----|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Native Access | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Setup Difficulty | Medium | Medium | Easy |
| APK Size | ~15-20MB | ~15-20MB | 0MB |
| Offline Support | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Update Speed | Medium | Medium | Instant |

---

## 🎯 Khuyến Nghị Cho Project Này

**Cho Development/Testing:** PWA hoặc Debug APK với Capacitor

**Cho Production:** Build Release APK với Capacitor + upload lên Play Store

**Cho Internal Use:** PWA (không cần Play Store, deploy web app, access qua browser)

---

## 📱 Deploy Lên Google Play Store

### Bước 1: Tạo Developer Account
- Phí: $25 một lần
- Link: https://play.google.com/console

### Bước 2: Prepare Release APK
- Build signed release APK
- Tạo screenshots (phone, tablet)
- Viết description
- Chọn category: Business

### Bước 3: Upload
- Create new app
- Upload APK/AAB
- Fill store listing
- Submit for review (2-7 ngày)

---

## 🔒 Security Notes

1. **Không commit keystore vào Git!** Add vào `.gitignore`
2. **Lưu keystore password an toàn** (password manager)
3. **Backup keystore** (mất = không update app được)
4. **Dùng HTTPS cho API** trong production
5. **Validate input** trên backend

---

## 📞 Support

Nếu gặp vấn đề:
1. Check Android Studio Logcat
2. Check Chrome DevTools (chrome://inspect)
3. Google với error message
4. Stack Overflow

---

## ✅ Quick Start Checklist

```bash
# 1. Install dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor
npx cap init

# 3. Build web app
npm run build

# 4. Add Android platform
npx cap add android

# 5. Sync web assets
npx cap sync android

# 6. Open in Android Studio
npx cap open android

# 7. Build APK in Android Studio
# Build → Build Bundle(s) / APK(s) → Build APK(s)

# 8. Install on phone
# Copy APK to phone and install
```

---

## 🎉 Kết Luận

Ứng dụng của bạn đã sẵn sàng cho mobile! Giao diện đã được tối ưu với:
- ✅ Responsive design cho mọi màn hình
- ✅ Touch-friendly controls
- ✅ Mobile-first CSS
- ✅ Bottom navigation
- ✅ Fullscreen modals trên mobile

Giờ bạn có thể build APK và cài lên điện thoại để sử dụng như một native app!

Good luck! 🐖📱
