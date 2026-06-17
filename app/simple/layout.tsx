export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Simple Test</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
