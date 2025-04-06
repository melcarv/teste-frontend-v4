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
    }).setView([-19.126536, -45.947756], 10);
    
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
    this.equipmentService.getEquipments().pipe(
      switchMap(equipments => {
        return this.equipmentService.getEquipmentStates().pipe(
          map(states => {
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
            this.equipmentModels = models.reduce((acc, model) => {
              acc[model.id] = model;
              return acc;
            }, {} as { [key: string]: EquipmentModel });
            return equipments;
          })
        );
      }),
      catchError(error => {
        return of([]);
      })
    ).subscribe(equipments => {
      equipments.forEach(equipment => {
        this.equipmentService.getEquipmentPositionHistory(equipment.id).subscribe(
          positionHistory => {
            if (positionHistory && positionHistory.positions.length > 0) {
              const latestPosition = positionHistory.positions[positionHistory.positions.length - 1];
              this.addMarker(equipment, latestPosition);
            }
          }
        );
      });
    });
  }

  private addMarker(equipment: Equipment, position: { lat: number; lon: number }): void {
    if (!this.map) return;

    const model = this.equipmentModels[equipment.equipmentModelId];

    this.equipmentService.getEquipmentStateHistory(equipment.id).subscribe(
      stateHistory => {
        if (stateHistory && stateHistory.states.length > 0) {
          const latestStateId = stateHistory.states[stateHistory.states.length - 1].equipmentStateId;
          const state = this.equipmentStates[latestStateId];
          const color = state?.color || '#000000';

          const marker = L.circleMarker([position.lat, position.lon], {
            radius: 10,
            fillColor: color,
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
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

          marker.on('mouseover', function (e) {
            marker.bindPopup(popup).openPopup();
          });

          marker.on('mouseout', function (e) {
            marker.closePopup();
          });

          marker.on('click', () => {
            this.selectedEquipment = equipment;
            this.loadEquipmentHistory(equipment.id);
          });

          marker.addTo(this.map!);
          this.markers.push(marker);
        }
      }
    );
  }

  private loadEquipmentHistory(equipmentId: string): void {
    this.equipmentService.getEquipmentStateHistory(equipmentId).subscribe(
      history => {
        this.selectedStateHistory = history;
      },
      error => {
        this.selectedStateHistory = null;
      }
    );
  }

  closeHistory(): void {
    this.selectedEquipment = null;
    this.selectedStateHistory = null;
  }
} 