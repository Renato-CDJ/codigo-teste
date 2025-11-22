"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Erro Crítico</h2>
            <p className="mb-6 text-gray-600">Ocorreu um erro fatal na aplicação.</p>
            <Button onClick={() => reset()}>Tentar Novamente</Button>
          </div>
        </div>
      </body>
    </html>
  )
}
