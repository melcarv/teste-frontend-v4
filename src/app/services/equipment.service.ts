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
        this.equipments = equipments;
        return equipments;
      }),
      catchError(() => of([]))
    );
  }

  getEquipmentById(id: string): Equipment | undefined {
    return this.equipments.find(equipment => equipment.id === id);
  }

  getEquipmentStates(): Observable<EquipmentState[]> {
    return this.http.get<EquipmentState[]>('assets/data/equipmentState.json').pipe(
      map(states => states),
      catchError(() => of([]))
    );
  }

  getEquipmentModels(): Observable<EquipmentModel[]> {
    return this.http.get<EquipmentModel[]>('assets/data/equipmentModel.json').pipe(
      map(models => models),
      catchError(() => of([]))
    );
  }

  getEquipmentStateHistory(equipmentId: string): Observable<EquipmentStateHistory | null> {
    return this.http.get<EquipmentStateHistory[]>('assets/data/equipmentStateHistory.json').pipe(
      map(histories => {
        const history = histories.find(h => h.equipmentId === equipmentId);
        return history || null;
      }),
      catchError(() => of(null))
    );
  }

  getEquipmentPositionHistory(equipmentId: string): Observable<EquipmentPositionHistory | null> {
    return this.http.get<EquipmentPositionHistory[]>('assets/data/equipmentPositionHistory.json').pipe(
      map(histories => {
        const history = histories.find(h => h.equipmentId === equipmentId);
        return history || null;
      }),
      catchError(() => of(null))
    );
  }
} 