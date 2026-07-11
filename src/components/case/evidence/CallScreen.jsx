export function CallScreen({ data, onRegionClick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 32, paddingBottom: 32 }}>
      <div style={{ height: 96, width: 96, borderRadius: 9999, background: 'linear-gradient(135deg,#ff4d4d,#ff8a3d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
        📞
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>{String((data || {}).callerName ?? 'Unknown Caller')}</div>
      <p style={{ fontSize: 12, color: '#94a3b8' }}>{String((data || {}).callerNumber ?? '')}</p>
    </div>
  )
}
