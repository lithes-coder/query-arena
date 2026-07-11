export function WhatsAppChat({ data, onRegionClick }) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: 'white' }}>WhatsApp</div>
      <p style={{ color: '#94a3b8' }}>{String((data || {}).lastMessage ?? 'No messages')}</p>
    </div>
  )
}
