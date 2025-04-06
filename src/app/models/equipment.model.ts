export interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
}

export interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

export interface EquipmentPosition {
  equipmentId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface EquipmentStateHistory {
  equipmentId: string;
  states: {
    date: string;
    equipmentStateId: string;
  }[];
}

export interface EquipmentPositionHistory {
  equipmentId: string;
  positions: {
    date: string;
    lat: number;
    lon: number;
  }[];
}

export interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: {
    equipmentStateId: string;
    value: number;
  }[];
} 