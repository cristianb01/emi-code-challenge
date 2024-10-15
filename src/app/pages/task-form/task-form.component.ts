import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StatesService } from '../../services/states.service';
import { State } from '../../models/state.model';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskState } from '../../models/task-state.model';
import { TaskService } from '../../services/task.service';
import Swal from 'sweetalert2';
import { AlertService } from '../../services/alert.service';

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
    private taskService: TaskService,
    private alerService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.statesService.states.subscribe(states => this.states = states);
    this.statesService.getStates().catch(e => this.alerService.showError(e as string));
    try {
    }
    catch(errorMessage) {
      this.alerService.showError(errorMessage as string);
    }

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
    if (this.form.valid) {
      const mappedTask = this.mapFormToModel();

      try {
        this.taskService.add(mappedTask);
      }
      catch(error) {
        Swal.fire({
          title: 'There was a problem when processing this request'
        });
      }
    }

  }
  //#endregion
}
