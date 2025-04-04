Ionic + Angular + Cordova
Este proyecto utiliza Ionic, Angular, Firebase y Cordova para desarrollar una aplicación móvil compatible con Android e iOS.

📌 Requisitos Previos
Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

Node.js (versión recomendada: LTS) → Descargar
Ionic CLI → Instalar con:
npm install -g @ionic/cli
Cordova CLI → Instalar con:
npm install -g cordova
Android Studio (Para compilar en Android) → Descargar
Xcode (Para compilar en iOS, solo en macOS) → Descargar
🚀 Instalación
Clona el repositorio e instala las dependencias:

git clone https://github.com/Hectormalbe28/todo-list.git
cd todo-list
npm install
📱 Agregar Plataformas
Asegúrate de haber instalado Cordova y luego agrega las plataformas necesarias:

▶ Para Android:
ionic cordova platform add android
▶ Para iOS (Solo en macOS):
ionic cordova platform add ios
🔧 Construcción y Ejecución
▶ Ejecutar en un Navegador
Para probar la app en el navegador, usa:

ionic serve
▶ Ejecutar en un Dispositivo o Emulador
📱 Android:
ionic cordova run android --device
Para usar un emulador:

ionic cordova emulate android
🍏 iOS (Solo en macOS):
ionic cordova run ios --device
Para usar un emulador:

ionic cordova emulate ios
🔥 Configuración de Firebase y Remote Config
Crear un proyecto en Firebase → Consola Firebase

Agregar Firebase a la app web y copiar la configuración.

Instalar Firebase y AngularFire en el proyecto:

npm install firebase @angular/fire
Configurar Firebase en main.ts:

Usar Remote Config en la app:

async function fetchRemoteConfig() {
  const remoteConfig = getRemoteConfig();
  await fetchAndActivate(remoteConfig);
  return getValue(remoteConfig, 'featureEnabled').asBoolean();
}
📦 Construcción para Producción
Para generar la APK final para Android:

ionic cordova build android --release
Para compilar en iOS:

ionic cordova build ios --release
⚠ Problemas Comunes y Soluciones
Error de permisos en Mac/Linux:
sudo chown -R $USER:$USER ~/.npm
Problemas con las dependencias:
rm -rf node_modules package-lock.json
npm install
Error de compatibilidad con Android SDK:
Abre Android Studio → Configura el SDK Manager y descarga las versiones necesarias.
Si encuentras más problemas, revisa la documentación oficial de Ionic o abre un issue en el repositorio.
