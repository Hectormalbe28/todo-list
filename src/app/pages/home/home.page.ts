import { Component, computed, OnInit, signal, effect, Injector, inject } from '@angular/core';

import { FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonList, IonLabel, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonInput, IonText, IonCheckbox, IonCardHeader, IonCardContent, IonCard, IonCardSubtitle, IonCardTitle, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Task, Category } from "../../models/task.model";
import { addIcons } from 'ionicons';
import { trashOutline, addCircleOutline, checkmarkCircleOutline, refreshOutline } from 'ionicons/icons';
import { ensureInitialized, fetchAndActivate, getValue, RemoteConfig } from '@angular/fire/remote-config';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardSubtitle, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonText, IonInput, IonCol, IonRow, IonGrid, IonIcon, IonButton, IonLabel, IonList, IonItem, FormsModule, ReactiveFormsModule, IonSelect, IonSelectOption],
})
export class HomePage implements OnInit {

  /** Instancia de RemoteConfig inyectada mediante Angular */
  private remoteConfig = inject(RemoteConfig);

  /** Fecha actual en formato local */
  todayDate = signal(new Date().toLocaleDateString());

  /** Lista de tareas */
  tasks = signal<Task[]>([]);

  /** Lista de categorías */
  categories = signal<Category[]>([]);

  /** Controlador para alternar entre categorías y tareas */
  categoriesToogle: boolean = false;

