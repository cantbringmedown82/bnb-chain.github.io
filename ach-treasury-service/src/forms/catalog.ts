export const formsCatalog = [
  {
    id: "SF1199A",
    title: "Direct Deposit Sign-Up Form",
    pdf_url: "https://fiscal.treasury.gov/files/forms/sf1199a.pdf",
    expected_hash: "TODO_HASH",
    field_map: { accountNumber: "Account Number", routingNumber: "Routing Number" }
  },
  {
    id: "SF3881",
    title: "ACH Vendor/Miscellaneous Payment Enrollment",
    pdf_url: "https://fiscal.treasury.gov/files/forms/sf3881.pdf",
    expected_hash: "TODO_HASH",
    field_map: { vendorName: "Vendor Name", tin: "Tax ID" }
  },
  {
    id: "FMS1200",
    title: "Benefit Payment Enrollment",
    pdf_url: "https://fiscal.treasury.gov/files/forms/fms1200.pdf",
    expected_hash: "TODO_HASH",
    field_map: { beneficiaryName: "Beneficiary Name", accountType: "Account Type" }
  }
];
