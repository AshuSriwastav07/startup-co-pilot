import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Startup Co-Pilot',
  description: 'Created by Ashu Ashub Sriwasta',
  generator: 'Using Ververl v0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
