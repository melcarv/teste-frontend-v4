export const EQUIPMENT_STATES = {
  OPERATING: '0808344c-454b-4c36-89e8-d7687e692d57',
  MAINTENANCE: '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f'
} as const;

export const EQUIPMENT_RATES = {
  OPERATING: 100,
  MAINTENANCE: -20
} as const;

export const TIME_CONSTANTS = {
  HOURS_IN_DAY: 24,
  MILLISECONDS_IN_HOUR: 60 * 60 * 1000
} as const; 