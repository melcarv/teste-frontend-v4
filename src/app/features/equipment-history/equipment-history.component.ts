import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
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
  @Output() closeHistory = new EventEmitter<void>();
  private isInitialClick = true;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isInitialClick) {
      this.isInitialClick = false;
      return;
    }

    const targetElement = event.target as HTMLElement;
    
    if (!this.elementRef.nativeElement.contains(targetElement)) {
      const isMapClick = 
        targetElement.closest('.leaflet-marker-icon') ||
        targetElement.closest('.leaflet-popup') ||
        targetElement.closest('.leaflet-control-zoom') ||
        targetElement.closest('.map');

      if (!isMapClick) {
        this.close();
      }
    }
  }

  getStateText(stateId: string): string {
    return this.equipmentStates[stateId]?.name || 'Desconhecido';
  }

  getStateColor(stateId: string): string {
    return this.equipmentStates[stateId]?.color || '#000000';
  }

  close(): void {
    this.closeHistory.emit();
  }
} 