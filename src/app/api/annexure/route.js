import { NextResponse } from 'next/server';

export async function GET() {
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 680 >>
stream
BT
/F1 28 Tf
100 700 Td
(VARROC PLI Portal) Tj
0 -50 Td
/F1 18 Tf
(Annexure Document) Tj
0 -60 Td
/F1 12 Tf
(Dear Vendor Partner,) Tj
0 -30 Td
(We are building something amazing together!) Tj
0 -25 Td
(This PLI Portal is being developed to streamline) Tj
0 -25 Td
(our vendor management and price negotiations.) Tj
0 -40 Td
(This is a MOCK annexure document for testing.) Tj
0 -25 Td
(The real annexure with all legal terms and) Tj
0 -25 Td
(component details will replace this soon.) Tj
0 -40 Td
(Thank you for supporting us in this journey!) Tj
0 -25 Td
(Hopefully we are successful - please cheer for us!) Tj
0 -50 Td
/F1 10 Tf
(Instructions:) Tj
0 -20 Td
(1. Download this document) Tj
0 -20 Td
(2. Fill in the highlighted fields) Tj
0 -20 Td
(3. Sign and stamp with company seal) Tj
0 -20 Td
(4. Save as PDF and upload back to the portal) Tj
0 -40 Td
(With warm regards,) Tj
0 -20 Td
(Team VARROC - PLI Portal Development) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000998 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1079
%%EOF`;

  return new NextResponse(pdfContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Annexure_Vendor_Sample.pdf"'
    }
  });
}
