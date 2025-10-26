"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import type { ScriptStep, ContentSegment } from "@/lib/types"
import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ScriptCardProps {
  step: ScriptStep
  onButtonClick: (nextStepId: string | null) => void
  onGoBack?: () => void
  canGoBack?: boolean
  operatorName: string
  customerFirstName?: string
  searchQuery?: string
  showControls?: boolean
}

const ACCESSIBILITY_STORAGE_KEY = "callcenter_accessibility_settings"

function loadAccessibilitySettings(): { textSize: number; buttonSize: number } {
  if (typeof window === "undefined") return { textSize: 100, buttonSize: 80 }

  try {
    const saved = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error("[v0] Error loading accessibility settings:", error)
  }

  return { textSize: 100, buttonSize: 80 }
}

function saveAccessibilitySettings(textSize: number, buttonSize: number) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify({ textSize, buttonSize }))
  } catch (error) {
    console.error("[v0] Error saving accessibility settings:", error)
  }
}

function renderContentWithSegments(
  content: string,
  segments: ContentSegment[] | undefined,
  textFontSize: number,
  operatorName: string,
  customerFirstName: string,
): React.ReactNode {
  if (!segments || segments.length === 0) {
    // Fallback to original HTML rendering if no segments
    return content
      .replace(/\[Nome do operador\]/gi, `<strong>${operatorName}</strong>`)
      .replace(/\[Primeiro nome do cliente\]/gi, `<strong>${customerFirstName}</strong>`)
      .replace(/$$Primeiro nome do cliente$$/gi, `<strong>${customerFirstName}</strong>`)
      .replace(/$$nome completo do cliente$$/gi, `<strong>${customerFirstName}</strong>`)
      .replace(/\[CPF do cliente\]/gi, "<strong>***.***.***-**</strong>")
      .replace(/\n/g, "<br>")
  }

  const textToElements = (text: string, keyPrefix: string): React.ReactNode[] => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []

    lines.forEach((line, lineIdx) => {
      if (lineIdx > 0) {
        elements.push(<br key={`${keyPrefix}-br-${lineIdx}`} />)
      }
      if (line) {
        elements.push(<span key={`${keyPrefix}-line-${lineIdx}`}>{line}</span>)
      }
    })

    return elements
  }

  // Build a map of segments by their text for quick lookup
  const segmentMap = new Map<string, ContentSegment>()
  segments.forEach((seg) => {
    segmentMap.set(seg.text, seg)
  })

  // Split content by segments and render with formatting
  let lastIndex = 0
  const elements: React.ReactNode[] = []

  segments.forEach((segment, idx) => {
    const index = content.indexOf(segment.text, lastIndex)
    if (index !== -1) {
      // Add text before segment (with line breaks)
      if (index > lastIndex) {
        const textBefore = content.substring(lastIndex, index)
        elements.push(...textToElements(textBefore, `text-${idx}`))
      }

      // Add formatted segment
      const segmentStyle: React.CSSProperties = {
        fontWeight: segment.formatting.bold ? "bold" : "normal",
        fontStyle: segment.formatting.italic ? "italic" : "normal",
        color: segment.formatting.color || "inherit",
        backgroundColor: segment.formatting.backgroundColor || "transparent",
        fontSize:
          segment.formatting.fontSize === "sm"
            ? `${textFontSize * 0.875}px`
            : segment.formatting.fontSize === "lg"
              ? `${textFontSize * 1.125}px`
              : segment.formatting.fontSize === "xl"
                ? `${textFontSize * 1.25}px`
                : `${textFontSize}px`,
        padding: segment.formatting.backgroundColor ? "2px 4px" : "0",
        borderRadius: segment.formatting.backgroundColor ? "4px" : "0",
      }

      const segmentLines = segment.text.split("\n")
      const segmentElements: React.ReactNode[] = []

      segmentLines.forEach((line, lineIdx) => {
        if (lineIdx > 0) {
          segmentElements.push(<br key={`segment-${idx}-br-${lineIdx}`} />)
        }
        if (line) {
          segmentElements.push(
            <span key={`segment-${idx}-line-${lineIdx}`} style={segmentStyle}>
              {line}
            </span>,
          )
        }
      })

      elements.push(...segmentElements)

      lastIndex = index + segment.text.length
    }
  })

  // Add remaining text (with line breaks)
  if (lastIndex < content.length) {
    const remainingText = content.substring(lastIndex)
    elements.push(...textToElements(remainingText, "text-end"))
  }

  return elements
}

