import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskState } from '../../models/task-state.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'emi-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  
  @Input() public task!: Task;

  @Output() deleteTask: EventEmitter<Task> = new EventEmitter();

  @Output() markAsCompleted: EventEmitter<null> = new EventEmitter();

  public latestState!: TaskState;

  public states!: string[];
  
  public form!: FormGroup;
  
  constructor(private formBuilder: FormBuilder) {
    
  }

  ngOnInit(): void {
    this.form = this.initializeForm();
    this.latestState = this.getLastState();
  }

  public getLastState(): TaskState {
    return this.task.stateHistory.reduce((latest, current) => {
      if (current.date > latest.date) {
        return current;
      }
      return latest;
    }, this.task.stateHistory[0]);
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.task.title, Validators.required],
      description: [this.task.description, Validators.required],
      dueDate: [formatDate(this.task.dueDate, 'yyyy-MM-dd', 'en'), Validators.required],
      notes: [this.task.notes],
      newNote: [null],
      stateHistory: [this.task.stateHistory],
      completed: [false]
    });
  }

  public formSubmit(): void {
    if (this.form.valid) {
      const mappedTask = this.mapFormToTask();
      //TODO call Serive and api
    }
  }

  public mapFormToTask(): Task {
    return {
      completed: this.form.controls['completed'].value!,
      description: this.form.controls['description'].value!,
      dueDate: this.form.controls['dueDate'].value!,
      notes: this.form.controls['notes'].value!,
      stateHistory: this.form.controls['stateHistory'].value!,
      title: this.form.controls['title'].value!
    }
  }

  //#region Events
  public onDeleteButtonClick(): void {
    this.deleteTask.emit(this.task);
  }

  public onMarkAsCompletedButtonClick(): void {
    this.form.controls['completed'].setValue(true);
  }

  public onAddNoteButtonClick(): void {
    const newNote = this.form.controls['newNote'].value;
    if (newNote) {
      this.form.controls['notes'].value?.push(newNote);
      this.form.controls['newNote'].setValue(null);
    }
  }

  public onSaveChangesButtonClick(): void {

  }
  //#endregion

}
