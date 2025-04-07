import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../core/services/data.services';
import { forkJoin } from 'rxjs';

interface Equipment {
  id: string;
  name: string;
  equipmentModelId: string;
  modelName?: string;
  currentState?: string;
  productivity?: number;
  earnings?: number;
}

interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: {
    equipmentStateId: string;
    value: number;
  }[];
}

interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

interface EquipmentStateHistory {
  equipmentId: string;
  states: {
    date: string;
    equipmentStateId: string;
  }[];
}

interface RawEquipment {
  id: string;
  equipmentModelId: string;
  name: string;
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

  constructor(private dataService: DataService) {}

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
            
            const operatingHours = this.calculateOperatingHours(history);
            const maintenanceHours = this.calculateMaintenanceHours(history);
            const productivity = (operatingHours / 24) * 100;
            
            const earnings = this.calculateEarnings(history, model);

            // Log para CA-0001
            if (equipment.id === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
              console.log('Resumo CA-0001:', {
                operatingHours,
                maintenanceHours,
                productivity,
                earnings
              });
            }

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

  calculateOperatingHours(history: EquipmentStateHistory): number {
    const operatingStateId = '0808344c-454b-4c36-89e8-d7687e692d57'; // ID do estado "Operando"
    let operatingHours = 0;

    // Ordena os estados por data
    const sortedStates = [...history.states].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Se não houver estados, retorna 0
    if (sortedStates.length === 0) return 0;

    // Pega o último estado registrado
    const lastStateDate = new Date(sortedStates[sortedStates.length - 1].date);
    
    // Define o período de 24 horas a partir do último estado
    const periodEnd = lastStateDate;
    const periodStart = new Date(periodEnd.getTime() - (24 * 60 * 60 * 1000));

    // Log para CA-0001
    if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
      console.log('Analisando CA-0001:', {
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString()
      });
    }

    // Filtra os estados relevantes para o período de 24 horas
    const relevantStates = sortedStates.filter(state => 
      new Date(state.date) >= periodStart && new Date(state.date) <= periodEnd
    );

    // Se não houver estados relevantes, retorna 0
    if (relevantStates.length === 0) return 0;

    // Adiciona o estado anterior ao período se existir
    const previousState = sortedStates.find(state => 
      new Date(state.date) < periodStart
    );
    if (previousState) {
      relevantStates.unshift(previousState);
    }

