import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Calendar, Plus } from "lucide-react"
import Link from "next/link"

// Mock data para projetos
const projetos = [
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
  {
    id: 4,
    titulo: "Sistema de Gestão",
    descricao: "Sistema completo para gestão de clientes, projetos e finanças para pequenas empresas.",
    categoria: "Sistema",
    status: "Concluído",
    data: "Novembro 2024",
    tecnologias: ["Vue.js", "Express", "MongoDB", "Docker"],
    imagem: "/business-management-system-interface.jpg",
  },
  {
    id: 5,
    titulo: "App Mobile Fitness",
    descricao: "Aplicativo mobile para acompanhamento de treinos e nutrição com sincronização em nuvem.",
    categoria: "Mobile",
    status: "Concluído",
    data: "Outubro 2024",
    tecnologias: ["React Native", "Firebase", "Redux"],
    imagem: "/fitness-app-interface.png",
  },
  {
    id: 6,
    titulo: "Jogo Multiplayer Online",
    descricao: "Jogo multiplayer competitivo com sistema de ranking e matchmaking.",
    categoria: "Jogos",
    status: "Em Desenvolvimento",
    data: "Em andamento",
    tecnologias: ["Unreal Engine", "C++", "WebSockets"],
    imagem: "/multiplayer-online-game-interface.jpg",
  },
]

export default function ClientePage() {
  const categorias = ["Todos", "Web", "Jogos", "Sistema", "Mobile"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Portfólio
          </Link>
          <Link href="/cliente/solicitar">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              Solicitar Projeto
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-800 bg-slate-900/30">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Área do Cliente</h1>
          <p className="text-lg text-slate-400 max-w-2xl text-pretty">
            Explore meus projetos desenvolvidos e veja como posso ajudar a transformar sua ideia em realidade.
          </p>
        </div>
      </section>

      {/* Projetos Section */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="Todos" className="w-full">
          <TabsList className="mb-8 bg-slate-900/80 border border-slate-800 p-1">
            {categorias.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categorias.map((categoria) => (
            <TabsContent key={categoria} value={categoria} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projetos
                  .filter((p) => categoria === "Todos" || p.categoria === categoria)
                  .map((projeto) => (
                    <Card
                      key={projeto.id}
                      className="overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:-translate-y-1"
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-50" />
                        <img
                          src={projeto.imagem || "/placeholder.svg"}
                          alt={projeto.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge
                            variant={projeto.status === "Concluído" ? "default" : "secondary"}
                            className={
                              projeto.status === "Concluído" ? "bg-green-600 text-white" : "bg-amber-600 text-white"
                            }
                          >
                            {projeto.status}
                          </Badge>
                          <Badge variant="outline" className="border-slate-700 text-slate-400">
                            {projeto.categoria}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-white">{projeto.titulo}</CardTitle>
                        <CardDescription className="leading-relaxed text-slate-400">
                          {projeto.descricao}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span>{projeto.data}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {projeto.tecnologias.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="text-xs bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full gap-2 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all"
                          size="sm"
                        >
                          Ver Detalhes <ExternalLink className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800 bg-slate-900/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Tem um projeto em mente?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-pretty">
            Solicite o desenvolvimento do seu site, sistema ou plataforma. Analisarei sua proposta e entrarei em contato
            para discutirmos os detalhes.
          </p>
          <Link href="/cliente/solicitar">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transition-all">
              <Plus className="w-4 h-4" />
              Solicitar Novo Projeto
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950/50">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2025 Renato. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
