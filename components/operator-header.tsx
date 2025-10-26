"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import {
  Search,
  Sun,
  Moon,
  LogOut,
  Circle,
  PanelRightClose,
  PanelRightOpen,
  Eye,
  EyeOff,
  Home,
  Hash,
  Filter,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getProducts } from "@/lib/store"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface OperatorHeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  isSidebarOpen?: boolean
  onToggleSidebar?: () => void
  showControls?: boolean
  onToggleControls?: () => void
  isSessionActive?: boolean
  onBackToStart?: () => void
  onProductSelect?: (productId: string) => void
}

export const OperatorHeader = memo(function OperatorHeader({
  searchQuery = "",
  onSearchChange,
  isSidebarOpen = true,
  onToggleSidebar,
  showControls = true,
  onToggleControls,
  isSessionActive = false,
  onBackToStart,
  onProductSelect,
}: OperatorHeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [products, setProducts] = useState(getProducts().filter((p) => p.isActive))
  const [selectedAttendanceTypes, setSelectedAttendanceTypes] = useState<string[]>([])
  const [selectedPersonTypes, setSelectedPersonTypes] = useState<string[]>([])

  useEffect(() => {
    const handleStoreUpdate = () => {
      setProducts(getProducts().filter((p) => p.isActive))
    }

    window.addEventListener("store-updated", handleStoreUpdate)
    return () => window.removeEventListener("store-updated", handleStoreUpdate)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    router.push("/")
  }, [logout, router])

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const handleSearchInput = useCallback((value: string) => {
    setShowProductSearch(value.length > 0)
  }, [])

  const handleProductSelect = useCallback(
    (productId: string) => {
      setShowProductSearch(false)
      onSearchChange?.("")
      onProductSelect?.(productId)
      setSelectedAttendanceTypes([])
      setSelectedPersonTypes([])
    },
    [onSearchChange, onProductSelect],
  )

  const toggleAttendanceType = useCallback((type: string) => {
    setSelectedAttendanceTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }, [])

  const togglePersonType = useCallback((type: string) => {
    setSelectedPersonTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedAttendanceTypes.length === 0 && selectedPersonTypes.length === 0) {
        return false
      }

      const matchesAttendance =
        selectedAttendanceTypes.length === 0 ||
        (product.attendanceTypes && product.attendanceTypes.some((type) => selectedAttendanceTypes.includes(type)))

      const matchesPerson =
        selectedPersonTypes.length === 0 ||
        (product.personTypes && product.personTypes.some((type) => selectedPersonTypes.includes(type)))

      return matchesAttendance && matchesPerson
    })
  }, [products, selectedAttendanceTypes, selectedPersonTypes])

  const hasFiltersSelected = selectedAttendanceTypes.length > 0 || selectedPersonTypes.length > 0

  return (
    <header className="border-b bg-gradient-to-r from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 shadow-lg backdrop-blur-sm border-slate-600/30 dark:border-slate-700/50">
      <div className="container mx-auto px-3 md:px-4 py-3">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            {user && (
              <div className="text-xs md:text-sm font-bold text-orange-400 dark:text-orange-300 whitespace-nowrap hidden sm:block bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 dark:border-orange-400/20">
                {user.fullName}
              </div>
            )}
            <div className="flex-1 max-w-md relative">
              <Popover open={showProductSearch} onOpenChange={setShowProductSearch}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Pesquisar produtos..."
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      className="pl-9 text-sm focus-visible:ring-orange-500 dark:focus-visible:ring-orange-400 bg-slate-600/40 dark:bg-slate-700/40 border-slate-600/50 dark:border-slate-700/50 hover:border-orange-400/50 dark:hover:border-orange-500/50 transition-colors"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[650px] p-0 border-slate-600/50 dark:border-slate-700/50 shadow-2xl bg-gradient-to-br from-slate-700/80 to-slate-800/80 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm"
                  align="start"
                >
                  <Command className="bg-transparent">
                    <CommandList className="max-h-[500px]">
                      <div className="p-4 border-b border-slate-600/30 dark:border-slate-700/50 bg-slate-700/40 dark:bg-slate-800/40 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-orange-400 dark:text-orange-300">
                          <Filter className="h-4 w-4" />
                          <span>Filtrar Produtos</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="text-xs font-bold text-orange-400/80 dark:text-orange-300/80 uppercase tracking-wide">
                              Tipo de Atendimento
                            </div>
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2.5 group">
                                <Checkbox
                                  id="ativo"
                                  checked={selectedAttendanceTypes.includes("ativo")}
                                  onCheckedChange={() => toggleAttendanceType("ativo")}
                                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <Label
                                  htmlFor="ativo"
                                  className="text-sm font-medium cursor-pointer text-slate-200 dark:text-slate-300 group-hover:text-orange-400 dark:group-hover:text-orange-300 transition-colors"
                                >
                                  Ativo
                                </Label>
                              </div>
                              <div className="flex items-center gap-2.5 group">
                                <Checkbox
                                  id="receptivo"
                                  checked={selectedAttendanceTypes.includes("receptivo")}
                                  onCheckedChange={() => toggleAttendanceType("receptivo")}
                                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <Label
                                  htmlFor="receptivo"
                                  className="text-sm font-medium cursor-pointer text-slate-200 dark:text-slate-300 group-hover:text-orange-400 dark:group-hover:text-orange-300 transition-colors"
                                >
                                  Receptivo
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="text-xs font-bold text-orange-400/80 dark:text-orange-300/80 uppercase tracking-wide">
                              Tipo de Pessoa
                            </div>
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2.5 group">
                                <Checkbox
                                  id="fisica"
                                  checked={selectedPersonTypes.includes("fisica")}
                                  onCheckedChange={() => togglePersonType("fisica")}
                                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <Label
                                  htmlFor="fisica"
                                  className="text-sm font-medium cursor-pointer text-slate-200 dark:text-slate-300 group-hover:text-orange-400 dark:group-hover:text-orange-300 transition-colors"
                                >
                                  Física
                                </Label>
                              </div>
                              <div className="flex items-center gap-2.5 group">
                                <Checkbox
                                  id="juridica"
                                  checked={selectedPersonTypes.includes("juridica")}
                                  onCheckedChange={() => togglePersonType("juridica")}
                                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <Label
                                  htmlFor="juridica"
                                  className="text-sm font-medium cursor-pointer text-slate-200 dark:text-slate-300 group-hover:text-orange-400 dark:group-hover:text-orange-300 transition-colors"
                                >
                                  Jurídica
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {hasFiltersSelected && (
                          <div className="flex items-center gap-2 pt-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-orange-500/20 text-orange-300 dark:text-orange-200 border-orange-500/30"
                            >
                              {filteredProducts.length} produto(s) encontrado(s)
                            </Badge>
                          </div>
                        )}
                      </div>

                      {!hasFiltersSelected ? (
                        <div className="py-12 text-center">
                          <Filter className="h-12 w-12 text-slate-500/40 mx-auto mb-3" />
                          <p className="text-sm text-slate-400 font-medium">
                            Selecione os filtros acima para ver os produtos
                          </p>
                          <p className="text-xs text-slate-500/70 mt-1">
                            Escolha pelo menos um tipo de atendimento ou pessoa
                          </p>
                        </div>
                      ) : filteredProducts.length === 0 ? (
                        <CommandEmpty className="py-12 text-center text-slate-400">
                          <div className="text-sm">Nenhum produto encontrado com os filtros selecionados.</div>
                        </CommandEmpty>
                      ) : (
                        <CommandGroup heading="Produtos Disponíveis" className="p-2">
                          {filteredProducts.map((product) => (
                            <CommandItem
                              key={product.id}
                              onSelect={() => handleProductSelect(product.id)}
                              className="cursor-pointer rounded-lg p-3 mb-1.5 hover:bg-orange-500/20 dark:hover:bg-orange-500/10 transition-colors border border-transparent hover:border-orange-500/40 dark:hover:border-orange-500/30"
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 rounded-md bg-orange-500/20 dark:bg-orange-500/10 flex items-center justify-center border border-orange-500/30 dark:border-orange-500/20">
                                    <Hash className="h-4 w-4 text-orange-400 dark:text-orange-300" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-slate-200 dark:text-slate-300 leading-tight">
                                    {product.name}
                                  </div>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onBackToStart}
              className="h-9 w-9 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
              title="Voltar ao Início"
            >
              <Home className="h-4 w-4" />
            </Button>

            {isSessionActive && onToggleControls && (
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleControls}
                className="h-9 w-9 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white border-0 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
                title={showControls ? "Ocultar Controles" : "Exibir Controles"}
              >
                {showControls ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}

            {isSessionActive && onToggleSidebar && (
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleSidebar}
                className="h-9 w-9 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 text-white border-0 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
                title={isSidebarOpen ? "Ocultar Painel" : "Exibir Painel"}
              >
                {isSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              title="Alternar tema"
              className="h-9 w-9 border-2 hover:scale-110 transition-all shadow-md hover:shadow-lg bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 hover:from-orange-500/20 hover:to-amber-500/20 dark:hover:from-orange-600/20 dark:hover:to-orange-700/20 border-slate-600/50 dark:border-slate-700/50"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-orange-500" />
              ) : (
                <Moon className="h-5 w-5 text-amber-600" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1 md:gap-2 h-8 md:h-9 px-2 md:px-3 hover:bg-red-500/20 dark:hover:bg-red-950/40 hover:text-red-400 dark:hover:text-red-400 transition-all text-slate-300 dark:text-slate-400"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline text-xs md:text-sm font-medium">Sair</span>
            </Button>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 dark:text-green-300 rounded-md border border-green-500/30 dark:border-green-500/20">
              <Circle className="h-3 w-3 fill-current animate-pulse" />
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
})
