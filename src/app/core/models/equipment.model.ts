export interface Equipment {
  id: string;
  name: string;
  equipmentModelId: string;
  modelName?: string;
  currentState?: string;
  productivity?: number;
  earnings?: number;
}

export interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: {
    equipmentStateId: string;
    value: number;
  }[];
}

export interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

export interface EquipmentStateHistory {
  equipmentId: string;
  states: {
    date: string;
    equipmentStateId: string;
  }[];
}

export interface RawEquipment {
  id: string;
  equipmentModelId: string;
  name: string;
} 