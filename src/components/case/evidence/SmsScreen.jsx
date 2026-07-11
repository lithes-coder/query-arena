export function SmsScreen({ data, onRegionClick }) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: 'white' }}>SMS</div>
      <p style={{ color: '#94a3b8' }}>{String((data || {}).message ?? (data || {}).text ?? 'No message')}</p>
    </div>
  )
}
