import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <mat-grid-list cols="2" rowHeight="200px">
        <mat-grid-tile>
          <mat-card>
            <mat-card-title>Total de Equipamentos</mat-card-title>
            <mat-card-content>
              <h2>0</h2>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card>
            <mat-card-title>Equipamentos em Operação</mat-card-title>
            <mat-card-content>
              <h2>0</h2>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    mat-card {
      width: 100%;
      height: 100%;
    }
    h2 {
      font-size: 2.5em;
      margin: 0;
      text-align: center;
    }
  `]
})
export class DashboardComponent {} 