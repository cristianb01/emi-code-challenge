import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatesService } from '../../services/states.service';
import { State } from '../../models/state.model';

@Component({
  selector: 'emi-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit{

  public form: FormGroup;
  states!: State[];

  constructor(private formBuilder: FormBuilder, private statesService: StatesService) {
    this.form = this.initializeForm();
  }

  ngOnInit(): void {
    this.statesService.states.subscribe(states => this.states = states);
    this.statesService.getStates();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: [new Date(), Validators.required],
      state: [null, Validators.required],
      notes: this.formBuilder.array([]),
      newNote: [''],
      completed: [false]
    });
  }

  public get notesFormArray() {
    return this.form.controls['notes'] as FormArray;
  }

  //#region Events
  public onAddNoteButtonClick(): void {
    this.notesFormArray.controls.push(new FormControl('', Validators.required));
  }
  //#endregion
}
