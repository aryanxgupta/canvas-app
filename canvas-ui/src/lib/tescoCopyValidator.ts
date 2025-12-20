// src/lib/tescoCopyValidator.ts

export function validateTescoCopy(text: string): string | null {
  if (!text) return null;

  const rules: { regex: RegExp; message: string }[] = [
  // -----------------------------
  // PRICE / PROMOTION REFERENCES
  // -----------------------------
  {
    regex: /£|\$|\b\d+(\.\d+)?\s?(off|save|saving|discount|deal|offer|only|now|was|from)\b/i,
    message:
      "Price, discount, or deal references are not allowed in headline or subhead.",
  },

  // -----------------------------
  // CTA / ACTION WORDS (NO CTA RULE)
  // -----------------------------
  {
    regex: /\b(shop now|buy now|order now|try now|get now|learn more|find out|discover|explore|click|tap|swipe|sign up|register)\b/i,
    message:
      "Call-to-action language is not allowed in headline or subhead.",
  },

  // -----------------------------
  // COMPETITIONS / PRIZES
  // -----------------------------
  {
    regex: /\b(win|competition|enter|chance|prize|giveaway|contest)\b/i,
    message: "Competition-related copy is not allowed.",
  },

  // -----------------------------
  // SUSTAINABILITY / GREEN CLAIMS
  // -----------------------------
  {
    regex: /\b(eco|green|sustainable|environment|planet|carbon|recyclable|organic|ethical)\b/i,
    message: "Sustainability or environmental claims are not allowed.",
  },

  // -----------------------------
  // CHARITY / DONATIONS
  // -----------------------------
  {
    regex: /\b(charity|donate|donation|foundation|non-profit|ngo|support a cause)\b/i,
    message: "Charity or donation references are not allowed.",
  },

  // -----------------------------
  // TERMS / LEGAL DISCLAIMERS
  // -----------------------------
  {
    regex: /\b(terms apply|t&c|conditions apply|see website|see details|small print)\b/i,
    message: "T&Cs or legal disclaimers are not allowed in copy.",
  },

  // -----------------------------
  // GUARANTEES / REFUNDS
  // -----------------------------
  {
    regex: /\b(money back|refund|guarantee|risk free|no risk)\b/i,
    message: "Guarantees or refund claims are not allowed.",
  },

  // -----------------------------
  // CLAIMS / PROOF / ASTERISKS
  // -----------------------------
  {
    regex: /\*|\b(proven|tested|survey|study|research|clinically|rated|award-winning|best|number one|#1)\b/i,
    message: "Claims, superlatives, asterisks, or evidence-based copy are not allowed.",
  },

  // -----------------------------
  // URGENCY / PRESSURE LANGUAGE
  // -----------------------------
  {
    regex: /\b(hurry|limited time|don’t miss|last chance|today only|ending soon|while stocks last)\b/i,
    message: "Urgency or pressure-based language is not allowed.",
  },
];


  for (const rule of rules) {
    if (rule.regex.test(text)) {
      return rule.message;
    }
  }

  return null;
}
