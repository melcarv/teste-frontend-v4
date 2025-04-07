import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataService } from '../../core/services/data.services';
import { forkJoin } from 'rxjs';

interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalEquipment: number = 0;
  equipmentInOperation: number = 0;
  equipmentInMaintenance: number = 0;
  equipmentStopped: number = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadEquipmentData();
  }

  private loadEquipmentData(): void {
    // Carregar todos os dados necessários de uma vez
    forkJoin({
      equipments: this.dataService.getEquipments(),
      states: this.dataService.getEquipmentStates(),
      stateHistory: this.dataService.getEquipmentStateHistory()
    }).subscribe({
      next: (data) => {
        this.totalEquipment = data.equipments.length;
        const states = new Map<string, EquipmentState>();
        
        // Mapear os estados por ID
        data.states.forEach((state: EquipmentState) => {
          states.set(state.id, state);
        });

        // Processar o histórico de estados
        const latestStates = new Map<string, string>();
        
        data.stateHistory.forEach((equipment: any) => {
          if (equipment.states && equipment.states.length > 0) {
            // Ordenar estados por data e pegar o mais recente
            const sortedStates = equipment.states.sort((a: any, b: any) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            
            const latestState = sortedStates[0];
            latestStates.set(equipment.equipmentId, latestState.equipmentStateId);
          }
        });

        // Contar equipamentos por estado
        this.equipmentInOperation = Array.from(latestStates.values())
          .filter(stateId => states.get(stateId)?.name === 'Operando').length;
        this.equipmentInMaintenance = Array.from(latestStates.values())
          .filter(stateId => states.get(stateId)?.name === 'Manutenção').length;
        this.equipmentStopped = Array.from(latestStates.values())
          .filter(stateId => states.get(stateId)?.name === 'Parado').length;
      },
      error: (error) => {
        console.error('Error loading equipment data:', error);
      }
    });
  }
} 