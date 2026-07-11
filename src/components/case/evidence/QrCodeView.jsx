export function QrCodeView({ data, onRegionClick }) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: 'white' }}>QR Code</div>
      <p style={{ color: '#94a3b8' }}>{String((data || {}).code ?? '—')}</p>
    </div>
  )
}
