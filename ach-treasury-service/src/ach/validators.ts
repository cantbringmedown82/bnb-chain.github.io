export function validateRouting(routing: string): boolean {
  return /^\d{9}$/.test(routing);
}

// ACH Standard Entry Class codes
const VALID_CLASS_CODES = [
  "PPD",  // Prearranged Payment and Deposit Entry
  "CCD",  // Corporate Credit or Debit Entry
  "WEB",  // Internet Initiated Entry
  "TEL",  // Telephone Initiated Entry
  "RCK",  // Re-presented Check Entry
  "ARC",  // Accounts Receivable Entry
  "BOC",  // Back Office Conversion Entry
  "POP",  // Point-of-Purchase Entry
  "POS",  // Point-of-Sale Entry
  "CTX",  // Corporate Trade Exchange
  "IAT",  // International ACH Transaction
  "ACK",  // ACH Payment Acknowledgment
  "ATX",  // ACH Payment Return/Refused Notification of Change
  "ADV",  // Automated Accounting Advice
  "DNE",  // Death Notification Entry
  "ENR",  // Automated Enrollment Entry
  "TRC",  // Truncated Entry
  "TRX",  // Truncated Entry Exchange
  "XCK",  // Destroyed Check Entry
];

export function validateClassCode(code: string): boolean {
  return VALID_CLASS_CODES.includes(code.toUpperCase());
}
