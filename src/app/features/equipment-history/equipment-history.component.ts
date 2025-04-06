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
    // Ignora o primeiro clique (que é o clique que abre o histórico)
    if (this.isInitialClick) {
      this.isInitialClick = false;
      return;
    }

    const targetElement = event.target as HTMLElement;
    
    // Verifica se o clique foi fora do componente
    if (!this.elementRef.nativeElement.contains(targetElement)) {
      // Verifica se o clique não foi em elementos do mapa
      const isMapClick = 
        targetElement.closest('.leaflet-marker-icon') || // Marcadores
        targetElement.closest('.leaflet-popup') || // Popups
        targetElement.closest('.leaflet-control-zoom') || // Controles de zoom
        targetElement.closest('.map'); // O próprio mapa

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