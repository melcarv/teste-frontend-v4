import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private basePath = 'assets/data/';

  constructor(private http: HttpClient) {}

  getEquipments(): Observable<any> {
    return this.http.get(this.basePath + 'equipment.json');
  }

  getEquipmentModels(): Observable<any> {
    return this.http.get(this.basePath + 'equipmentModel.json');
  }

  getEquipmentPositions(): Observable<any> {
    return this.http.get(this.basePath + 'equipmentPositionHistory.json');
  }

  getEquipmentStates(): Observable<any> {
    return this.http.get(this.basePath + 'equipmentState.json');
  }

  getEquipmentStateHistory(): Observable<any> {
    return this.http.get(this.basePath + 'equipmentStateHistory.json');
  }
}
