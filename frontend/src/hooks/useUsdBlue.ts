import { useState, useEffect } from 'react';
import { bluelyticsService } from '@/services/external/bluelytics.service';

export function useUsdBlue() {
  const [usdBlue, setUsdBlue] = useState(0);
  const [blueMes, setBlueMes] = useState(0);

  useEffect(() => {
    bluelyticsService
      .obtenerUltimo()
      .then((data) => setUsdBlue(data.blue.value_sell))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fecha = new Date();
    let mesAnterior = fecha.getMonth();
    let año = fecha.getFullYear();
    const dia = fecha.getDate();

    if (mesAnterior === 0) {
      mesAnterior = 12;
      año -= 1;
    }

    const mesStr = mesAnterior < 10 ? `0${mesAnterior}` : `${mesAnterior}`;
    const diaStr = dia < 10 ? `0${dia}` : `${dia}`;

    bluelyticsService
      .obtenerHistorico(`${año}-${mesStr}-${diaStr}`)
      .then((data) => setBlueMes(data.blue.value_sell))
      .catch(() => {});
  }, []);

  const porcentaje = usdBlue > 0 ? (((usdBlue - blueMes) / usdBlue) * 100).toFixed(2) : '0.00';

  return { usdBlue, blueMes, porcentaje: Number(porcentaje) };
}
