"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { getTabulations, getSituations, getChannels } from "@/lib/store"
import {
  StickyNote,
  Tags,
  AlertCircle,
  Radio,
  List,
  Search,
  CalendarIcon,
  CheckCircle2,
  Info,
  CreditCard,
  Building2,
  Home,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getMaxPromiseDate, isBusinessDay } from "@/lib/business-days"

type ProductType = "cartao" | "comercial" | "habitacional"

interface OperatorSidebarProps {
  isOpen: boolean
}

const FilteredList = memo(function FilteredList({
  items,
  searchQuery,
  onItemClick,
  renderItem,
}: {
  items: any[]
  searchQuery: string
  onItemClick: (item: any) => void
  renderItem: (item: any, onClick: () => void) => React.ReactNode
}) {
  const filteredItems = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [items, searchQuery],
  )

  return <div className="space-y-3">{filteredItems.map((item) => renderItem(item, () => onItemClick(item)))}</div>
})

export const OperatorSidebar = memo(function OperatorSidebar({ isOpen }: OperatorSidebarProps) {
  const [activeSection, setActiveSection] = useState<"notes" | "tabulation" | "situation" | "channel" | "calendar">(
    "calendar",
  )

  const [notes, setNotes] = useState("")
  const [selectedTabulation, setSelectedTabulation] = useState("")
  const [selectedSituation, setSelectedSituation] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("")
  const [showSituationDialog, setShowSituationDialog] = useState(false)
  const [showChannelDialog, setShowChannelDialog] = useState(false)

  const [showTabulationFullView, setShowTabulationFullView] = useState(false)
  const [showTabulationModal, setShowTabulationModal] = useState(false)
  const [selectedTabulationForModal, setSelectedTabulationForModal] = useState<any>(null)
  const [tabulationSearchQuery, setTabulationSearchQuery] = useState("")

  const [showSituationFullView, setShowSituationFullView] = useState(false)
  const [showSituationModal, setShowSituationModal] = useState(false)
  const [selectedSituationForModal, setSelectedSituationForModal] = useState<any>(null)
  const [situationSearchQuery, setSituationSearchQuery] = useState("")

  const [showChannelFullView, setShowChannelFullView] = useState(false)
  const [showChannelModal, setShowChannelModal] = useState(false)
  const [selectedChannelForModal, setSelectedChannelForModal] = useState<any>(null)
  const [channelSearchQuery, setChannelSearchQuery] = useState("")

  const [tabulations, setTabulations] = useState(getTabulations())
  const [situations, setSituations] = useState(getSituations().filter((s) => s.isActive))
  const [channels, setChannels] = useState(getChannels().filter((c) => c.isActive))

  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<ProductType | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getProductDetails = useCallback((productType: ProductType) => {
    switch (productType) {
      case "cartao":
        return {
          name: "Cartão fase 1",
          deadline: 6,
          icon: CreditCard,
          color: "#007bff",
        }
      case "comercial":
        return {
          name: "Comercial",
          deadline: 9,
          icon: Building2,
          color: "#28a745",
        }
      case "habitacional":
        return {
          name: "Habitacional",
          deadline: 9,
          icon: Home,
          color: "#17a2b8",
        }
    }
  }, [])

  const maxDate = useMemo(() => {
    if (!selectedProduct) return undefined
    const productInfo = getProductDetails(selectedProduct)
    if (!productInfo) return undefined
    // Use the utility function from "@/lib/business-days"
    return getMaxPromiseDate(today, productInfo.deadline)
  }, [selectedProduct, today, getProductDetails])

  const isDateInRange = useCallback(
    (date: Date): boolean => {
      const normalizedDate = new Date(date)
      normalizedDate.setHours(0, 0, 0, 0)
      if (!maxDate) return false
      return normalizedDate >= today && normalizedDate <= maxDate
    },
    [today, maxDate],
  )

  const handleProductSelect = (productType: ProductType) => {
    setSelectedProduct(productType)
    setSelectedDate(undefined) // Reset selected date when product changes
    setHoveredProduct(null)
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleStoreUpdate = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        console.log("[v0] Operator sidebar: Store updated, refreshing data")
        setTabulations(getTabulations())
        setSituations(getSituations().filter((s) => s.isActive))
        setChannels(getChannels().filter((c) => c.isActive))
      }, 150)
    }

    window.addEventListener("store-updated", handleStoreUpdate)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("store-updated", handleStoreUpdate)
    }
  }, [])

  const selectedSituationData = situations.find((s) => s.id === selectedSituation)
  const selectedChannelData = channels.find((c) => c.id === selectedChannel)

  const filteredTabulations = useMemo(
    () => tabulations.filter((tab) => tab.name.toLowerCase().includes(tabulationSearchQuery.toLowerCase())),
    [tabulations, tabulationSearchQuery],
  )

  const filteredSituations = useMemo(
    () => situations.filter((sit) => sit.name.toLowerCase().includes(situationSearchQuery.toLowerCase())),
    [situations, situationSearchQuery],
  )

  const filteredChannels = useMemo(
    () => channels.filter((ch) => ch.name.toLowerCase().includes(channelSearchQuery.toLowerCase())),
    [channels, channelSearchQuery],
  )

  const handleTabulationClick = useCallback((tabulation: any) => {
    setSelectedTabulationForModal(tabulation)
    setShowTabulationModal(true)
  }, [])

  const handleSituationClick = useCallback((situation: any) => {
    setSelectedSituationForModal(situation)
    setShowSituationModal(true)
  }, [])

  const handleChannelClick = useCallback((channel: any) => {
    setSelectedChannelForModal(channel)
    setShowChannelModal(true)
  }, [])

  if (!isOpen) return null

  return (
    <aside className="w-80 border-l bg-gradient-to-b from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 flex flex-col h-full border-slate-600/30 dark:border-slate-700/50 shadow-lg">
      <div className="border-b border-slate-600/30 dark:border-slate-700/50 p-2 grid grid-cols-5 gap-1 bg-slate-700/40 dark:bg-slate-800/40">
        {/* Calendar first, then Notes */}
        <Button
          variant={activeSection === "calendar" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSection("calendar")}
          className={`flex-col h-auto py-2 transition-all duration-200 ${
            activeSection === "calendar"
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white shadow-lg scale-105"
              : "bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30"
          }`}
        >
          <CalendarIcon className="h-4 w-4 mb-1" />
          <span className="text-xs truncate w-full">Calendario</span>
        </Button>
        <Button
          variant={activeSection === "tabulation" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSection("tabulation")}
          className={`flex-col h-auto py-2 transition-all duration-200 ${
            activeSection === "tabulation"
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white shadow-lg scale-105"
              : "bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30"
          }`}
        >
          <Tags className="h-4 w-4 mb-1" />
          <span className="text-xs truncate w-full px-1">Tabulação</span>
        </Button>
        <Button
          variant={activeSection === "situation" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSection("situation")}
          className={`flex-col h-auto py-2 transition-all duration-200 ${
            activeSection === "situation"
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white shadow-lg scale-105"
              : "bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30"
          }`}
        >
          <AlertCircle className="h-4 w-4 mb-1" />
          <span className="text-xs truncate w-full px-1">Situação</span>
        </Button>
        <Button
          variant={activeSection === "channel" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSection("channel")}
          className={`flex-col h-auto py-2 transition-all duration-200 ${
            activeSection === "channel"
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white shadow-lg scale-105"
              : "bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30"
          }`}
        >
          <Radio className="h-4 w-4 mb-1" />
          <span className="text-xs truncate w-full">Canal</span>
        </Button>
        <Button
          variant={activeSection === "notes" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSection("notes")}
          className={`flex-col h-auto py-2 transition-all duration-200 ${
            activeSection === "notes"
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white shadow-lg scale-105"
              : "bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30"
          }`}
        >
          <StickyNote className="h-4 w-4 mb-1" />
          <span className="text-xs truncate w-full">Notas</span>
        </Button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-4">
        {activeSection === "notes" && (
          <Card className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 border-slate-600/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm text-orange-400 dark:text-orange-300">Bloco de Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anotações do atendimento..."
                className="min-h-[300px] text-sm bg-slate-600/40 dark:bg-slate-700/40 border-slate-600/50 dark:border-slate-700/50 text-slate-100 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-600"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{notes.length} caracteres</p>
            </CardContent>
          </Card>
        )}

        {activeSection === "tabulation" && (
          <Card className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 border-slate-600/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm text-orange-400 dark:text-orange-300">Selecionar Tabulação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30 text-sm transition-all"
                onClick={() => setShowTabulationFullView(true)}
              >
                <List className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Visualizar todo conteúdo</span>
              </Button>

              <Select value={selectedTabulation} onValueChange={setSelectedTabulation}>
                <SelectTrigger className="w-full bg-slate-600/40 dark:bg-slate-700/40 border-slate-600/50 dark:border-slate-700/50 text-slate-200 dark:text-slate-300">
                  <SelectValue placeholder="Escolha uma tabulação" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700/80 dark:bg-slate-800/80 border-slate-600/50 dark:border-slate-700/50">
                  {tabulations.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id} className="text-slate-200 dark:text-slate-300">
                      <div className="flex items-center gap-2 max-w-full">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tab.color }} />
                        <span className="truncate">{tab.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTabulation && (
                <div className="p-3 bg-gradient-to-br from-slate-600/60 to-slate-700/60 dark:from-slate-700/80 dark:to-slate-800/80 rounded-lg text-slate-100 dark:text-slate-200 border border-slate-600/50 dark:border-slate-700/50">
                  <p className="text-sm font-medium break-words">
                    {tabulations.find((t) => t.id === selectedTabulation)?.name}
                  </p>
                  <p className="text-xs text-slate-300 dark:text-slate-400 mt-1 break-words whitespace-pre-wrap">
                    {tabulations.find((t) => t.id === selectedTabulation)?.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeSection === "situation" && (
          <Card className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 border-slate-600/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm text-orange-400 dark:text-orange-300">Status Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30 text-sm transition-all"
                onClick={() => setShowSituationFullView(true)}
              >
                <List className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Visualizar todo conteúdo</span>
              </Button>

              {filteredSituations.map((situation) => (
                <Button
                  key={situation.id}
                  variant={selectedSituation === situation.id ? "default" : "outline"}
                  className={`w-full justify-start text-left transition-all duration-200 ${
                    selectedSituation === situation.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white shadow-lg"
                      : "bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30"
                  }`}
                  onClick={() => {
                    setSelectedSituation(situation.id)
                    setShowSituationDialog(true)
                  }}
                >
                  <span className="truncate w-full">{situation.name}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {activeSection === "channel" && (
          <Card className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 border-slate-600/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm text-orange-400 dark:text-orange-300">Canal de Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30 text-sm transition-all"
                onClick={() => setShowChannelFullView(true)}
              >
                <List className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Visualizar todo conteúdo</span>
              </Button>

              {filteredChannels.map((channel) => (
                <Button
                  key={channel.id}
                  variant={selectedChannel === channel.id ? "default" : "outline"}
                  className={`w-full justify-start text-left transition-all duration-200 ${
                    selectedChannel === channel.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white shadow-lg"
                      : "bg-slate-600/40 dark:bg-slate-700/40 hover:bg-slate-600/60 dark:hover:bg-slate-700/60 text-slate-300 dark:text-slate-400 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/40 dark:hover:border-orange-500/30"
                  }`}
                  onClick={() => {
                    setSelectedChannel(channel.id)
                    setShowChannelDialog(true)
                  }}
                >
                  <span className="truncate w-full">{channel.name}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {activeSection === "calendar" && (
          <Card className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 border-slate-600/50 dark:border-slate-700/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm text-orange-400 dark:text-orange-300 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendário de Promessas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 dark:text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 dark:text-orange-300" />
                  Tipo de Produto
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    {
                      value: "cartao" as ProductType,
                      name: "Cartão fase 1",
                      deadline: "até 6 dias úteis",
                      icon: CreditCard,
                    },
                    {
                      value: "comercial" as ProductType,
                      name: "Comercial",
                      deadline: "até 9 dias úteis",
                      icon: Building2,
                    },
                    {
                      value: "habitacional" as ProductType,
                      name: "Habitacional",
                      deadline: "até 9 dias úteis",
                      icon: Home,
                    },
                  ].map((product) => {
                    const Icon = product.icon
                    const isSelected = selectedProduct === product.value
                    const isHovered = hoveredProduct === product.value
                    return (
                      <div key={product.value} className="relative">
                        <button
                          onClick={() => handleProductSelect(product.value)}
                          onMouseEnter={() => setHoveredProduct(product.value)}
                          onMouseLeave={() => setHoveredProduct(null)}
                          className={`w-full p-1.5 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-left ${
                            isSelected
                              ? "border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-slate-700/60 shadow-md scale-[1.02]"
                              : "border-slate-600/50 dark:border-slate-700/50 bg-slate-600/40 dark:bg-slate-700/40 hover:border-orange-300 dark:hover:border-orange-500/50"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`p-1 rounded-lg ${isSelected ? "bg-orange-500 dark:bg-orange-400" : "bg-slate-500/50 dark:bg-slate-600/50"}`}
                            >
                              <Icon
                                className={`h-3 w-3 ${
                                  isSelected ? "text-white" : "text-slate-300 dark:text-slate-400"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0 text-center">
                              <p
                                className={`font-semibold text-[10px] leading-tight ${
                                  isSelected
                                    ? "text-orange-600 dark:text-orange-300"
                                    : "text-slate-200 dark:text-slate-300"
                                }`}
                              >
                                {product.name}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-3 w-3 text-orange-500 dark:text-orange-400 absolute top-0.5 right-0.5" />
                            )}
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {!selectedProduct ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-md">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                      Selecione um tipo de produto acima para visualizar as datas disponíveis
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
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

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-600/50 dark:bg-slate-700/50 rounded-md">
                      <CalendarIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-xs font-semibold text-slate-200 dark:text-slate-300">Datas Disponíveis</p>
                    </div>
                    <div className="flex justify-center p-3 bg-slate-600/40 dark:bg-slate-700/40 rounded-lg border border-slate-600/50 dark:border-slate-700/50">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        // Use the utility function from "@/lib/business-days" to check if a date is a business day and within range
                        disabled={(date) => !isBusinessDay(date) || !isDateInRange(date)}
                        className="rounded-lg scale-90"
                        modifiers={{
                          available: (date) =>
                            isBusinessDay(date) && isDateInRange(date) && date.getTime() !== today.getTime(),
                        }}
                        modifiersClassNames={{
                          available:
                            "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-800 border-2 border-emerald-400 dark:border-emerald-600",
                        }}
                        classNames={{
                          day_today:
                            "bg-orange-500 dark:bg-orange-400 text-white dark:text-white font-bold ring-2 ring-orange-400 dark:ring-orange-500",
                          day_selected:
                            "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white font-bold hover:bg-emerald-700 dark:hover:bg-emerald-600 ring-2 ring-emerald-400 dark:ring-emerald-600",
                          day_disabled: "text-slate-400 dark:text-slate-600 opacity-30 line-through cursor-not-allowed",
                          months: "flex flex-col space-y-2",
                          month: "space-y-2 w-full",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-xs font-semibold text-slate-200 dark:text-slate-300",
                          nav: "space-x-1 flex items-center",
                          nav_button:
                            "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-slate-600/50 dark:hover:bg-slate-700/50 rounded-md transition-colors",
                          table: "w-full border-collapse",
                          head_cell: "text-slate-400 dark:text-slate-500 rounded-md w-8 font-semibold text-[10px]",
                          cell: "h-8 w-8 text-center text-xs p-0 relative",
                          day: "h-8 w-8 p-0 font-medium text-xs hover:bg-slate-600/50 dark:hover:bg-slate-700/50 rounded-md transition-colors text-slate-200 dark:text-slate-300",
                        }}
                      />
                    </div>
                  </div>

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
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showTabulationFullView} onOpenChange={setShowTabulationFullView}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-600/50 dark:border-slate-700/50 shadow-2xl">
          <DialogHeader className="space-y-3 pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-2xl font-bold text-orange-400 dark:text-orange-300">
              Todas as Tabulações
            </DialogTitle>
            <DialogDescription className="text-base text-slate-400 dark:text-slate-500">
              Lista completa de tabulações disponíveis
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto space-y-4 py-6 pr-4 max-h-[calc(90vh-200px)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-600" />
              <Input
                placeholder="Pesquisar tabulações..."
                value={tabulationSearchQuery}
                onChange={(e) => setTabulationSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-slate-600/40 dark:bg-slate-700/40 border-slate-600/50 dark:border-slate-700/50 text-slate-200 dark:text-slate-300 placeholder-slate-500 dark:placeholder-slate-600 focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
              />
            </div>

            <FilteredList
              items={tabulations}
              searchQuery={tabulationSearchQuery}
              onItemClick={handleTabulationClick}
              renderItem={(tab, onClick) => (
                <button
                  key={tab.id}
                  onClick={onClick}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-slate-600 dark:border-slate-700 bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 hover:border-orange-400/60 dark:hover:border-orange-500/50 hover:bg-slate-700/80 dark:hover:bg-slate-800/90`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="mt-1.5 w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-slate-600 shadow-sm"
                      style={{ backgroundColor: tab.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2 text-slate-100 dark:text-slate-200">{tab.name}</h3>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300 dark:text-slate-400">
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </button>
              )}
            />
          </div>
          <div className="pt-4 border-t border-slate-600/30 dark:border-slate-700/50">
            <Button
              onClick={() => {
                setShowTabulationFullView(false)
                setTabulationSearchQuery("")
              }}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Voltar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSituationFullView} onOpenChange={setShowSituationFullView}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-600/50 dark:border-slate-700/50 shadow-2xl">
          <DialogHeader className="space-y-3 pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-2xl font-bold text-orange-400 dark:text-orange-300">
              Todas as Situações
            </DialogTitle>
            <DialogDescription className="text-base text-slate-400 dark:text-slate-500">
              Lista completa de situações disponíveis
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto space-y-4 py-6 pr-4 max-h-[calc(90vh-200px)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-600" />
              <Input
                placeholder="Pesquisar situações..."
                value={situationSearchQuery}
                onChange={(e) => setSituationSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-slate-600/40 dark:bg-slate-700/40 border-slate-600/50 dark:border-slate-700/50 text-slate-200 dark:text-slate-300 placeholder-slate-500 dark:placeholder-slate-600 focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
              />
            </div>

            <FilteredList
              items={situations}
              searchQuery={situationSearchQuery}
              onItemClick={handleSituationClick}
              renderItem={(situation, onClick) => (
                <button
                  key={situation.id}
                  onClick={onClick}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-slate-600 dark:border-slate-700 bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 hover:border-orange-400/60 dark:hover:border-orange-500/50 hover:bg-slate-700/80 dark:hover:bg-slate-800/90`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-lg bg-orange-500/20 dark:bg-orange-500/10 shadow-sm border border-orange-500/30 dark:border-orange-500/20">
                      <AlertCircle className="h-5 w-5 text-orange-400 dark:text-orange-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2 text-slate-100 dark:text-slate-200">{situation.name}</h3>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300 dark:text-slate-400">
                        {situation.description}
                      </p>
                    </div>
                  </div>
                </button>
              )}
            />
          </div>
          <div className="pt-4 border-t border-slate-600/30 dark:border-slate-700/50">
            <Button
              onClick={() => {
                setShowSituationFullView(false)
                setSituationSearchQuery("")
              }}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Voltar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showChannelFullView} onOpenChange={setShowChannelFullView}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-600/50 dark:border-slate-700/50 shadow-2xl">
          <DialogHeader className="space-y-3 pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-2xl font-bold text-orange-400 dark:text-orange-300">
              Todos os Canais
            </DialogTitle>
            <DialogDescription className="text-base text-slate-400 dark:text-slate-500">
              Lista completa de canais disponíveis
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto space-y-4 py-6 pr-4 max-h-[calc(90vh-200px)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-600" />
              <Input
                placeholder="Pesquisar canais..."
                value={channelSearchQuery}
                onChange={(e) => setChannelSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-slate-600/40 dark:bg-slate-700/40 border-slate-600/50 dark:border-slate-700/50 text-slate-200 dark:text-slate-300 placeholder-slate-500 dark:placeholder-slate-600 focus:border-orange-500 dark:focus:border-orange-400 transition-colors"
              />
            </div>

            <FilteredList
              items={channels}
              searchQuery={channelSearchQuery}
              onItemClick={handleChannelClick}
              renderItem={(channel, onClick) => (
                <button
                  key={channel.id}
                  onClick={onClick}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-slate-600 dark:border-slate-700 bg-gradient-to-br from-slate-700/60 to-slate-800/60 dark:from-slate-800/80 dark:to-slate-900/80 hover:border-orange-400/60 dark:hover:border-orange-500/50 hover:bg-slate-700/80 dark:hover:bg-slate-800/90`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-lg bg-orange-500/20 dark:bg-orange-500/10 shadow-sm border border-orange-500/30 dark:border-orange-500/20">
                      <Radio className="h-5 w-5 text-orange-400 dark:text-orange-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2 text-slate-100 dark:text-slate-200">{channel.name}</h3>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300 dark:text-slate-400">
                        {channel.contact}
                      </p>
                    </div>
                  </div>
                </button>
              )}
            />
          </div>
          <div className="pt-4 border-t border-slate-600/30 dark:border-slate-700/50">
            <Button
              onClick={() => {
                setShowChannelFullView(false)
                setChannelSearchQuery("")
              }}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Voltar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTabulationModal} onOpenChange={setShowTabulationModal}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-600/50 dark:border-slate-700/50 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-orange-400 dark:text-orange-300 text-2xl font-bold">
              {selectedTabulationForModal?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="p-6 rounded-xl bg-slate-600/40 dark:bg-slate-700/40 border-2 border-slate-600/50 dark:border-slate-700/50">
              <p className="text-base leading-relaxed text-slate-200 dark:text-slate-300 whitespace-pre-wrap">
                {selectedTabulationForModal?.description}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowTabulationModal(false)}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showSituationModal} onOpenChange={setShowSituationModal}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-600/50 dark:border-slate-700/50 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-orange-400 dark:text-orange-300 text-2xl font-bold">
              {selectedSituationForModal?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="p-6 rounded-xl bg-slate-600/40 dark:bg-slate-700/40 border-2 border-slate-600/50 dark:border-slate-700/50">
              <p className="text-base leading-relaxed text-slate-200 dark:text-slate-300 whitespace-pre-wrap">
                {selectedSituationForModal?.description}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowSituationModal(false)}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showChannelModal} onOpenChange={setShowChannelModal}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-600/50 dark:border-slate-700/50 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-orange-400 dark:text-orange-300 text-2xl font-bold">
              {selectedChannelForModal?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="p-6 rounded-xl bg-slate-600/40 dark:bg-slate-700/40 border-2 border-slate-600/50 dark:border-slate-700/50">
              <p className="text-base leading-relaxed text-slate-200 dark:text-slate-300 whitespace-pre-wrap">
                {selectedChannelForModal?.contact}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowChannelModal(false)}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showSituationDialog} onOpenChange={setShowSituationDialog}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-600/50 dark:border-slate-700/50 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-orange-400 dark:text-orange-300 text-2xl font-bold">
              {selectedSituationData?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="p-6 rounded-xl bg-slate-600/40 dark:bg-slate-700/40 border-2 border-slate-600/50 dark:border-slate-700/50">
              <p className="text-base leading-relaxed text-slate-200 dark:text-slate-300 whitespace-pre-wrap">
                {selectedSituationData?.description}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowSituationDialog(false)}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showChannelDialog} onOpenChange={setShowChannelDialog}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-600/50 dark:border-slate-700/50 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-600/30 dark:border-slate-700/50">
            <DialogTitle className="text-orange-400 dark:text-orange-300 text-2xl font-bold">
              {selectedChannelData?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="p-6 rounded-xl bg-slate-600/40 dark:bg-slate-700/40 border-2 border-slate-600/50 dark:border-slate-700/50">
              <p className="text-base leading-relaxed text-slate-200 dark:text-slate-300 whitespace-pre-wrap">
                {selectedChannelData?.contact}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowChannelDialog(false)}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white dark:text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </aside>
  )
})
