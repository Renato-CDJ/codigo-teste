"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, AlertCircle, CheckCircle2, Info, CreditCard, Building2, Home } from "lucide-react"
import { getMaxPromiseDate, isBusinessDay } from "@/lib/business-days"

type ProductType = "cartao" | "comercial" | "habitacional"

export function PromiseCalendar() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | "">("")
  const [showCalendarDialog, setShowCalendarDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [hoveredProduct, setHoveredProduct] = useState<ProductType | null>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handleProductSelect = (value: ProductType) => {
    setSelectedProduct(value)
    setSelectedDate(undefined)
  }

  const maxDate = selectedProduct ? getMaxPromiseDate(selectedProduct) : undefined

  const isDateInRange = (date: Date) => {
    if (!selectedProduct) return false

    const dateTime = new Date(date)
    dateTime.setHours(0, 0, 0, 0)
    const todayTime = new Date(today)
    todayTime.setHours(0, 0, 0, 0)

    if (dateTime < todayTime) return false

    if (maxDate) {
      const maxDateTime = new Date(maxDate)
      maxDateTime.setHours(0, 0, 0, 0)
      if (dateTime > maxDateTime) return false
    }

    return isBusinessDay(dateTime)
  }

  const productOptions = [
    {
      value: "cartao" as ProductType,
      name: "Cartão fase 1",
      deadline: "até 6 dias úteis",
      icon: CreditCard,
      color: "blue",
    },
    {
      value: "comercial" as ProductType,
      name: "Comercial",
      deadline: "até 9 dias úteis",
      icon: Building2,
      color: "purple",
    },
    {
      value: "habitacional" as ProductType,
      name: "Habitacional",
      deadline: "até 9 dias úteis",
      icon: Home,
      color: "green",
    },
  ]

  return (
    <>
      <Card className="cursor-pointer transition-colors" onClick={() => setShowCalendarDialog(true)}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Prazo para Promessa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-2 border-blue-400 dark:border-blue-600 rounded-lg shadow-md animate-pulse hover:animate-none transition-all hover:shadow-lg hover:scale-[1.02]">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 animate-bounce" />
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                Clique aqui para verificar as datas para Promessas de Pagamento
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Selecione o tipo de produto e escolha uma data disponível
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Calendar
              mode="single"
              selected={today}
              disabled={(date) => date.getTime() !== today.getTime()}
              className="rounded-lg border shadow-sm scale-90 origin-top"
              classNames={{
                day_today: "ring-2 ring-orange-500 dark:ring-orange-400 font-bold text-foreground",
                months: "flex flex-col space-y-2",
                month: "space-y-2 w-full",
                table: "w-full border-collapse",
                head_cell: "text-muted-foreground rounded-md w-8 font-medium text-xs",
                cell: "h-8 w-8 text-center text-xs p-0 relative",
                day: "h-8 w-8 p-0 font-normal text-sm",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="sm:max-w-[420px] max-h-[85vh] overflow-y-auto">
          <DialogHeader className="space-y-2 pb-3 border-b">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Calendário de Promessas
            </DialogTitle>
            <p className="text-xs text-muted-foreground">Selecione o tipo de produto e escolha uma data disponível</p>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Tipo de Produto
              </label>
              <div className="grid grid-cols-3 gap-2">
                {productOptions.map((product) => {
                  const Icon = product.icon
                  const isSelected = selectedProduct === product.value
                  const isHovered = hoveredProduct === product.value
                  return (
                    <div key={product.value} className="relative">
                      <button
                        onClick={() => handleProductSelect(product.value)}
                        onMouseEnter={() => setHoveredProduct(product.value)}
                        onMouseLeave={() => setHoveredProduct(null)}
                        className={`w-full p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? "border-orange-500 dark:border-primary bg-orange-50 dark:bg-card shadow-md scale-[1.02]"
                            : "border-border bg-card hover:border-orange-300 dark:hover:border-muted"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`p-1.5 rounded-lg ${isSelected ? "bg-orange-500 dark:bg-primary" : "bg-muted"}`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                isSelected ? "text-white dark:text-primary-foreground" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <p
                            className={`font-semibold text-xs text-center ${
                              isSelected ? "text-orange-600 dark:text-primary" : "text-foreground"
                            }`}
                          >
                            {product.name}
                          </p>
                          {isSelected && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-orange-500 dark:text-primary absolute top-1 right-1" />
                          )}
                        </div>
                      </button>
                      {isHovered && (
                        <div className="absolute z-50 top-full mt-1 left-1/2 -translate-x-1/2 w-max max-w-[200px] p-2 bg-popover border border-border rounded-md shadow-lg animate-in fade-in-0 zoom-in-95">
                          <p className="text-xs text-popover-foreground font-medium">Prazo: {product.deadline}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {!selectedProduct ? (
              <div className="space-y-3">
                {/* Current Date Calendar */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/50 rounded-md">
                    <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-semibold text-foreground">Data Atual</p>
                  </div>
                  <div className="flex justify-center p-3 bg-card rounded-lg border">
                    <Calendar
                      mode="single"
                      selected={today}
                      disabled={(date) => date.getTime() !== today.getTime()}
                      className="rounded-lg scale-95"
                      classNames={{
                        day_today: "bg-primary text-primary-foreground font-bold ring-2 ring-primary/20",
                        months: "flex flex-col space-y-2",
                        month: "space-y-2 w-full",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-semibold",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-md transition-colors",
                        table: "w-full border-collapse",
                        head_cell: "text-muted-foreground rounded-md w-9 font-semibold text-xs",
                        cell: "h-9 w-9 text-center text-sm p-0 relative",
                        day: "h-9 w-9 p-0 font-medium text-sm hover:bg-accent rounded-md transition-colors",
                      }}
                    />
                  </div>
                </div>

                {/* Info Message */}
                <div className="flex items-start gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-md">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                    Selecione um tipo de produto acima para visualizar as datas disponíveis
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Max Date Info */}
                {maxDate && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-l-4 border-emerald-500 rounded-md p-2.5">
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Data Máxima
                    </p>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      {maxDate.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {/* Available Dates Calendar */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/50 rounded-md">
                    <CalendarIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs font-semibold text-foreground">Datas Disponíveis</p>
                  </div>
                  <div className="flex justify-center p-3 bg-card rounded-lg border">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => !isDateInRange(date)}
                      className="rounded-lg scale-95"
                      modifiers={{
                        available: (date) => isDateInRange(date) && date.getTime() !== today.getTime(),
                      }}
                      modifiersClassNames={{
                        available:
                          "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-800 border-2 border-emerald-400 dark:border-emerald-600",
                      }}
                      classNames={{
                        day_today: "bg-primary text-primary-foreground font-bold ring-2 ring-primary/20",
                        day_selected:
                          "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white font-bold hover:bg-emerald-700 dark:hover:bg-emerald-600 ring-2 ring-emerald-400 dark:ring-emerald-600",
                        day_disabled: "text-muted-foreground opacity-30 line-through cursor-not-allowed",
                        months: "flex flex-col space-y-2",
                        month: "space-y-2 w-full",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-semibold",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-md transition-colors",
                        table: "w-full border-collapse",
                        head_cell: "text-muted-foreground rounded-md w-9 font-semibold text-xs",
                        cell: "h-9 w-9 text-center text-sm p-0 relative",
                        day: "h-9 w-9 p-0 font-medium text-sm hover:bg-accent rounded-md transition-colors",
                      }}
                    />
                  </div>
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 border-l-4 border-emerald-500 rounded-md p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-100">Data Selecionada</p>
                    </div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 ml-5">
                      {selectedDate.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {/* Legend */}
                <div className="bg-muted/50 rounded-md p-2.5 space-y-2 border">
                  <p className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    Legenda
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-primary text-primary-foreground rounded-md ring-2 ring-primary/20 flex items-center justify-center text-[10px] font-bold">
                        H
                      </div>
                      <span className="text-[10px] font-medium">Hoje</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/50 border-2 border-emerald-400 dark:border-emerald-600 rounded-md"></div>
                      <span className="text-[10px] font-medium">Disponível</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-emerald-600 dark:bg-emerald-500 rounded-md ring-2 ring-emerald-400 dark:ring-emerald-600"></div>
                      <span className="text-[10px] font-medium">Selecionada</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-muted line-through rounded-md border-2 opacity-30"></div>
                      <span className="text-[10px] font-medium">Indisponível</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 pt-3 border-t">
            <Button
              onClick={() => {
                setShowCalendarDialog(false)
                setSelectedProduct("")
                setSelectedDate(undefined)
              }}
              className="flex-1 h-9 font-semibold text-sm"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
