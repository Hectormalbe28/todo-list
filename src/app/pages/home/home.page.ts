import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonList, IonLabel, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonInput, IonText, IonCheckbox, IonCardHeader, IonCardContent, IonCard, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { Task } from "../../models/task.model";
import { addIcons } from 'ionicons';
import { trashOutline, addCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardSubtitle, IonCard, IonCardContent, IonCardHeader, IonCheckbox, IonText, IonInput, IonCol, IonRow, IonGrid, IonIcon, IonButton, IonLabel, IonList, IonItem, CommonModule, FormsModule, ReactiveFormsModule],
})
export class HomePage implements OnInit {

  /** Fecha actual */
  todayDate = signal(new Date().toLocaleDateString());

  /** Lista de tareas */
  tasks = signal<Task[]>([
    { id: Date.now(), name: 'Tarea 1', completed: false, editing: false }
  ]);

  /** Controlador del input de nueva tarea */
  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30)
    ]
  });

  constructor() {
    addIcons({addCircleOutline,trashOutline,checkmarkCircleOutline});
  }

  ngOnInit(): void {}

  /** Agrega una nueva tarea si la validación es correcta. */
  addTask() {
    if (this.newTaskCtrl.valid) {
      const taskName = this.newTaskCtrl.value.trim();
      if (taskName) {
        const newTask: Task = {
          id: Date.now(),
          name: taskName,
          completed: false,
          editing: false
        };
        this.tasks.update(tasks => [...tasks, newTask]);
        this.newTaskCtrl.setValue(''); // Limpia el input
      }
    }
  }

  /**
   * Elimina una tarea por su ID.
   * @param taskId ID de la tarea a eliminar.
   */
  deleteTask(taskId: number) {
    this.tasks.update(tasks => tasks.filter(task => task.id !== taskId));
  }

  /**
   * Marca una tarea como completada o incompleta.
   * @param taskId ID de la tarea a actualizar.
   */
  toggleTaskCompletion(taskId: number) {
    this.updateTask(taskId, { completed: !this.getTaskById(taskId)?.completed });
  }

  /**
   * Activa el modo edición para una tarea específica.
   * @param taskId ID de la tarea a editar.
   */
  activateEditMode(taskId: number) {
    this.tasks.update(tasks =>
      tasks.map(task => ({
        ...task,
        editing: task.id === taskId
      }))
    );
  }

  /**
   * Edita el nombre de una tarea.
   * @param taskId ID de la tarea a editar.
   * @param event Evento del input (para obtener el nuevo valor).
   */
  editTask(taskId: number, event: Event) {
    const newTaskName = (event.target as HTMLInputElement).value.trim();
    if (this.isValidTaskName(newTaskName)) {
      this.updateTask(taskId, { name: newTaskName, editing: false });
    }
  }

  /**
   * Actualiza una tarea con los cambios especificados.
   * @param taskId ID de la tarea a actualizar.
   * @param changes Cambios parciales en la tarea.
   */
  updateTask(taskId: number, changes: Partial<Task>) {
    this.tasks.update(tasks =>
      tasks.map(task => (task.id === taskId ? { ...task, ...changes } : task))
    );
  }

  /**
   * Valida si un nombre de tarea es correcto.
   * @param name Nombre de la tarea a validar.
   * @returns `true` si el nombre es válido, `false` si no.
   */
  isValidTaskName(name: string): boolean {
    return name.length >= 3 && name.length <= 30;
  }

  /**
   * Busca una tarea por su ID.
   * @param taskId ID de la tarea a buscar.
   * @returns `Task | undefined`
   */
  private getTaskById(taskId: number): Task | undefined {
    return this.tasks().find(task => task.id === taskId);
  }
}
