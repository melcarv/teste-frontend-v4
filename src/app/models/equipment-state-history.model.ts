export interface StateHistoryEntry {
  date: string;
  equipmentStateId: string;
}

export interface EquipmentStateHistory {
  equipmentId: string;
  states: StateHistoryEntry[];
} 