export const ScriptCard = memo(function ScriptCard({
  step,
  onButtonClick,
  onGoBack,
  canGoBack = false,
  operatorName,
  customerFirstName = "Cliente",
  searchQuery = "",
  showControls = true,
}: ScriptCardProps) {
  const [textSize, setTextSize] = useState<number[]>(() => {
    const settings = loadAccessibilitySettings()
    return [settings.textSize]
  })
  const [buttonSize, setButtonSize] = useState<number[]>(() => {
    const settings = loadAccessibilitySettings()
    return [settings.buttonSize]
  })
  const [showTabulation, setShowTabulation] = useState(false)
  const [showTabulationPulse, setShowTabulationPulse] = useState(false)

  const hasTabulations = step.tabulations && step.tabulations.length > 0

  useEffect(() => {
    saveAccessibilitySettings(textSize[0], buttonSize[0])
  }, [textSize, buttonSize])

  useEffect(() => {
    if (hasTabulations) {
      setShowTabulationPulse(true)
      const timer = setTimeout(() => setShowTabulationPulse(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [step.id, hasTabulations])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape" && canGoBack && onGoBack) {
        onGoBack()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [canGoBack, onGoBack])

  const processedContent = useMemo(
    () =>
      step.content
        .replace(/\[Nome do operador\]/gi, `<strong>${operatorName}</strong>`)
        .replace(/\[Primeiro nome do cliente\]/gi, `<strong>${customerFirstName}</strong>`)
        .replace(/$$Primeiro nome do cliente$$/gi, `<strong>${customerFirstName}</strong>`)
        .replace(/$$nome completo do cliente$$/gi, `<strong>${customerFirstName}</strong>`)
        .replace(/\[CPF do cliente\]/gi, "<strong>***.***.***-**</strong>")
        .replace(/\n/g, "<br>"),
    [step.content, operatorName, customerFirstName],
  )

  const highlightedTitle = useMemo(
    () =>
      searchQuery && step.title.toLowerCase().includes(searchQuery.toLowerCase())
        ? step.title.replace(
            new RegExp(`(${searchQuery})`, "gi"),
            '<mark class="bg-yellow-300 dark:bg-yellow-600">$1</mark>',
          )
        : step.title,
    [searchQuery, step.title],
  )

  const textFontSize = useMemo(() => 16 + (textSize[0] / 100) * 16, [textSize])
  const navButtonFontSize = useMemo(() => 14 + (buttonSize[0] / 100) * 8, [buttonSize])
  const navButtonPadding = useMemo(() => 12 + (buttonSize[0] / 100) * 8, [buttonSize])
  const buttonFontSize = useMemo(() => 12 + (buttonSize[0] / 100) * 8, [buttonSize])
  const buttonPadding = useMemo(() => 12 + (buttonSize[0] / 100) * 8, [buttonSize])

  const handleTabulationOpen = useCallback(() => setShowTabulation(true), [])
  const handleTabulationClose = useCallback(() => setShowTabulation(false), [])

  const contentStyles = useMemo(() => {
    const styles: React.CSSProperties = {
      fontSize: `${textFontSize}px`,
      lineHeight: "1.75",
    }

    if (step.formatting) {
      if (step.formatting.textColor) {
        styles.color = step.formatting.textColor
      }
      if (step.formatting.bold) {
        styles.fontWeight = "bold"
      }
      if (step.formatting.italic) {
        styles.fontStyle = "italic"
      }
      if (step.formatting.textAlign) {
        styles.textAlign = step.formatting.textAlign
      }
    }

    return styles
  }, [textFontSize, step.formatting])

  const renderedContent = useMemo(() => {
    if (step.contentSegments && step.contentSegments.length > 0) {
      return renderContentWithSegments(
        step.content,
        step.contentSegments,
        textFontSize,
        operatorName,
        customerFirstName,
      )
    }
    return processedContent
  }, [step.content, step.contentSegments, textFontSize, operatorName, customerFirstName, processedContent])

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto">
      {showControls && (
        <div className="py-4 px-3 md:px-6 bg-gradient-to-r from-slate-700/50 to-slate-800/50 dark:from-slate-800/60 dark:to-slate-900/60 rounded-xl backdrop-blur-sm border border-slate-600/30 dark:border-slate-700/50 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <label className="text-xs md:text-sm font-bold text-foreground whitespace-nowrap min-w-fit flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                <span className="text-base md:text-lg">📝</span>
                Tamanho do Texto:
              </label>
              <Slider
                value={textSize}
                onValueChange={setTextSize}
                min={50}
                max={120}
                step={5}
                className="flex-1 w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-500 [&_[role=slider]]:to-amber-500 dark:[&_[role=slider]]:from-orange-500 dark:[&_[role=slider]]:to-orange-600 [&_[role=slider]]:border-orange-600 dark:[&_[role=slider]]:border-orange-500 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-all [&_[role=slider]]:hover:scale-110 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-orange-400 [&_.bg-primary]:to-amber-400 dark:[&_.bg-primary]:from-orange-500 dark:[&_.bg-primary]:to-orange-600"
              />
              <span className="text-xs font-bold text-orange-500 dark:text-orange-400 min-w-[3rem] text-right bg-slate-700/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                {textSize[0]}%
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <label className="text-xs md:text-sm font-bold text-foreground whitespace-nowrap min-w-fit flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                <span className="text-base md:text-lg">🔘</span>
                Tamanho dos Botões:
              </label>
              <Slider
                value={buttonSize}
                onValueChange={setButtonSize}
                min={50}
                max={150}
                step={5}
                className="flex-1 w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-500 [&_[role=slider]]:to-amber-500 dark:[&_[role=slider]]:from-orange-500 dark:[&_[role=slider]]:to-orange-600 [&_[role=slider]]:border-orange-600 dark:[&_[role=slider]]:border-orange-500 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:shadow-lg [&_[role=slider]]:transition-all [&_[role=slider]]:hover:scale-110 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-orange-400 [&_.bg-primary]:to-amber-400 dark:[&_.bg-primary]:from-orange-500 dark:[&_.bg-primary]:to-orange-600"
              />
              <span className="text-xs font-bold text-orange-500 dark:text-orange-400 min-w-[3rem] text-right bg-slate-700/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                {buttonSize[0]}%
              </span>
            </div>
          </div>
        </div>
      )}

      {canGoBack && onGoBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onGoBack}
          className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-50 shadow-2xl hover:shadow-3xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 dark:from-slate-600 dark:to-slate-700 dark:hover:from-slate-700 dark:hover:to-slate-800 text-white border-0 h-12 w-12 md:h-14 md:w-14 p-0 rounded-full transition-all duration-200 hover:scale-125 active:scale-95 shadow-orange-500/20 hover:shadow-orange-500/40"
        >
          <ArrowLeft className="h-6 w-6 md:h-7 md:w-7" />
        </Button>
      )}

      <Card className="relative shadow-2xl border-2 border-orange-400/60 dark:border-orange-500/50 w-full overflow-hidden backdrop-blur-sm bg-gradient-to-br from-slate-700/40 to-slate-800/40 dark:from-slate-800/60 dark:to-slate-900/60 transition-all duration-300 hover:shadow-orange-500/30 hover:border-orange-400/80">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 dark:from-orange-500/3 dark:to-amber-500/3 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleTabulationOpen}
          className={`absolute top-4 right-4 md:top-6 md:right-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-white dark:to-gray-100 dark:hover:from-gray-100 dark:hover:to-white text-white dark:text-black font-bold border-0 shadow-lg hover:shadow-xl transition-all duration-200 z-20 text-xs md:text-sm hover:scale-110 active:scale-95 ${
            showTabulationPulse ? "animate-bounce" : ""
          }`}
        >
          {hasTabulations ? (
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 md:mr-2 animate-pulse" />
          ) : (
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 md:mr-2" />
          )}
          <span className="hidden md:inline">Verificar Tabulação</span>
          {hasTabulations && showTabulationPulse && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </Button>

        <CardHeader className="pb-6 pt-8 px-6 md:px-10 relative z-10 border-b border-slate-600/30 dark:border-slate-700/50">
          <CardTitle
            className="text-2xl md:text-3xl lg:text-4xl text-center font-bold text-balance leading-tight bg-gradient-to-r from-orange-400 to-amber-400 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent drop-shadow-sm"
            dangerouslySetInnerHTML={{ __html: highlightedTitle }}
          />
        </CardHeader>

        <CardContent className="space-y-6 pb-8 px-6 md:px-10 relative z-10">
          <div
            className="bg-white dark:bg-gradient-to-br dark:from-slate-700/60 dark:via-slate-800/60 dark:to-slate-700/60 rounded-2xl p-8 md:p-12 leading-relaxed min-h-[300px] md:min-h-[360px] border-2 border-orange-400/60 dark:border-slate-700/60 shadow-inner backdrop-blur-sm transition-all duration-300 hover:border-orange-400/80 dark:hover:border-orange-500/30"
            style={contentStyles}
          >
            {typeof renderedContent === "string" ? (
              <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            ) : (
              renderedContent
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center items-center pt-8 px-2">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-4xl">
          {step.buttons
            .sort((a, b) => a.order - b.order)
            .map((button) => {
              const isPrimary = button.primary || button.variant === "primary" || button.variant === "default"

              return (
                <Button
                  key={button.id}
                  size="lg"
                  onClick={() => onButtonClick(button.nextStepId)}
                  className={`font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border-0 rounded-xl ${
                    isPrimary
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 dark:text-white text-white"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 dark:text-white text-white"
                  }`}
                  style={{
                    fontSize: `${navButtonFontSize}px`,
                    padding: `${navButtonPadding}px ${navButtonPadding * 2}px`,
                    minHeight: `${navButtonPadding * 3}px`,
                  }}
                >
                  {button.label}
                </Button>
              )
            })}
        </div>
      </div>

      <Dialog open={showTabulation} onOpenChange={setShowTabulation}>
        <DialogContent className="sm:max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto border-2 border-orange-400/60 dark:border-orange-500/50 bg-gradient-to-br from-slate-700/40 to-slate-800/40 dark:from-slate-800/60 dark:to-slate-900/60">
          <DialogHeader className="space-y-3 pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent">
                Tabulação Recomendada
              </span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Se você encerrar o atendimento nesta tela, utilize a(s) seguinte(s) tabulação(ões):
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {step.tabulations && step.tabulations.length > 0 ? (
              step.tabulations.map((tabulation, index) => (
                <div
                  key={tabulation.id || index}
                  className="group relative rounded-xl border-2 border-slate-600 dark:border-slate-600 bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 p-5 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-orange-400/60 dark:hover:border-orange-500/50 overflow-hidden"
                >
                  <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle2 className="h-12 w-12 text-orange-500 dark:text-orange-400" />
                  </div>
                  <div className="relative">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 flex-shrink-0 shadow-md">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-gray-100 dark:text-white leading-tight break-words">
                        {tabulation.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-300 dark:text-gray-200 leading-relaxed whitespace-pre-wrap pl-9 break-words">
                      {tabulation.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border-2 border-slate-600/50 dark:border-slate-700/50 bg-slate-700/30 dark:bg-slate-800/30 p-6 text-center shadow-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-slate-600/50 dark:bg-slate-700/50">
                    <CheckCircle2 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed max-w-md">
                    Nenhuma tabulação específica recomendada para esta tela. Continue o atendimento normalmente.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-slate-600/30 dark:border-slate-700/50">
            <Button
              onClick={handleTabulationClose}
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-bold border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-base hover:scale-105 active:scale-95"
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
})
