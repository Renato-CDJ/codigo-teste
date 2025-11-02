"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Camera, User, Mail, Phone, Briefcase, LogOut, Eye, Plus, Trash2, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Projeto {
  id: number
  titulo: string
  descricao: string
  categoria: string
  status: string
  data: string
  tecnologias: string[]
  imagem: string
}

export default function AdminPage() {
  const router = useRouter()

  // Estados do Perfil
  const [nome, setNome] = useState("Renato Calixto")
  const [email, setEmail] = useState("renato@exemplo.com")
  const [telefone, setTelefone] = useState("(00) 00000-0000")
  const [bio, setBio] = useState("Desenvolvedor apaixonado por tecnologia, especializado em aplicações Web e jogos.")
  const [fotoPerfil, setFotoPerfil] = useState("/developer-profile.png")

  // Estados Sobre Mim
  const [servicoWeb, setServicoWeb] = useState(
    "Desenvolvimento de sites, sistemas e plataformas web modernas com foco em performance e experiência do usuário.",
  )
  const [servicoJogos, setServicoJogos] = useState(
    "Criação de jogos e experiências interativas, explorando mecânicas inovadoras e narrativas envolventes.",
  )
  const [servicoSolucoes, setServicoSolucoes] = useState(
    "Análise e desenvolvimento de soluções sob medida para atender necessidades específicas de cada projeto.",
  )

  // Estados Formação
  const [formacaoAcademica, setFormacaoAcademica] = useState(
    "Curso Superior de Tecnologia (CST) - Análise de Sistemas de Computação",
  )
  const [especializacoes, setEspecializacoes] = useState<string[]>([
    "Desenvolvimento Web",
    "Business Intelligence",
    "Big Data & Analytics",
    "Ciência de Dados",
    "Google Workspace",
    "Microsoft Office",
    "Sistemas Operacionais",
  ])
  const [tecnologias, setTecnologias] = useState<string[]>([
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "HTML/CSS",
    "Git",
    "SQL",
    "Python",
  ])

  // Estados Contato
  const [emailContato, setEmailContato] = useState("contato@renato.dev")
  const [github, setGithub] = useState("github.com/renato")
  const [linkedin, setLinkedin] = useState("linkedin.com/in/renato")

  // Estados Projetos
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [editandoProjeto, setEditandoProjeto] = useState<Projeto | null>(null)
  const [novoProjeto, setNovoProjeto] = useState<Partial<Projeto>>({
    titulo: "",
    descricao: "",
    categoria: "Web",
    status: "Concluído",
    data: "",
    tecnologias: [],
    imagem: "",
  })

  // Estados temporários para adicionar itens
  const [novaEspecializacao, setNovaEspecializacao] = useState("")
  const [novaTecnologia, setNovaTecnologia] = useState("")
  const [novaTecnologiaProjeto, setNovaTecnologiaProjeto] = useState("")

  useEffect(() => {
    const autenticado = localStorage.getItem("usuarioAutenticado")
    if (!autenticado) {
      router.push("/login")
      return
    }

    // Carregar dados salvos
    const dadosPerfil = localStorage.getItem("perfilAdmin")
    if (dadosPerfil) {
      const dados = JSON.parse(dadosPerfil)
      setNome(dados.nome || nome)
      setEmail(dados.email || email)
      setTelefone(dados.telefone || telefone)
      setBio(dados.bio || bio)
      setFotoPerfil(dados.fotoPerfil || fotoPerfil)
    }

    const dadosSobreMim = localStorage.getItem("sobreMimAdmin")
    if (dadosSobreMim) {
      const dados = JSON.parse(dadosSobreMim)
      setServicoWeb(dados.servicoWeb || servicoWeb)
      setServicoJogos(dados.servicoJogos || servicoJogos)
      setServicoSolucoes(dados.servicoSolucoes || servicoSolucoes)
    }

    const dadosFormacao = localStorage.getItem("formacaoAdmin")
    if (dadosFormacao) {
      const dados = JSON.parse(dadosFormacao)
      setFormacaoAcademica(dados.formacaoAcademica || formacaoAcademica)
      setEspecializacoes(dados.especializacoes || especializacoes)
      setTecnologias(dados.tecnologias || tecnologias)
    }

    const dadosContato = localStorage.getItem("contatoAdmin")
    if (dadosContato) {
      const dados = JSON.parse(dadosContato)
      setEmailContato(dados.emailContato || emailContato)
      setGithub(dados.github || github)
      setLinkedin(dados.linkedin || linkedin)
    }

    const dadosProjetos = localStorage.getItem("projetosAdmin")
    if (dadosProjetos) {
      setProjetos(JSON.parse(dadosProjetos))
    } else {
      // Projetos padrão
      const projetosIniciais = [
        {
          id: 1,
          titulo: "E-commerce Moderno",
          descricao:
            "Plataforma completa de e-commerce com carrinho de compras, pagamento integrado e painel administrativo.",
          categoria: "Web",
          status: "Concluído",
          data: "Janeiro 2025",
          tecnologias: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          imagem: "/modern-ecommerce-website.png",
        },
        {
          id: 2,
          titulo: "Dashboard Analytics",
          descricao: "Dashboard interativo para visualização de dados e métricas de negócio em tempo real.",
          categoria: "Web",
          status: "Concluído",
          data: "Dezembro 2024",
          tecnologias: ["React", "Chart.js", "Node.js", "PostgreSQL"],
          imagem: "/analytics-dashboard-dark-theme.png",
        },
        {
          id: 3,
          titulo: "Jogo de Aventura 2D",
          descricao: "Jogo de plataforma 2D com mecânicas de puzzle e narrativa envolvente.",
          categoria: "Jogos",
          status: "Em Desenvolvimento",
          data: "Em andamento",
          tecnologias: ["Unity", "C#", "Pixel Art"],
          imagem: "/2d-platformer-pixel-art.png",
        },
      ]
      setProjetos(projetosIniciais)
      localStorage.setItem("projetosAdmin", JSON.stringify(projetosIniciais))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("usuarioAutenticado")
    router.push("/login")
  }

  const handleSalvarPerfil = () => {
    const dados = { nome, email, telefone, bio, fotoPerfil }
    localStorage.setItem("perfilAdmin", JSON.stringify(dados))
    alert("Perfil atualizado com sucesso!")
  }

  const handleSalvarSobreMim = () => {
    const dados = { servicoWeb, servicoJogos, servicoSolucoes }
    localStorage.setItem("sobreMimAdmin", JSON.stringify(dados))
    alert("Seção 'Sobre Mim' atualizada com sucesso!")
  }

  const handleSalvarFormacao = () => {
    const dados = { formacaoAcademica, especializacoes, tecnologias }
    localStorage.setItem("formacaoAdmin", JSON.stringify(dados))
    alert("Formação & Competências atualizadas com sucesso!")
  }

  const handleSalvarContato = () => {
    const dados = { emailContato, github, linkedin }
    localStorage.setItem("contatoAdmin", JSON.stringify(dados))
    alert("Informações de contato atualizadas com sucesso!")
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

  const handleAdicionarEspecializacao = () => {
    if (novaEspecializacao.trim()) {
      setEspecializacoes([...especializacoes, novaEspecializacao.trim()])
      setNovaEspecializacao("")
    }
  }

  const handleRemoverEspecializacao = (index: number) => {
    setEspecializacoes(especializacoes.filter((_, i) => i !== index))
  }

  const handleAdicionarTecnologia = () => {
    if (novaTecnologia.trim()) {
      setTecnologias([...tecnologias, novaTecnologia.trim()])
      setNovaTecnologia("")
    }
  }

  const handleRemoverTecnologia = (index: number) => {
    setTecnologias(tecnologias.filter((_, i) => i !== index))
  }

  const handleAdicionarProjeto = () => {
    if (novoProjeto.titulo && novoProjeto.descricao) {
      const projeto: Projeto = {
        id: Date.now(),
        titulo: novoProjeto.titulo,
        descricao: novoProjeto.descricao,
        categoria: novoProjeto.categoria || "Web",
        status: novoProjeto.status || "Concluído",
        data: novoProjeto.data || new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        tecnologias: novoProjeto.tecnologias || [],
        imagem: novoProjeto.imagem || "/placeholder.svg",
      }
      const novosProjetos = [...projetos, projeto]
      setProjetos(novosProjetos)
      localStorage.setItem("projetosAdmin", JSON.stringify(novosProjetos))
      setNovoProjeto({
        titulo: "",
        descricao: "",
        categoria: "Web",
        status: "Concluído",
        data: "",
        tecnologias: [],
        imagem: "",
      })
      alert("Projeto adicionado com sucesso!")
    }
  }

  const handleRemoverProjeto = (id: number) => {
    if (confirm("Tem certeza que deseja remover este projeto?")) {
      const novosProjetos = projetos.filter((p) => p.id !== id)
      setProjetos(novosProjetos)
      localStorage.setItem("projetosAdmin", JSON.stringify(novosProjetos))
    }
  }

  const handleAdicionarTecnologiaProjeto = () => {
    if (novaTecnologiaProjeto.trim() && novoProjeto.tecnologias) {
      setNovoProjeto({
        ...novoProjeto,
        tecnologias: [...novoProjeto.tecnologias, novaTecnologiaProjeto.trim()],
      })
      setNovaTecnologiaProjeto("")
    }
  }

  const handleRemoverTecnologiaProjeto = (index: number) => {
    if (novoProjeto.tecnologias) {
      setNovoProjeto({
        ...novoProjeto,
        tecnologias: novoProjeto.tecnologias.filter((_, i) => i !== index),
      })
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
        <Tabs defaultValue="perfil" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900/80 border border-slate-700 mb-8">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="sobre">Sobre Mim</TabsTrigger>
            <TabsTrigger value="formacao">Formação</TabsTrigger>
            <TabsTrigger value="projetos">Projetos</TabsTrigger>
            <TabsTrigger value="contato">Contato</TabsTrigger>
          </TabsList>

          {/* Aba Perfil */}
          <TabsContent value="perfil">
            <Card className="bg-white/5 backdrop-blur-lg border border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Editar Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foto de Perfil */}
                <div className="flex flex-col items-center">
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

                <Button
                  onClick={handleSalvarPerfil}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Sobre Mim */}
          <TabsContent value="sobre">
            <Card className="bg-white/5 backdrop-blur-lg border border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Editar Seção Sobre Mim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-300 mb-2 font-medium block">Aplicações Web</label>
                  <textarea
                    value={servicoWeb}
                    onChange={(e) => setServicoWeb(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 mb-2 font-medium block">Desenvolvimento de Jogos</label>
                  <textarea
                    value={servicoJogos}
                    onChange={(e) => setServicoJogos(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 mb-2 font-medium block">Soluções Personalizadas</label>
                  <textarea
                    value={servicoSolucoes}
                    onChange={(e) => setServicoSolucoes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
                  />
                </div>

                <Button
                  onClick={handleSalvarSobreMim}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Formação */}
          <TabsContent value="formacao">
            <Card className="bg-white/5 backdrop-blur-lg border border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Editar Formação & Competências</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-300 mb-2 font-medium block">Formação Acadêmica</label>
                  <input
                    type="text"
                    value={formacaoAcademica}
                    onChange={(e) => setFormacaoAcademica(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-300 mb-2 font-medium block">Especializações</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={novaEspecializacao}
                      onChange={(e) => setNovaEspecializacao(e.target.value)}
                      placeholder="Nova especialização"
                      className="flex-1 px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                    <Button onClick={handleAdicionarEspecializacao} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {especializacoes.map((esp, index) => (
                      <Badge key={index} className="bg-blue-600/20 text-blue-300 border-blue-500/30 pr-1">
                        {esp}
                        <button onClick={() => handleRemoverEspecializacao(index)} className="ml-2 hover:text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 mb-2 font-medium block">Tecnologias</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={novaTecnologia}
                      onChange={(e) => setNovaTecnologia(e.target.value)}
                      placeholder="Nova tecnologia"
                      className="flex-1 px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                    <Button onClick={handleAdicionarTecnologia} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {tecnologias.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700"
                      >
                        <span className="text-slate-300 text-sm">{tech}</span>
                        <button
                          onClick={() => handleRemoverTecnologia(index)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSalvarFormacao}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Projetos */}
          <TabsContent value="projetos">
            <div className="space-y-6">
              {/* Adicionar Novo Projeto */}
              <Card className="bg-white/5 backdrop-blur-lg border border-slate-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Adicionar Novo Projeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 mb-2 font-medium block">Título</label>
                      <input
                        type="text"
                        value={novoProjeto.titulo}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, titulo: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 mb-2 font-medium block">Data</label>
                      <input
                        type="text"
                        value={novoProjeto.data}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, data: e.target.value })}
                        placeholder="Ex: Janeiro 2025"
                        className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 mb-2 font-medium block">Descrição</label>
                    <textarea
                      value={novoProjeto.descricao}
                      onChange={(e) => setNovoProjeto({ ...novoProjeto, descricao: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-300 mb-2 font-medium block">Categoria</label>
                      <select
                        value={novoProjeto.categoria}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, categoria: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Web">Web</option>
                        <option value="Jogos">Jogos</option>
                        <option value="Sistema">Sistema</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 mb-2 font-medium block">Status</label>
                      <select
                        value={novoProjeto.status}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, status: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Concluído">Concluído</option>
                        <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 mb-2 font-medium block">URL da Imagem</label>
                      <input
                        type="text"
                        value={novoProjeto.imagem}
                        onChange={(e) => setNovoProjeto({ ...novoProjeto, imagem: e.target.value })}
                        placeholder="/caminho/imagem.png"
                        className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 mb-2 font-medium block">Tecnologias</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={novaTecnologiaProjeto}
                        onChange={(e) => setNovaTecnologiaProjeto(e.target.value)}
                        placeholder="Adicionar tecnologia"
                        className="flex-1 px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                      />
                      <Button
                        onClick={handleAdicionarTecnologiaProjeto}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {novoProjeto.tecnologias?.map((tech, index) => (
                        <Badge key={index} className="bg-slate-800 text-slate-300 border-slate-700 pr-1">
                          {tech}
                          <button
                            onClick={() => handleRemoverTecnologiaProjeto(index)}
                            className="ml-2 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAdicionarProjeto}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Projeto
                  </Button>
                </CardContent>
              </Card>

              {/* Lista de Projetos */}
              <Card className="bg-white/5 backdrop-blur-lg border border-slate-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Projetos Cadastrados ({projetos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projetos.map((projeto) => (
                      <div key={projeto.id} className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-white">{projeto.titulo}</h3>
                              <Badge
                                variant={projeto.status === "Concluído" ? "default" : "secondary"}
                                className={projeto.status === "Concluído" ? "bg-green-600" : "bg-amber-600"}
                              >
                                {projeto.status}
                              </Badge>
                              <Badge variant="outline" className="border-slate-600 text-slate-400">
                                {projeto.categoria}
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-sm mb-2">{projeto.descricao}</p>
                            <p className="text-slate-500 text-xs mb-2">{projeto.data}</p>
                            <div className="flex flex-wrap gap-1">
                              {projeto.tecnologias.map((tech, i) => (
                                <Badge key={i} variant="secondary" className="text-xs bg-slate-800 text-slate-300">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button onClick={() => handleRemoverProjeto(projeto.id)} variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Contato */}
          <TabsContent value="contato">
            <Card className="bg-white/5 backdrop-blur-lg border border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Editar Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-slate-300 mb-2 font-medium">
                    <Mail className="w-4 h-4" />
                    Email de Contato
                  </label>
                  <input
                    type="email"
                    value={emailContato}
                    onChange={(e) => setEmailContato(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-300 mb-2 font-medium block">GitHub</label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="github.com/usuario"
                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-300 mb-2 font-medium block">LinkedIn</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="linkedin.com/in/usuario"
                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>

                <Button
                  onClick={handleSalvarContato}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
