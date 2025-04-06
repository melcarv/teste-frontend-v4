import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../../services/equipment.service';
import { Equipment, EquipmentState, EquipmentModel, EquipmentStateHistory, EquipmentPositionHistory } from '../../models/equipment.model';
import { EquipmentHistoryComponent } from '../equipment-history/equipment-history.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, EquipmentHistoryComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: L.Map | null = null;
  private markers: L.Layer[] = [];
  selectedEquipment: Equipment | null = null;
  equipmentStates: { [key: string]: EquipmentState } = {};
  equipmentModels: { [key: string]: EquipmentModel } = {};
  selectedStateHistory: EquipmentStateHistory | null = null;
  selectedPositionHistory: EquipmentPositionHistory | null = null;

  constructor(
    private http: HttpClient,
    private equipmentService: EquipmentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (this.map) return;

    this.map = L.map('map', {
      zoomControl: false
    }).setView([-19.126536, -45.947756], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }

  private loadData(): void {
    console.log('Loading data...');
    
    this.equipmentService.getEquipments().pipe(
      switchMap(equipments => {
        console.log('Loaded equipments:', equipments);
        return this.equipmentService.getEquipmentStates().pipe(
          map(states => {
            console.log('Loaded states:', states);
            this.equipmentStates = states.reduce((acc, state) => {
              acc[state.id] = state;
              return acc;
            }, {} as { [key: string]: EquipmentState });
            return equipments;
          })
        );
      }),
      switchMap(equipments => {
        return this.equipmentService.getEquipmentModels().pipe(
          map(models => {
            console.log('Loaded models:', models);
            this.equipmentModels = models.reduce((acc, model) => {
              acc[model.id] = model;
              return acc;
            }, {} as { [key: string]: EquipmentModel });
            return equipments;
          })
        );
      }),
      catchError(error => {
        console.error('Error loading data:', error);
        return of([]);
      })
    ).subscribe(equipments => {
      console.log('All data loaded, processing equipments:', equipments);
      equipments.forEach(equipment => {
        this.equipmentService.getEquipmentPositionHistory(equipment.id).subscribe(
          positionHistory => {
            console.log('Position history for equipment', equipment.id, ':', positionHistory);
            if (positionHistory && positionHistory.positions.length > 0) {
              const latestPosition = positionHistory.positions[positionHistory.positions.length - 1];
              this.addMarker(equipment, latestPosition);
            }
          },
          error => {
            console.error('Error loading position history for equipment', equipment.id, ':', error);
          }
        );
      });
    });
  }

  private addMarker(equipment: Equipment, position: { lat: number; lon: number }): void {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }

    console.log('Adding marker for equipment:', equipment);
    console.log('Position:', position);

    const model = this.equipmentModels[equipment.equipmentModelId];
    console.log('Model:', model);

    this.equipmentService.getEquipmentStateHistory(equipment.id).subscribe(
      stateHistory => {
        if (stateHistory && stateHistory.states.length > 0) {
          const latestStateId = stateHistory.states[stateHistory.states.length - 1].equipmentStateId;
          const state = this.equipmentStates[latestStateId];
          console.log('State:', state);

          const color = state?.color || '#000000';

          const marker = L.circleMarker([position.lat, position.lon], {
            radius: 10,
            fillColor: color,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });

          const popup = L.popup({
            closeButton: false,
            offset: L.point(0, -5)
          }).setContent(`
            <div class="equipment-popup">
              <h3 class="equipment-name">${equipment.name}</h3>
              <p><strong>Modelo:</strong> ${model?.name || 'Desconhecido'}</p>
              <p><strong>Estado:</strong> ${state?.name || 'Desconhecido'}</p>
              <p><strong>Última atualização:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `);

          // Mostra o popup quando o mouse passar sobre o marcador
          marker.on('mouseover', function (e) {
            marker.bindPopup(popup).openPopup();
          });

          // Fecha o popup quando o mouse sair do marcador
          marker.on('mouseout', function (e) {
            marker.closePopup();
          });

          // Seleciona o equipamento ao clicar
          marker.on('click', () => {
            this.selectedEquipment = equipment;
            this.loadEquipmentHistory(equipment.id);
          });

          marker.addTo(this.map!);
          this.markers.push(marker);
        }
      },
      error => {
        console.error('Error loading state history for equipment', equipment.id, ':', error);
      }
    );
  }

  private loadEquipmentHistory(equipmentId: string): void {
    console.log('Loading history for equipment:', equipmentId);
    this.equipmentService.getEquipmentStateHistory(equipmentId).subscribe(
      history => {
        console.log('Loaded state history:', history);
        this.selectedStateHistory = history;
      },
      error => {
        console.error('Error loading equipment history:', error);
        this.selectedStateHistory = null;
      }
    );
  }

  closeHistory(): void {
    this.selectedEquipment = null;
    this.selectedStateHistory = null;
  }
} 