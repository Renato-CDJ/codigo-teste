"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar credenciais do localStorage
    const usuarioSalvo = localStorage.getItem("usuario")
    const senhaSalva = localStorage.getItem("senha")

    if (usuario === usuarioSalvo && senha === senhaSalva) {
      localStorage.setItem("usuarioAutenticado", "true")
      router.push("/admin")
    } else {
      alert("Usuário ou senha incorretos")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 animate-gradient">
      <div className="w-full max-w-md p-10 bg-white/5 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-cyan-500 shadow-lg shadow-cyan-500/40 overflow-hidden bg-slate-800">
            <Image
              src="/developer-avatar.png"
              alt="Logo"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Área de Administração</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/50"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <Link href="/cadastro" className="block text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
            Criar uma conta
          </Link>
          <Link href="/" className="block text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
            Voltar para o site
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-slate-400 text-sm">
        Desenvolvido por <strong className="text-cyan-400">Renato Calixto</strong> © 2025
      </div>
    </div>
  )
}
