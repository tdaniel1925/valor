import { NextResponse } from "next/server"

const securityTxt = `Contact: security@valorfinancial.com
Expires: 2025-12-31T23:59:59.000Z
Preferred-Languages: en
Canonical: https://yourdomain.com/.well-known/security.txt
`

export async function GET() {
  return new NextResponse(securityTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}

