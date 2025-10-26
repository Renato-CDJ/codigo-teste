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
        <DialogContent className="sm:max-w-[420px] max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-orange-400/60 dark:border-orange-500/50 bg-gradient-to-br from-slate-700/40 to-slate-800/40 dark:from-slate-800/60 dark:to-slate-900/60">
          <DialogHeader className="space-y-2 pb-3 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-500 dark:to-orange-500 shadow-lg">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent">
                Calendário de Promessas
              </span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Selecione o tipo de produto e escolha uma data disponível
            </p>
          </DialogHeader>

          <div className="space-y-4 py-4">
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
                        className={`w-full p-1.5 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? "border-orange-500 dark:border-primary bg-orange-50 dark:bg-card shadow-md scale-[1.02]"
                            : "border-border bg-card hover:border-orange-300 dark:hover:border-muted"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`p-1 rounded-lg ${isSelected ? "bg-orange-500 dark:bg-primary" : "bg-muted"}`}
                          >
                            <Icon
                              className={`h-3 w-3 ${
                                isSelected ? "text-white dark:text-primary-foreground" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <p
                            className={`font-semibold text-[10px] text-center leading-tight ${
                              isSelected ? "text-orange-600 dark:text-primary" : "text-foreground"
                            }`}
                          >
                            {product.name}
                          </p>
                          {isSelected && (
                            <CheckCircle2 className="h-3 w-3 text-orange-500 dark:text-primary absolute top-0.5 right-0.5" />
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
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-700/30 dark:bg-slate-800/30 rounded-md">
                    <CalendarIcon className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                    <p className="text-xs font-semibold text-gray-100 dark:text-white">Data Atual</p>
                  </div>
                  <div className="flex justify-center p-3 rounded-xl border-2 border-slate-600 dark:border-slate-600 bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 shadow-md">
                    <Calendar
                      mode="single"
                      selected={today}
                      disabled={(date) => date.getTime() !== today.getTime()}
                      className="rounded-lg scale-95"
                      classNames={{
                        day_today: "bg-orange-500 dark:bg-orange-500 text-white font-bold ring-2 ring-orange-400/50",
                        months: "flex flex-col space-y-2",
                        month: "space-y-2 w-full",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-semibold text-gray-100 dark:text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-slate-600/50 dark:hover:bg-slate-700/50 rounded-md transition-colors text-gray-100 dark:text-white",
                        table: "w-full border-collapse",
                        head_cell: "text-gray-300 dark:text-gray-300 rounded-md w-9 font-semibold text-xs",
                        cell: "h-9 w-9 text-center text-sm p-0 relative",
                        day: "h-9 w-9 p-0 font-medium text-sm text-gray-100 dark:text-white hover:bg-slate-600/50 dark:hover:bg-slate-700/50 rounded-md transition-colors",
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2.5 rounded-xl border-2 border-slate-600/50 dark:border-slate-700/50 bg-slate-700/30 dark:bg-slate-800/30">
                  <Info className="h-4 w-4 text-orange-500 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-200 dark:text-gray-200 font-medium leading-relaxed">
                    Selecione um tipo de produto acima para visualizar as datas disponíveis
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {maxDate && (
                  <div className="rounded-xl border-2 border-slate-600 dark:border-slate-600 bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 p-3 shadow-md">
                    <p className="text-xs font-semibold text-gray-100 dark:text-white mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                      Data Máxima
                    </p>
                    <p className="text-xs font-bold text-gray-200 dark:text-gray-200 pl-5">
                      {maxDate.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-700/30 dark:bg-slate-800/30 rounded-md">
                    <CalendarIcon className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                    <p className="text-xs font-semibold text-gray-100 dark:text-white">Datas Disponíveis</p>
                  </div>
                  <div className="flex justify-center p-3 rounded-xl border-2 border-slate-600 dark:border-slate-600 bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 shadow-md">
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
                          "bg-emerald-600/80 dark:bg-emerald-600/80 text-white font-semibold hover:bg-emerald-500 dark:hover:bg-emerald-500 border-2 border-emerald-400 dark:border-emerald-400",
                      }}
                      classNames={{
                        day_today: "bg-orange-500 dark:bg-orange-500 text-white font-bold ring-2 ring-orange-400/50",
                        day_selected:
                          "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white font-bold hover:bg-emerald-700 dark:hover:bg-emerald-600 ring-2 ring-emerald-400 dark:ring-emerald-600",
                        day_disabled: "text-gray-500 dark:text-gray-500 opacity-30 line-through cursor-not-allowed",
                        months: "flex flex-col space-y-2",
                        month: "space-y-2 w-full",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-semibold text-gray-100 dark:text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-slate-600/50 dark:hover:bg-slate-700/50 rounded-md transition-colors text-gray-100 dark:text-white",
                        table: "w-full border-collapse",
                        head_cell: "text-gray-300 dark:text-gray-300 rounded-md w-9 font-semibold text-xs",
                        cell: "h-9 w-9 text-center text-sm p-0 relative",
                        day: "h-9 w-9 p-0 font-medium text-sm text-gray-100 dark:text-white hover:bg-slate-600/50 dark:hover:bg-slate-700/50 rounded-md transition-colors",
                      }}
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div className="rounded-xl border-2 border-slate-600 dark:border-slate-600 bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 p-3 shadow-md">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      <p className="text-xs font-bold text-gray-100 dark:text-white">Data Selecionada</p>
                    </div>
                    <p className="text-xs font-bold text-gray-200 dark:text-gray-200 ml-5">
                      {selectedDate.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                <div className="rounded-xl border-2 border-slate-600/50 dark:border-slate-700/50 bg-slate-700/30 dark:bg-slate-800/30 p-2.5 space-y-2 shadow-sm">
                  <p className="font-semibold text-xs text-gray-100 dark:text-white flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                    Legenda
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-orange-500 dark:bg-orange-500 text-white rounded-md ring-2 ring-orange-400/50 flex items-center justify-center text-[10px] font-bold">
                        H
                      </div>
                      <span className="text-[10px] font-medium text-gray-200 dark:text-gray-200">Hoje</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-emerald-600/80 dark:bg-emerald-600/80 border-2 border-emerald-400 dark:border-emerald-400 rounded-md"></div>
                      <span className="text-[10px] font-medium text-gray-200 dark:text-gray-200">Disponível</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-emerald-600 dark:bg-emerald-500 rounded-md ring-2 ring-emerald-400 dark:ring-emerald-600"></div>
                      <span className="text-[10px] font-medium text-gray-200 dark:text-gray-200">Selecionada</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-slate-600/50 dark:bg-slate-700/50 line-through rounded-md border-2 opacity-30"></div>
                      <span className="text-[10px] font-medium text-gray-200 dark:text-gray-200">Indisponível</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-600/30 dark:border-slate-700/50">
            <Button
              onClick={() => {
                setShowCalendarDialog(false)
                setSelectedProduct("")
                setSelectedDate(undefined)
              }}
              className="flex-1 h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-bold border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-base hover:scale-105 active:scale-95"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
