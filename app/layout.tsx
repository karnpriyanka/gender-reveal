import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gender Reveal - A Special Moment',
  description: 'Join us for our special gender reveal celebration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