  /** Controlador del input de nueva tarea o categoría */
  newItemCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25)
    ]
  });

    /** Valor filtro de tareas por categoria */
  filter = signal<'all' | number>('all');

  /** Filtro de tareas por categoria */
  filterTaskByCategory = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    return tasks.filter(task => {
      if (filter === 'all') {
        return true; // Mostrar todas las tareas
      } else {
        return task.categoryId === filter; // Filtrar por categoría
      }
    }
    );
  });

  /** Feature flag para desactivar funcionalidad de categoria */
  CategoriesFeatureFlag: boolean = false;

  injector = inject(Injector);

  constructor() {
    // Agregar los íconos necesarios para la aplicación
    addIcons({addCircleOutline, refreshOutline, trashOutline, checkmarkCircleOutline});
  }

  ngOnInit(): void {
    this.initializeRemoteConfig();
    // inicializar las tareas y categorías desde el localStorage
    const storedTasks = localStorage.getItem('tasks');
    const storedCategories = localStorage.getItem('categories');
    if (storedTasks) {
      this.tasks.set(JSON.parse(storedTasks));
    }
    if (storedCategories) {
      this.categories.set(JSON.parse(storedCategories));
    }
    this.trackTask(); // Rastrear cambios en las tareas
    this.trackCategory(); // Rastrear cambios en las categorías
  }

    /**
   * Método ejecutado al inicializar el servicio.
   * Intenta obtener la configuración remota y actualizar el estado de la función.
   * Si ocurre un error, se captura y se notifica en la consola.
   */
  private async initializeRemoteConfig() {
    try {
      // Asegura que Remote Config está inicializado antes de su uso
      await ensureInitialized(this.remoteConfig);

      // Configura el intervalo mínimo de actualización en 0ms para forzar la carga más reciente
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;

      // Descarga y activa la configuración remota más reciente
      await fetchAndActivate(this.remoteConfig);

      // Actualiza el estado del feature flag basado en la configuración obtenida
      this.updateFeatureFlag();
    } catch (error) {
      console.error("Error obteniendo Remote Config:", error);
    }
  }

  /**
   * Obtiene el valor del feature flag desde la configuración remota y actualiza el estado de la función.
   * Si el flag tiene el valor "true", la función se marca como activa, en caso contrario, como desactivada.
   */
  updateFeatureFlag() {
    // Obtiene el valor del flag remoto "featureEnabled" y lo convierte a string
    const featureFlag = getValue(this.remoteConfig, 'featureEnabled').asString();

    // Actualiza el estado de la función basado en el valor del flag
    this.CategoriesFeatureFlag = featureFlag === 'true';
    // Imprime el estado actual de la función en la consola para depuración
    console.log(this.CategoriesFeatureFlag ? '✅ Función Activa' : '❌ Función Desactivada');
  }

  /** Rastrear tareas */
  trackTask() {
       // Usar effect para rastrear cambios en la lista de tareas y enviar a localStorage
       effect(() => {
        const tasks = this.tasks();
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }, {injector: this.injector});
  }

  /** Rastrear categorias */
  trackCategory() {
    // Usar effect para rastrear cambios en la lista de categorias y enviar a localStorage
    effect(() => {
      const categories = this.categories();
      localStorage.setItem('categories', JSON.stringify(categories));
    }, {injector: this.injector});
  }

  /** Agrega un nuevo item (tarea o categoría) si la validación es correcta. */
  addItem() {
    if (this.newItemCtrl.valid) {
      const itemName = this.newItemCtrl.value.trim();
      if (itemName) {
        if (this.categoriesToogle) {
          // Agregar una nueva categoría
          const newCategory: Category = {
            id: Date.now(),
            name: itemName,
            editing: false
          };
          this.categories.update(categories => [...categories, newCategory]);
        } else {
          // Agregar una nueva tarea
          const newTask: Task = {
            id: Date.now(),
            name: itemName,
            completed: false,
            editing: false
          };
          this.tasks.update(tasks => [...tasks, newTask]);
          this.currentPage.set(1);
        }
        this.newItemCtrl.setValue(''); // Limpia el campo de entrada
      }
    }
  }

  /**
   * Elimina una tarea o categoría por su ID.
   * @param id ID de la tarea o categoría a eliminar.
   */
  deleteItem(id: number) {
    if (this.categoriesToogle) {
      // Eliminar categoría
      this.categories.update(categories => categories.filter(category => category.id !== id));
      this.updateTaskCategories(id); // Eliminar tareas asociadas
    } else {
      // Eliminar tarea
      this.tasks.update(tasks => tasks.filter(task => task.id !== id));
      this.currentPage.set(1);
    }
  }

  /**
   * Marca una tarea como completada o incompleta.
   * @param taskId ID de la tarea a actualizar.
   */
  toggleTaskCompletion(taskId: number) {
    this.updateList(taskId, { completed: !this.getTaskById(taskId)?.completed });
  }

  /**
   * Activa el modo de edición para una tarea o categoría específica.
   * @param id ID de la tarea o categoría a editar.
   */
  activateEditMode(id: number) {
    if (this.categoriesToogle) {
      // Activar modo edición para categoría
      this.categories.update(categories =>
        categories.map(category => ({
          ...category,
          editing: category.id === id
        }))
      );
    } else {
      // Activar modo edición para tarea
      this.tasks.update(tasks =>
        tasks.map(task => ({
          ...task,
          editing: task.id === id
        }))
      );
    }
  }

  /**
   * Edita el nombre de un item (tarea o categoría).
   * @param id ID del item a editar.
   * @param event Evento del input (para obtener el nuevo valor).
   */
  editItem(id: number, event: Event) {
    const newName = (event.target as HTMLInputElement).value.trim();
    if (this.isValidName(newName)) {
      this.updateList(id, { name: newName, editing: false });
    }
  }

  /**
   * Actualiza una lista de tareas o categorías con los cambios especificados.
   * @param id ID del item a actualizar.
   * @param changes Cambios parciales en el item.
   */
  updateList(id: number, changes: Partial<Task>) {
    if (this.categoriesToogle) {
      // Actualizar categoría
      this.categories.update(categories =>
        categories.map(category => (category.id === id ? { ...category, ...changes } : category))
      );
      this.updateTaskCategories(id, true); // Actualizar tareas asociadas a la categoría
    } else {
      // Actualizar tarea
      this.tasks.update(tasks =>
        tasks.map(task => (task.id === id ? { ...task, ...changes } : task))
      );
    }
  }

  /** Actualiza las tareas asociadas a una categoría específica. */
  updateTaskCategories(categoryId: number, edit?: boolean) {
    this.tasks.update(tasks =>
      tasks.map(task => {
        if (task.categoryId === categoryId) {
          if (edit) {
            task.category = this.categories().find(category => category.id === categoryId);
          } else {
            task.categoryId = undefined;
            task.category = undefined;
          }
        }
        return task;
      })
    );
  }

  /**
   * Valida si un nombre de tarea o categoría es válido.
   * @param name Nombre a validar.
   * @returns `true` si el nombre es válido, `false` si no.
   */
  isValidName(name: string): boolean {
    return name.length >= 3 && name.length <= 25;
  }

  /**
   * Busca una tarea por su ID.
   * @param taskId ID de la tarea a buscar.
   * @returns `Task | undefined`
   */
  private getTaskById(taskId: number): Task | undefined {
    return this.tasks().find(task => task.id === taskId);
  }

  /** Cambia la vista entre tareas y categorías. */
  toggleCategories() {
    this.categoriesToogle = !this.categoriesToogle;
  }

  /** Asigna una categoría a una tarea existente. */
  assignCategoryToTask(task: Task, event: any) {
    const selectedCategoryId = event.detail.value; // Obtener el ID de la categoría seleccionada
    const selectedCategory = this.categories().find(cat => cat.id === selectedCategoryId);
    if (selectedCategory) {
      task.categoryId = selectedCategory.id;
      task.category = selectedCategory;
      task.editing = false; // Desactivar el modo edición
      this.tasks.update(tasks => [...tasks]); // Actualizar la lista de tareas
    }
  }

  /** Cambio de filtro por categoria */
  changeCategoryFilter(filter: 'all' | number) {
    this.filter.set(filter);
  }

  /**Paginador para tareas */
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
  // Número de tareas por página
  pageSize = 5;

  // Página actual
  currentPage = signal(1);

  get paginatedTasks(): Task[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filterTaskByCategory().slice(start, start + this.pageSize);
  }

  // Cálculo de tareas visibles
  visibleTasks = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.tasks().slice(start, end);
  });

  // Total de páginas
  totalPages = computed(() => {
    return Math.ceil(this.tasks().length / this.pageSize);
  });

  /** Cambia a la siguiente página de tareas */
  nextPage() {
    if (this.currentPage() * this.pageSize < this.filterTaskByCategory().length) {
      this.currentPage.update(current => current + 1);
    }
  }

  /** Cambia a la página anterior de tareas */
  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(current => current - 1);
    }
  }
}
