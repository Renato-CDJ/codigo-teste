"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getTabulations, getSituations, getChannels } from "@/lib/store"
import { StickyNote, Tags, AlertCircle, Radio, List, Search, CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PromiseCalendar } from "@/components/promise-calendar"

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

        {activeSection === "calendar" && <PromiseCalendar />}
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
