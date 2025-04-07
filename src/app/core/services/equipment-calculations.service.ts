import { Injectable } from '@angular/core';
import { EquipmentStateHistory, EquipmentModel } from '../models/equipment.model';
import { EQUIPMENT_STATES, EQUIPMENT_RATES, TIME_CONSTANTS } from '../constants/equipment.constants';

@Injectable({
  providedIn: 'root'
})
export class EquipmentCalculationsService {
  calculateOperatingHours(history: EquipmentStateHistory): number {
    let operatingHours = 0;
    const sortedStates = [...history.states].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedStates.length === 0) return 0;

    const lastStateDate = new Date(sortedStates[sortedStates.length - 1].date);
    const periodEnd = lastStateDate;
    const periodStart = new Date(periodEnd.getTime() - (TIME_CONSTANTS.HOURS_IN_DAY * TIME_CONSTANTS.MILLISECONDS_IN_HOUR));

    const relevantStates = this.getRelevantStates(sortedStates, periodStart, periodEnd);
    if (relevantStates.length === 0) return 0;

    operatingHours = this.calculateStateHours(
      relevantStates,
      EQUIPMENT_STATES.OPERATING,
      periodStart,
      periodEnd
    );

    return operatingHours;
  }

  calculateMaintenanceHours(history: EquipmentStateHistory): number {
    let maintenanceHours = 0;
    const sortedStates = [...history.states].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedStates.length === 0) return 0;

    const lastStateDate = new Date(sortedStates[sortedStates.length - 1].date);
    const periodEnd = lastStateDate;
    const periodStart = new Date(periodEnd.getTime() - (TIME_CONSTANTS.HOURS_IN_DAY * TIME_CONSTANTS.MILLISECONDS_IN_HOUR));

    const relevantStates = this.getRelevantStates(sortedStates, periodStart, periodEnd);
    if (relevantStates.length === 0) return 0;

    maintenanceHours = this.calculateStateHours(
      relevantStates,
      EQUIPMENT_STATES.MAINTENANCE,
      periodStart,
      periodEnd
    );

    return maintenanceHours;
  }

  calculateEarnings(history: EquipmentStateHistory, model: EquipmentModel): number {
    const operatingHours = this.calculateOperatingHours(history);
    const maintenanceHours = this.calculateMaintenanceHours(history);
    
    return (operatingHours * EQUIPMENT_RATES.OPERATING) + 
           (maintenanceHours * EQUIPMENT_RATES.MAINTENANCE);
  }

  private getRelevantStates(
    sortedStates: { date: string; equipmentStateId: string; }[],
    periodStart: Date,
    periodEnd: Date
  ) {
    const relevantStates = sortedStates.filter(state => 
      new Date(state.date) >= periodStart && new Date(state.date) <= periodEnd
    );

    const previousState = sortedStates.find(state => 
      new Date(state.date) < periodStart
    );
    
    if (previousState) {
      relevantStates.unshift(previousState);
    }

    return relevantStates;
  }

  private calculateStateHours(
    relevantStates: { date: string; equipmentStateId: string; }[],
    targetStateId: string,
    periodStart: Date,
    periodEnd: Date
  ): number {
    let totalHours = 0;

    for (let i = 0; i < relevantStates.length - 1; i++) {
      const currentState = relevantStates[i];
      const nextState = relevantStates[i + 1];
      
      if (currentState.equipmentStateId === targetStateId) {
        const startTime = Math.max(
          new Date(currentState.date).getTime(),
          periodStart.getTime()
        );
        const endTime = Math.min(
          new Date(nextState.date).getTime(),
          periodEnd.getTime()
        );
        const hours = (endTime - startTime) / TIME_CONSTANTS.MILLISECONDS_IN_HOUR;
        totalHours += hours;
      }
    }

    const lastState = relevantStates[relevantStates.length - 1];
    if (lastState.equipmentStateId === targetStateId) {
      const startTime = Math.max(
        new Date(lastState.date).getTime(),
        periodStart.getTime()
      );
      const endTime = periodEnd.getTime();
      const hours = (endTime - startTime) / TIME_CONSTANTS.MILLISECONDS_IN_HOUR;
      totalHours += hours;
    }

    return totalHours;
  }
} 