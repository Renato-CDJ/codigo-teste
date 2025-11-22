"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Algo deu errado!</h2>
        <p className="text-muted-foreground mb-6">Ocorreu um erro inesperado. Tente recarregar a página.</p>
        <div className="bg-muted/50 p-4 rounded-md mb-6 text-left overflow-auto max-h-40 text-xs font-mono">
          {error.message || "Erro desconhecido"}
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()} variant="outline">
            Recarregar Página
          </Button>
          <Button onClick={() => reset()}>Tentar Novamente</Button>
        </div>
      </div>
    </div>
  )
}
