import type { BluelyticsCurrent, BluelyticsHistorical } from '@/types/api';

const BLUELYTICS_BASE = 'https://api.bluelytics.com.ar/v2';

export const bluelyticsService = {
  async obtenerUltimo(): Promise<BluelyticsCurrent> {
    const response = await fetch(`${BLUELYTICS_BASE}/latest`);
    return response.json();
  },

  async obtenerHistorico(date: string): Promise<BluelyticsHistorical> {
    const response = await fetch(`${BLUELYTICS_BASE}/historical?day=${date}`);
    return response.json();
  },
};
