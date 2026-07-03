function formatPrice(value) {
  if (!value) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatChange(value) {
  if (!value && value !== 0) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export default function MetricCard({ label, value, subValue, tone = 'neutral', icon }) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__header">
        <span className="metric-card__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="metric-card__label">{label}</span>
      </div>
      <div className="metric-card__value">{value}</div>
      {subValue ? <div className="metric-card__subvalue">{subValue}</div> : null}
    </article>
  );
}

export { formatPrice, formatChange };
