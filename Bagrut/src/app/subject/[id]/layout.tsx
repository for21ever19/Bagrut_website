export async function generateStaticParams() {
  return [
    { id: 'history' },
    { id: 'civics' },
    { id: 'tanakh' },
    { id: 'literature' },
  ]
}

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

