import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../core/services/data.services';
import { EquipmentCalculationsService } from '../../core/services/equipment-calculations.service';
import { forkJoin } from 'rxjs';
import { 
  Equipment, 
  EquipmentModel, 
  EquipmentState, 
  EquipmentStateHistory, 
  RawEquipment 
} from '../../core/models/equipment.model';
import { TIME_CONSTANTS } from '../../core/constants/equipment.constants';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  displayedColumns: string[] = [
    'name', 
    'modelName', 
    'currentState', 
    'productivity', 
    'earnings'
  ];

  dataSource: Equipment[] = [];
  equipmentModels: EquipmentModel[] = [];
  equipmentStates: EquipmentState[] = [];
  equipmentStateHistory: EquipmentStateHistory[] = [];

  constructor(
    private dataService: DataService,
    private calculationsService: EquipmentCalculationsService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      equipments: this.dataService.getEquipments(),
      models: this.dataService.getEquipmentModels(),
      states: this.dataService.getEquipmentStates(),
      stateHistory: this.dataService.getEquipmentStateHistory()
    }).subscribe({
      next: ({ equipments, models, states, stateHistory }) => {
        this.equipmentModels = models;
        this.equipmentStates = states;
        this.equipmentStateHistory = stateHistory;

        this.dataSource = equipments.map((equipment: RawEquipment) => {
          const model = this.equipmentModels.find(m => m.id === equipment.equipmentModelId);
          const history = this.equipmentStateHistory.find(h => h.equipmentId === equipment.id);
          
          if (model && history) {
            const lastState = history.states[history.states.length - 1];
            const currentState = this.equipmentStates.find(s => s.id === lastState.equipmentStateId);
            
            const operatingHours = this.calculationsService.calculateOperatingHours(history);
            const maintenanceHours = this.calculationsService.calculateMaintenanceHours(history);
            const productivity = (operatingHours / TIME_CONSTANTS.HOURS_IN_DAY) * 100;
            
            const earnings = this.calculationsService.calculateEarnings(history, model);

            return {
              ...equipment,
              modelName: model.name,
              currentState: currentState?.name || 'Desconhecido',
              productivity: Math.round(productivity * 100) / 100,
              earnings: Math.round(earnings * 100) / 100
            };
          }

          return {
            ...equipment,
            modelName: 'Desconhecido',
            currentState: 'Desconhecido',
            productivity: 0,
            earnings: 0
          };
        });
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
      }
    });
  }
}
