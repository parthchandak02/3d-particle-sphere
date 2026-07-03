import MetricCard, { formatChange, formatPrice } from './MetricCard';

function formatTime(timestamp) {
  if (!timestamp) return 'Awaiting first sync';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}

export default function DataPanel({ metrics, status, error, lastUpdated, onRefresh }) {
  const statusLabel =
    status === 'live' ? 'Live feed connected' : status === 'connecting' ? 'Connecting' : 'Feed degraded';

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Real-time cross-origin capture</p>
          <h1>Particle Core Observatory</h1>
          <p className="lede">
            Public market and atmosphere data streams into the Spline particle sphere, reshaping motion,
            intensity, and orbit in real time.
          </p>
        </div>

        <div className="status-chip" data-status={status}>
          <span className="status-chip__dot" />
          <span>{statusLabel}</span>
        </div>
      </header>

      <section className="metrics-grid">
        <MetricCard
          label="Bitcoin"
          icon="₿"
          value={formatPrice(metrics.bitcoin.price)}
          subValue={formatChange(metrics.bitcoin.change24h)}
          tone={metrics.bitcoin.change24h >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          label="Ethereum"
          icon="Ξ"
          value={formatPrice(metrics.ethereum.price)}
          subValue={formatChange(metrics.ethereum.change24h)}
          tone={metrics.ethereum.change24h >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          label="Solana"
          icon="◎"
          value={formatPrice(metrics.solana.price)}
          subValue={formatChange(metrics.solana.change24h)}
          tone={metrics.solana.change24h >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          label="Atmosphere"
          icon="◌"
          value={`${metrics.weather.temperature.toFixed(1)}°C`}
          subValue={`Wind ${metrics.weather.windSpeed.toFixed(1)} km/h`}
          tone="neutral"
        />
        <MetricCard
          label="Market Pulse"
          icon="◉"
          value={`${Math.round(metrics.pulse * 100)}`}
          subValue={`Volatility ${Math.round(metrics.volatility * 100)}%`}
          tone="accent"
        />
        <MetricCard
          label="Capture Latency"
          icon="↯"
          value={`${metrics.latencyMs} ms`}
          subValue={`Updated ${formatTime(lastUpdated)}`}
          tone="neutral"
        />
      </section>

      <footer className="dashboard-footer">
        <p>{error ? `Last error: ${error}` : 'Streaming CORS-enabled public APIs into the 3D core.'}</p>
        <button type="button" className="refresh-button" onClick={onRefresh}>
          Refresh feed
        </button>
      </footer>
    </div>
  );
}
