// src/data/scenarios/fake-upi-transfer.ts
import type { Scenario } from "@/types/cyber-quest";

export const fakeUpiTransfer: Scenario = {
  id: "fake-upi-transfer",
  title: "Fake UPI Transfer",
  icon: "📞",
  difficulty: "medium",
  xpReward: 150,
  threatLevel: 3,
  briefing: {
    narrative:
      "Your mother received a call from someone claiming to be from her bank. " +
      "They said a ₹25,000 UPI payment was accidentally sent to her account " +
      "and she must 'return' it immediately or face legal action.",
    victimContext: "Based on a real incident — elderly users are primary targets.",
  },
  evidence: [
    {
      id: "caller-screen",
      type: "call",
      label: "Incoming Call",
      data: {
        callerName: "SBI Customer Care",
        callerNumber: "+91-1800-XXX-XXXX", // spoofed
        duration: "00:02:34",
        note: "Number looks official but is NOT SBI's verified line",
      },
    },
    {
      id: "sms-proof",
      type: "sms",
      label: "SMS 'Proof'",
      data: {
        from: "AD-SBIBK",
        body: "Dear customer, UPI txn of Rs.25000 credited to A/c XX4821. Ref: UPI/4829102834. Contact 9876543210 to reverse.",
        timestamp: "10:42 AM",
      },
    },
    {
      id: "upi-request",
      type: "upi_screen",
      label: "UPI Collect Request",
      data: {
        app: "PhonePe",
        amount: 25000,
        requestFrom: "merchant@paytmqr",  // NOT a person refunding
        note: "Refund for wrong transfer",
        expiresIn: "8:00",
      },
    },
  ],
  clues: [
    {
      id: "clue-spoofed-caller",
      evidenceId: "caller-screen",
      label: "Caller ID can be spoofed — banks never ask you to 'return' money via UPI",
      region: "[data-field='callerName']",
      severity: "critical",
    },
    {
      id: "clue-collect-not-refund",
      evidenceId: "upi-request",
      label: "This is a UPI Collect request (they're TAKING money), not a refund TO you",
      region: "[data-field='requestFrom']",
      severity: "critical",
    },
    {
      id: "clue-sms-sender",
      evidenceId: "sms-proof",
      label: "AD- prefix = promotional bulk SMS, not official bank channel",
      region: "[data-field='from']",
      severity: "medium",
    },
  ],
  decisions: [
    {
      id: "pay-immediately",
      label: "Pay ₹25,000 now to avoid legal trouble",
      isCorrect: false,
      mistakeTag: "urgency_pressure",
      consequence: {
        narrative: "You sent the money. The caller disappears. Your bank confirms no erroneous credit ever existed.",
        moneyLost: 25000,
        outcome: "scammed",
        xpDelta: 10,
      },
    },
    {
      id: "verify-bank",
      label: "Hang up and call the bank's official number from your passbook/card",
      isCorrect: true,
      consequence: {
        narrative: "The bank confirms it's a scam. No money was credited. You saved ₹25,000.",
        outcome: "safe",
        xpDelta: 150,
      },
    },
    {
      id: "share-otp",
      label: "Share the OTP they sent to 'verify identity'",
      isCorrect: false,
      mistakeTag: "shared_otp",
      consequence: {
        narrative: "They drained ₹48,000 from your linked account using the OTP.",
        moneyLost: 48000,
        outcome: "scammed",
        xpDelta: 5,
      },
    },
  ],
  correctPath: {
    clueIds: ["clue-spoofed-caller", "clue-collect-not-refund"],
    decisionId: "verify-bank",
  },
  lesson: {
    title: "The Refund Scam Pattern",
    bullets: [
      "Banks never ask you to return money via UPI to 'fix' an error.",
      "UPI Collect = someone requesting money FROM you.",
      "Always verify by calling the number on your bank card, not the caller's number.",
      "Never share OTPs — they authorize real transactions.",
    ],
    realWorldTip:
      "If someone pressures you with 'legal action in 30 minutes', it's always a scam.",
  },
};