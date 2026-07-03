import { useCallback, useEffect, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 8000;
const INITIAL_METRICS = {
  bitcoin: { price: 0, change24h: 0 },
  ethereum: { price: 0, change24h: 0 },
  solana: { price: 0, change24h: 0 },
  weather: { temperature: 20, windSpeed: 0 },
  latencyMs: 0,
  momentum: 0,
  volatility: 0,
  pulse: 0,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeChange(change) {
  return clamp(change / 12, -1, 1);
}

async function fetchLiveMetrics() {
  const startedAt = performance.now();

  const [marketResponse, weatherResponse] = await Promise.all([
    fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
    ),
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,wind_speed_10m'
    ),
  ]);

  if (!marketResponse.ok || !weatherResponse.ok) {
    throw new Error('Live feed request failed');
  }

  const market = await marketResponse.json();
  const weather = await weatherResponse.json();
  const latencyMs = Math.round(performance.now() - startedAt);

  const bitcoin = {
    price: market.bitcoin?.usd ?? 0,
    change24h: market.bitcoin?.usd_24h_change ?? 0,
  };
  const ethereum = {
    price: market.ethereum?.usd ?? 0,
    change24h: market.ethereum?.usd_24h_change ?? 0,
  };
  const solana = {
    price: market.solana?.usd ?? 0,
    change24h: market.solana?.usd_24h_change ?? 0,
  };

  const changes = [bitcoin.change24h, ethereum.change24h, solana.change24h];
  const momentum =
    changes.reduce((sum, change) => sum + normalizeChange(change), 0) / changes.length;
  const volatility = clamp(
    changes.reduce((sum, change) => sum + Math.abs(normalizeChange(change)), 0) / changes.length,
    0,
    1
  );
  const pulse = clamp(volatility * 0.65 + (latencyMs / 400) * 0.35, 0, 1);

  return {
    bitcoin,
    ethereum,
    solana,
    weather: {
      temperature: weather.current?.temperature_2m ?? 20,
      windSpeed: weather.current?.wind_speed_10m ?? 0,
    },
    latencyMs,
    momentum,
    volatility,
    pulse,
    updatedAt: Date.now(),
  };
}

export function useLiveMetrics() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const nextMetrics = await fetchLiveMetrics();
      if (!mountedRef.current) return;

      setMetrics(nextMetrics);
      setLastUpdated(nextMetrics.updatedAt);
      setStatus('live');
      setError(null);
    } catch (fetchError) {
      if (!mountedRef.current) return;
      setStatus('degraded');
      setError(fetchError.message);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();

    const intervalId = window.setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      mountedRef.current = false;
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  return {
    metrics,
    status,
    error,
    lastUpdated,
    refresh,
  };
}
