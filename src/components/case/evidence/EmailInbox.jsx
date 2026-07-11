export function EmailInbox({ data, onRegionClick }) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: 'white' }}>Email</div>
      <p style={{ color: '#94a3b8' }}>{String((data || {}).subject ?? 'No subject')}</p>
    </div>
  )
}
