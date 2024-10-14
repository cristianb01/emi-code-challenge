import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './pages/task-form/task-form.component';
export const routes: Routes = [
    {
        path: 'task-list',
        component: TaskListComponent
    },
    {
        path: 'create-task',
        component: TaskFormComponent
    },
    { path: '**', redirectTo: 'task-list'}
];