    // Log para CA-0001
    if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
      console.log('Estados relevantes:', relevantStates.map(state => ({
        date: new Date(state.date).toISOString(),
        isOperating: state.equipmentStateId === operatingStateId
      })));
    }

    // Calcula as horas em operação para cada período entre estados
    for (let i = 0; i < relevantStates.length - 1; i++) {
      const currentState = relevantStates[i];
      const nextState = relevantStates[i + 1];
      
      if (currentState.equipmentStateId === operatingStateId) {
        const startTime = Math.max(
          new Date(currentState.date).getTime(),
          periodStart.getTime()
        );
        const endTime = Math.min(
          new Date(nextState.date).getTime(),
          periodEnd.getTime()
        );
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        operatingHours += hours;

        // Log para CA-0001
        if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
          console.log('Período em operação:', {
            start: new Date(startTime).toISOString(),
            end: new Date(endTime).toISOString(),
            hours
          });
        }
      }
    }

    // Verifica o último estado
    const lastState = relevantStates[relevantStates.length - 1];
    if (lastState.equipmentStateId === operatingStateId) {
      const startTime = Math.max(
        new Date(lastState.date).getTime(),
        periodStart.getTime()
      );
      const endTime = periodEnd.getTime();
      const hours = (endTime - startTime) / (1000 * 60 * 60);
      operatingHours += hours;

      // Log para CA-0001
      if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
        console.log('Último período em operação:', {
          start: new Date(startTime).toISOString(),
          end: new Date(endTime).toISOString(),
          hours
        });
      }
    }

    // Log para CA-0001
    if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
      console.log('Total de horas em operação:', operatingHours);
    }

    return operatingHours;
  }

  calculateMaintenanceHours(history: EquipmentStateHistory): number {
    const maintenanceStateId = '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f'; // ID do estado "Em manutenção"
    let maintenanceHours = 0;

    // Ordena os estados por data
    const sortedStates = [...history.states].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Se não houver estados, retorna 0
    if (sortedStates.length === 0) return 0;

    // Pega o último estado registrado
    const lastStateDate = new Date(sortedStates[sortedStates.length - 1].date);
    
    // Define o período de 24 horas a partir do último estado
    const periodEnd = lastStateDate;
    const periodStart = new Date(periodEnd.getTime() - (24 * 60 * 60 * 1000));

    // Log para CA-0001
    if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
      console.log('Analisando horas em manutenção do CA-0001:', {
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString()
      });
    }

    // Filtra os estados relevantes para o período de 24 horas
    const relevantStates = sortedStates.filter(state => 
      new Date(state.date) >= periodStart && new Date(state.date) <= periodEnd
    );

    // Se não houver estados relevantes, retorna 0
    if (relevantStates.length === 0) return 0;

    // Adiciona o estado anterior ao período se existir
    const previousState = sortedStates.find(state => 
      new Date(state.date) < periodStart
    );
    if (previousState) {
      relevantStates.unshift(previousState);
    }

    // Log para CA-0001
    if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
      console.log('Estados relevantes para manutenção:', relevantStates.map(state => ({
        date: new Date(state.date).toISOString(),
        isMaintenance: state.equipmentStateId === maintenanceStateId
      })));
    }

    // Calcula as horas em manutenção para cada período entre estados
    for (let i = 0; i < relevantStates.length - 1; i++) {
      const currentState = relevantStates[i];
      const nextState = relevantStates[i + 1];
      
      if (currentState.equipmentStateId === maintenanceStateId) {
        const startTime = Math.max(
          new Date(currentState.date).getTime(),
          periodStart.getTime()
        );
        const endTime = Math.min(
          new Date(nextState.date).getTime(),
          periodEnd.getTime()
        );
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        maintenanceHours += hours;

        // Log para CA-0001
        if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
          console.log('Período em manutenção:', {
            start: new Date(startTime).toISOString(),
            end: new Date(endTime).toISOString(),
            hours
          });
        }
      }
    }

    // Verifica o último estado
    const lastState = relevantStates[relevantStates.length - 1];
    if (lastState.equipmentStateId === maintenanceStateId) {
      const startTime = Math.max(
        new Date(lastState.date).getTime(),
        periodStart.getTime()
      );
      const endTime = periodEnd.getTime();
      const hours = (endTime - startTime) / (1000 * 60 * 60);
      maintenanceHours += hours;

      // Log para CA-0001
      if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
        console.log('Último período em manutenção:', {
          start: new Date(startTime).toISOString(),
          end: new Date(endTime).toISOString(),
          hours
        });
      }
    }

    // Log para CA-0001
    if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
      console.log('Total de horas em manutenção:', maintenanceHours);
    }

    return maintenanceHours;
  }

  calculateEarnings(history: EquipmentStateHistory, model: EquipmentModel): number {
    const operatingStateId = '0808344c-454b-4c36-89e8-d7687e692d57'; // ID do estado "Operando"
    const maintenanceStateId = '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f'; // ID do estado "Em manutenção"
    
    const operatingRate = 100; // R$ 100 por hora em operação
    const maintenanceRate = -20; // -R$ 20 por hora em manutenção
    
    const operatingHours = this.calculateOperatingHours(history);
    const maintenanceHours = this.calculateMaintenanceHours(history);
    
    const earnings = (operatingHours * operatingRate) + (maintenanceHours * maintenanceRate);

    // Log para CA-0001
    if (history.equipmentId === 'a7c53eb1-4f5e-4eba-9764-ad205d0891f9') {
      console.log('Cálculo de ganhos CA-0001:', {
        operatingHours,
        maintenanceHours,
        operatingEarnings: operatingHours * operatingRate,
        maintenanceCosts: maintenanceHours * maintenanceRate,
        totalEarnings: earnings
      });
    }

    return earnings;
  }
}
