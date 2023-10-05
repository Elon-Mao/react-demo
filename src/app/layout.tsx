import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'react-demo'
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
