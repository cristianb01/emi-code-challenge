import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
export const routes: Routes = [
    {
        path: 'tasks',
        component: TaskListComponent
    },
    { path: '**', redirectTo: 'tasks'}
];
