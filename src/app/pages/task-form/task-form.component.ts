import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StatesService } from '../../services/states.service';
import { State } from '../../models/state.model';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskState } from '../../models/task-state.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'emi-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit{

  public form!: FormGroup;
  states!: State[];

  constructor(
    private formBuilder: FormBuilder, 
    private statesService: StatesService,
    private taskService: TaskService
  ) {
  }

  ngOnInit(): void {
    this.statesService.states.subscribe(states => this.states = states);
    this.statesService.getStates();
    this.form = this.initializeForm();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: [new Date(), Validators.required],
      state: [null, Validators.required],
      notes: this.formBuilder.array([new FormControl(null, Validators.required)], [this.atLeastOneNoteValidator()]),
      newNote: [''],
      completed: [false]
    });
  }

  private atLeastOneNoteValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const notesArray = control.value as FormArray;
  
      if (notesArray.length === 0) {
        return { atLeastOneNote: true };
      }
  
      return null;
    };
  }

  private mapFormToModel(): Task {
    const formValue = this.form.value;

    const mappedNotes = (this.form.controls['notes'] as FormArray)
      .controls.map(c => c.value);

    const stateHistory: TaskState[] = [
      {
        date: new Date(),
        state: formValue.state
      }
    ];

    return {
      completed: formValue.completed,
      description: formValue.description,
      dueDate: formValue.dueDate,
      notes: mappedNotes,
      stateHistory: stateHistory,
      title: formValue.title
    };
  }

  public get notesFormArray() {
    return this.form.controls['notes'] as FormArray<FormControl>;
  }

  //#region Events
  public onAddNoteButtonClick(): void {
    (this.form.controls['notes'] as FormArray).push(this.formBuilder.control(''));
  }

  public onFormSubmit() {
    console.log(this.form.value)
    console.log(this.form.valid)

    if (this.form.valid) {
      const mappedTask = this.mapFormToModel();
      this.taskService.add(mappedTask);
    }

  }
  //#endregion
}
