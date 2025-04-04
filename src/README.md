# Ionic + Angular + Cordova

Este proyecto utiliza **Ionic, Angular, Firebase y Cordova** para desarrollar una aplicación móvil compatible con **Android e iOS**.

## 📌 Requisitos Previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

1. **Node.js** (versión recomendada: LTS) → [Descargar](https://nodejs.org/)
2. **Ionic CLI** → Instalar con:
   ```bash
   npm install -g @ionic/cli
   ```
3. **Cordova CLI** → Instalar con:
   ```bash
   npm install -g cordova
   ```
4. **Android Studio** (Para compilar en Android) → [Descargar](https://developer.android.com/studio)
5. **Xcode** (Para compilar en iOS, solo en macOS) → [Descargar](https://developer.apple.com/xcode/)

---

## 🚀 Instalación

Clona el repositorio e instala las dependencias:
```bash
git clone https://github.com/Hectormalbe28/todo-list.git
cd todo-list
npm install
```

---

## 📱 Agregar Plataformas

Asegúrate de haber instalado **Cordova** y luego agrega las plataformas necesarias:

### ▶ Para Android:
```bash
ionic cordova platform add android
```

### ▶ Para iOS (Solo en macOS):
```bash
ionic cordova platform add ios
```

---

## 🔧 Construcción y Ejecución

### ▶ **Ejecutar en un Navegador**
Para probar la app en el navegador, usa:
```bash
ionic serve
```

### ▶ **Ejecutar en un Dispositivo o Emulador**
#### 📱 Android:
```bash
ionic cordova run android --device
```
Para usar un emulador:
```bash
ionic cordova emulate android
```

#### 🍏 iOS (Solo en macOS):
```bash
ionic cordova run ios --device
```
Para usar un emulador:
```bash
ionic cordova emulate ios
```

---

## 🔥 Configuración de Firebase y Remote Config

1. **Crear un proyecto en Firebase** → [Consola Firebase](https://console.firebase.google.com/)
2. **Agregar Firebase a la app web** y copiar la configuración.
3. **Instalar Firebase y AngularFire** en el proyecto:
   ```bash
   npm install firebase @angular/fire
   ```
4. **Configurar Firebase en `main.ts`**:
   
5. **Usar Remote Config en la app**:
   ```typescript
   async function fetchRemoteConfig() {
     const remoteConfig = getRemoteConfig();
     await fetchAndActivate(remoteConfig);
     return getValue(remoteConfig, 'featureEnabled').asBoolean();
   }
   ```

---

## 📦 Construcción para Producción

Para generar la APK final para Android:
```bash
ionic cordova build android --release
```
Para compilar en iOS:
```bash
ionic cordova build ios --release
```

---

## ⚠ Problemas Comunes y Soluciones

1. **Error de permisos en Mac/Linux**:
   ```bash
   sudo chown -R $USER:$USER ~/.npm
   ```
2. **Problemas con las dependencias**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. **Error de compatibilidad con Android SDK**:
   - Abre **Android Studio** → Configura el **SDK Manager** y descarga las versiones necesarias.

Si encuentras más problemas, revisa la [documentación oficial de Ionic](https://ionicframework.com/docs) o abre un issue en el repositorio.
