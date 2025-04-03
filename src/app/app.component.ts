import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton } from '@ionic/angular/standalone';
import { RemoteConfig, fetchAndActivate, getValue, ensureInitialized } from '@angular/fire/remote-config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private remoteConfig = inject(RemoteConfig);
  featureStatus = 'Cargando...';

  async ngOnInit() {
    try {
      await ensureInitialized(this.remoteConfig); // Asegurar inicialización
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
      await fetchAndActivate(this.remoteConfig); // Obtener datos más recientes
      this.updateFeatureFlag();
    } catch (error) {
      console.error("Error obteniendo Remote Config:", error);
      this.featureStatus = '⚠ Error al cargar';
    }
  }

  updateFeatureFlag() {
    const featureFlag = getValue(this.remoteConfig, 'featureEnabled').asString();
    this.featureStatus = featureFlag === 'true' ? '✅ Función Activa' : '❌ Función Desactivada';
  }
}
