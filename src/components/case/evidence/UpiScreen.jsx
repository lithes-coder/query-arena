export function UpiScreen({ data, onRegionClick }) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: 'white' }}>UPI Screen</div>
      <p style={{ color: '#94a3b8' }}>{String((data || {}).note ?? 'UPI details')}</p>
    </div>
  )
}
