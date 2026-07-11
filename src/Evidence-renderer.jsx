import { CallScreen } from "@/components/case/evidence/CallScreen"
import { SmsScreen } from "@/components/case/evidence/SmsScreen"
import { UpiScreen } from "@/components/case/evidence/UpiScreen"
import { EmailInbox } from "@/components/case/evidence/EmailInbox"
import { WhatsAppChat } from "@/components/case/evidence/WhatsAppChat"
import { QrCodeView } from "@/components/case/evidence/QrCodeView"

const RENDERERS = {
  call: CallScreen,
  sms: SmsScreen,
  upi_screen: UpiScreen,
  email: EmailInbox,
  whatsapp: WhatsAppChat,
  qr: QrCodeView,
  bank_notification: SmsScreen,
}

export function EvidenceRenderer({ item, highlightedRegions, onClueFound, cluesForEvidence }) {
  const Component = RENDERERS[item.type]

  const handleRegionClick = (region) => {
    const clue = (cluesForEvidence || []).find((c) => c.region === region)
    if (clue) onClueFound?.(clue.id, region)
  }

  return (
    <div style={{ borderRadius: 12, border: '1px solid rgba(34,197,94,0.12)', background: 'rgba(15,23,42,0.6)', padding: 16 }}>
      <Component data={item.data} onRegionClick={handleRegionClick} highlightedRegions={highlightedRegions} />
    </div>
  )
}
