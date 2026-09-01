# 🚀 Quick Mobile Setup - Hướng Dẫn Nhanh

## ⚡ Cách Nhanh Nhất: PWA (Không Cần Build APK)

### 1. Deploy Web App
```bash
npm run build
# Upload folder 'dist' lên server
```

### 2. Mở Trên Điện Thoại
- Vào URL của app trên Chrome (Android) hoặc Safari (iOS)
- Nhấn menu (⋮) → "Add to Home Screen"
- Done! App xuất hiện như native app

---

## 📦 Build APK với Capacitor (Native App)

### Cài Đặt Một Lần
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize
npx cap init
# App name: Quản Lý Kho Heo
# Package ID: com.pig.warehouse
# Web dir: dist

# Add Android
npx cap add android
```

### Build & Deploy (Mỗi Lần Update)
```bash
# 1. Build web
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open Android Studio
npx cap open android

# 4. Build APK
# Android Studio → Build → Build APK(s)
# File: android/app/build/outputs/apk/debug/app-debug.apk

# 5. Copy file APK sang điện thoại và install
```

---

## 🎯 Giao Diện Đã Tối Ưu

✅ **Responsive cho mobile**
- Grid layout tự động: 1 cột mobile → 2 cột tablet → 4 cột desktop
- Bottom navigation bar trên mobile
- Mobile dropdown menu
- Fullscreen modals trên mobile

✅ **Touch-friendly**
- Buttons min 44px height
- Active feedback (scale-95)
- Large touch targets

✅ **Mobile-optimized**
- Compact number formatting (1.5M thay vì 1,500,000₫)
- Truncate long text
- Prevent zoom on input
- Safe area support (notch)

---

## 📱 Kiểm Tra Responsive

### Chrome DevTools
1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Chọn device: iPhone 14 / Galaxy S22
3. Test các tính năng

### Test Trên Điện Thoại Thật
```bash
# Chạy dev server với IP local network
npm run dev -- --host

# Mở trên điện thoại: http://[YOUR_IP]:5173
# VD: http://192.168.1.100:5173
```

---

## ⚙️ Cấu Hình Backend Cho Mobile

**Nếu backend chạy localhost**, điện thoại không thể kết nối!

### Giải Pháp:
```bash
# Backend: Listen trên 0.0.0.0 thay vì localhost
# Spring Boot: application.properties
server.address=0.0.0.0
server.port=8080

# Frontend: Update API URL
# Dùng IP thay vì localhost
const API_URL = "http://192.168.1.100:8080/api"
```

---

## 🐛 Lỗi Thường Gặp

**"App không load data"**
→ Check API URL, đổi localhost thành IP

**"Cannot install APK"**
→ Enable "Install from unknown sources" trong Settings

**"Gradle build failed"**
→ Cài Java JDK 11 hoặc 17

**"SDK not found"**
→ Cài Android Studio + Android SDK

---

## 💡 Tips

1. **Dev nhanh**: Dùng PWA, không cần build APK mỗi lần sửa
2. **Production**: Build APK để performance tốt hơn
3. **Test thường xuyên**: Test trên điện thoại thật, không chỉ emulator
4. **Backup keystore**: Nếu mất keystore = không update app được!

---

## 📞 Next Steps

1. ✅ Test app trên nhiều devices
2. ✅ Thêm splash screen & icon
3. ✅ Setup offline mode (service worker)
4. ✅ Deploy backend lên server cloud
5. ✅ Upload APK lên Play Store (nếu muốn)

---

Chi tiết đầy đủ: Xem file `MOBILE_BUILD_GUIDE.md` 📖
