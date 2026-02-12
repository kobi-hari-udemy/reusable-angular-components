import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'page-a', pathMatch: 'full'}, 
    { path: 'page-a', loadComponent: () => import('./pages/page-a/page-a')},
    { path: 'page-b', loadComponent: () => import('./pages/page-b/page-b')},
    { path: 'page-c', loadComponent: () => import('./pages/page-c/page-c')}
];
