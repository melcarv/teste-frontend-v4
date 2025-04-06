import { Routes } from '@angular/router';
import { MapComponent } from './features/map/map.component';

export const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'map', component: MapComponent },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'equipment', loadComponent: () => import('./features/equipment/equipment.component').then(m => m.EquipmentComponent) }
];
