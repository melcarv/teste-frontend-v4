import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Equipment {
  id: number;
  name: string;
  model: string;
  status: string;
}

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="equipment-container">
      <div class="header">
        <h1>Equipamentos</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Novo Equipamento
        </button>
      </div>

      <table mat-table [dataSource]="dataSource" class="equipment-table">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let element">{{element.id}}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let element">{{element.name}}</td>
        </ng-container>

        <ng-container matColumnDef="model">
          <th mat-header-cell *matHeaderCellDef>Modelo</th>
          <td mat-cell *matCellDef="let element">{{element.model}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let element">{{element.status}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .equipment-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .equipment-table {
      width: 100%;
    }
  `]
})
export class EquipmentComponent {
  displayedColumns: string[] = ['id', 'name', 'model', 'status', 'actions'];
  dataSource: Equipment[] = [];
}
