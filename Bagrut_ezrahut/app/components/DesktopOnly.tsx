'use client'

import { useEffect, useState } from 'react'

export default function DesktopOnly({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)

    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center h-screen bg-canvas">
        <p className="text-ink text-xl font-serif text-center px-8">
          Пожалуйста, откройте сайт с компьютера для учебы.
        </p>
      </div>
    )
  }

  return <>{children}</>
}





