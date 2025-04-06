import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Equipment, EquipmentState, EquipmentStateHistory } from '../../models/equipment.model';

@Component({
  selector: 'app-equipment-history',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './equipment-history.component.html',
  styleUrls: ['./equipment-history.component.scss']
})
export class EquipmentHistoryComponent {
  @Input() equipment: Equipment | null = null;
  @Input() equipmentStates: { [key: string]: EquipmentState } = {};
  @Input() stateHistory: EquipmentStateHistory | null = null;

  getStateText(stateId: string): string {
    return this.equipmentStates[stateId]?.name || 'Desconhecido';
  }

  getStateColor(stateId: string): string {
    return this.equipmentStates[stateId]?.color || '#000000';
  }
} 