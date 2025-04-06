import { Component, OnInit, inject, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { formatDate, CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HistoryDialogComponent } from './history-dialog.component';
import { DataService } from '../../../core/services/data.services';

// Corrigir o ícone do marcador do Leaflet
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: L.Map | undefined;
  private dialog = inject(MatDialog);

  constructor(
    private dataService: DataService,
    private ngZone: NgZone
  ) {
    console.log('MapComponent constructor');
  }

  ngOnInit(): void {
    console.log('MapComponent ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('MapComponent ngAfterViewInit');
    // Aguardar o próximo ciclo de renderização
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    console.log('Initializing map...');
    try {
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map element not found');
        return;
      }

      // Destruir o mapa existente se houver
      if (this.map) {
        this.map.remove();
      }

      // Inicializar o mapa
      this.map = L.map('map', {
        center: [-19.126536, -45.947756],
        zoom: 8,
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true
      });

      // Adicionar o tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Forçar o redesenho do mapa
      setTimeout(() => {
        if (this.map) {
          console.log('Invalidating map size...');
          this.map.invalidateSize(true);
          // Carregar os dados após o mapa estar pronto
          this.loadData();
        }
      }, 100);

      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private loadData(): void {
    console.log('Loading data...');
    this.dataService.getEquipments().subscribe({
      next: (equipments) => {
        console.log('Equipments loaded:', equipments);
        this.dataService.getEquipmentPositions().subscribe({
          next: (positions) => {
            console.log('Positions loaded:', positions);
            this.dataService.getEquipmentStates().subscribe({
              next: (states) => {
                console.log('States loaded:', states);
                this.dataService.getEquipmentStateHistory().subscribe({
                  next: (stateHistory) => {
                    console.log('State history loaded:', stateHistory);
                    this.dataService.getEquipmentModels().subscribe({
                      next: (models) => {
                        console.log('Models loaded:', models);
                        this.addMarkersToMap(equipments, positions, states, stateHistory, models);
                      },
                      error: (error) => console.error('Error loading models:', error)
                    });
                  },
                  error: (error) => console.error('Error loading state history:', error)
                });
              },
              error: (error) => console.error('Error loading states:', error)
            });
          },
          error: (error) => console.error('Error loading positions:', error)
        });
      },
      error: (error) => console.error('Error loading equipments:', error)
    });
  }

  private addMarkersToMap(equipments: any[], positions: any[], states: any[], stateHistory: any[], models: any[]): void {
    console.log('Adding markers to map...');
    if (!this.map) {
      console.error('Map not initialized');
      return;
    }

    equipments.forEach((equipment: any) => {
      const positionData = positions.find(
        (p: any) => p.equipmentId === equipment.id
      )?.positions;
      const lastPosition = positionData?.[positionData.length - 1];

      const stateData = stateHistory.find(
        (s: any) => s.equipmentId === equipment.id
      )?.states;
      const lastStateId =
        stateData?.[stateData.length - 1]?.equipmentStateId;
      const state = states.find((st: any) => st.id === lastStateId);

      const model = models.find(
        (m: any) => m.id === equipment.equipmentModelId
      );

      if (this.map && lastPosition && state) {
        const marker = L.circleMarker(
          [lastPosition.lat, lastPosition.lon],
          {
            color: state.color,
            radius: 10,
          }
        ).addTo(this.map);

        marker.bindPopup(`
          <strong>${equipment.name}</strong><br/>
          Modelo: ${model?.name || 'Desconhecido'}<br/>
          Estado: ${state.name}
        `);

        marker.on('click', () => {
          this.ngZone.run(() => {
            const stateHistList = stateData.map((s: any) => {
              const stateName = states.find(
                (st: any) => st.id === s.equipmentStateId
              )?.name;
              const dateFormatted = formatDate(
                s.date,
                'dd/MM/yyyy HH:mm',
                'pt-BR'
              );
              return `${dateFormatted} - ${stateName}`;
            });

            this.dialog.open(HistoryDialogComponent, {
              data: {
                equipmentName: equipment.name,
                history: stateHistList,
              },
            });
          });
        });
      }
    });
    console.log('Markers added to map');
  }
}
