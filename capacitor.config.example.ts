import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pig.warehouse',
  appName: 'Quản Lý Kho Heo',
  webDir: 'dist',
  bundledWebRuntime: false,
  
  server: {
    // Cho phép HTTPS scheme để app hoạt động như native
    androidScheme: 'https',
    
    // Development: cho phép HTTP cleartext
    // Production: nên tắt (false) để bắt buộc HTTPS
    cleartext: true,
    
    // Nếu muốn kết nối đến dev server khi debug
    // url: 'http://192.168.1.100:5173',
    // cleartext: true
  },
  
  android: {
    buildOptions: {
      // Cấu hình keystore cho release build
      // Uncomment và điền thông tin khi build release
      // keystorePath: 'path/to/your/keystore.jks',
      // keystorePassword: 'your-keystore-password',
      // keystoreAlias: 'your-key-alias',
      // keystoreAliasPassword: 'your-alias-password',
      releaseType: 'APK' // Hoặc 'AAB' cho Play Store
    },
    
    // Override các setting trong AndroidManifest.xml
    // minSdkVersion: 22,
    // targetSdkVersion: 33
  },
  
  plugins: {
    // Splash Screen configuration
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a", // Màu nền tối (slate-900)
      showSpinner: true,
      spinnerColor: "#f59e0b", // Màu amber-500
      androidSpinnerStyle: "large",
      // splashFullScreen: true,
      // splashImmersive: true
    },
    
    // Status Bar configuration
    StatusBar: {
      style: 'dark', // 'dark' hoặc 'light'
      backgroundColor: '#0f172a',
    },
    
    // Keyboard configuration  
    Keyboard: {
      resize: 'body', // Resize body khi keyboard hiện
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;
