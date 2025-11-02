"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Camera, User, Mail, Phone, Briefcase, LogOut, Eye } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [nome, setNome] = useState("Renato Calixto")
  const [email, setEmail] = useState("renato@exemplo.com")
  const [telefone, setTelefone] = useState("(00) 00000-0000")
  const [bio, setBio] = useState("Desenvolvedor apaixonado por tecnologia, especializado em aplicações Web e jogos.")
  const [fotoPerfil, setFotoPerfil] = useState("/developer-profile.png")

  useEffect(() => {
    const autenticado = localStorage.getItem("usuarioAutenticado")
    if (!autenticado) {
      router.push("/login")
    }

    // Carregar dados salvos
    const dadosSalvos = localStorage.getItem("perfilAdmin")
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos)
      setNome(dados.nome || nome)
      setEmail(dados.email || email)
      setTelefone(dados.telefone || telefone)
      setBio(dados.bio || bio)
      setFotoPerfil(dados.fotoPerfil || fotoPerfil)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("usuarioAutenticado")
    router.push("/login")
  }

  const handleSalvar = () => {
    const dados = { nome, email, telefone, bio, fotoPerfil }
    localStorage.setItem("perfilAdmin", JSON.stringify(dados))
    alert("Perfil atualizado com sucesso!")
  }

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPerfil(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400">Painel de Administração</h1>
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              Ver Site Público
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-8">Editar Perfil</h2>

            {/* Foto de Perfil */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-cyan-500 shadow-lg shadow-cyan-500/40 overflow-hidden bg-slate-800">
                  <Image
                    src={fotoPerfil || "/placeholder.svg"}
                    alt="Foto de Perfil"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                </label>
              </div>
              <p className="text-slate-400 text-sm mt-3">Clique no ícone para alterar a foto</p>
            </div>

            {/* Formulário */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
                  <User className="w-4 h-4" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
                  <Phone className="w-4 h-4" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
                  <Briefcase className="w-4 h-4" />
                  Biografia
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
                />
              </div>

              <button
                onClick={handleSalvar}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
