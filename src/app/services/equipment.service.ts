import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  Equipment, 
  EquipmentState, 
  EquipmentModel, 
  EquipmentStateHistory, 
  EquipmentPositionHistory 
} from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private equipments: Equipment[] = [];

  constructor(private http: HttpClient) {}

  getEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>('assets/data/equipment.json').pipe(
      map(equipments => {
        console.log('Raw equipment data:', equipments);
        this.equipments = equipments;
        return equipments;
      }),
      catchError(error => {
        console.error('Error loading equipments:', error);
        return of([]);
      })
    );
  }

  getEquipmentById(id: string): Equipment | undefined {
    return this.equipments.find(equipment => equipment.id === id);
  }

  getEquipmentStates(): Observable<EquipmentState[]> {
    return this.http.get<EquipmentState[]>('assets/data/equipmentState.json').pipe(
      map(states => {
        console.log('Raw state data:', states);
        return states;
      }),
      catchError(error => {
        console.error('Error loading equipment states:', error);
        return of([]);
      })
    );
  }

  getEquipmentModels(): Observable<EquipmentModel[]> {
    return this.http.get<EquipmentModel[]>('assets/data/equipmentModel.json').pipe(
      map(models => {
        console.log('Raw model data:', models);
        return models;
      }),
      catchError(error => {
        console.error('Error loading equipment models:', error);
        return of([]);
      })
    );
  }

  getEquipmentStateHistory(equipmentId: string): Observable<EquipmentStateHistory | null> {
    return this.http.get<EquipmentStateHistory[]>('assets/data/equipmentStateHistory.json').pipe(
      map(histories => {
        console.log('Raw state history data:', histories);
        const history = histories.find(h => h.equipmentId === equipmentId);
        console.log('Found state history for equipment', equipmentId, ':', history);
        return history || null;
      }),
      catchError(error => {
        console.error('Error loading equipment state history:', error);
        return of(null);
      })
    );
  }

  getEquipmentPositionHistory(equipmentId: string): Observable<EquipmentPositionHistory | null> {
    return this.http.get<EquipmentPositionHistory[]>('assets/data/equipmentPositionHistory.json').pipe(
      map(histories => {
        console.log('Raw position history data:', histories);
        const history = histories.find(h => h.equipmentId === equipmentId);
        console.log('Found position history for equipment', equipmentId, ':', history);
        return history || null;
      }),
      catchError(error => {
        console.error('Error loading equipment position history:', error);
        return of(null);
      })
    );
  }
} 