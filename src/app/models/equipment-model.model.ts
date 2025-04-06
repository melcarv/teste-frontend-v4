export interface HourlyEarning {
  equipmentStateId: string;
  value: number;
}

export interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: HourlyEarning[];
} 