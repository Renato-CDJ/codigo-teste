import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, Gamepad2, Globe, ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            Renato<span className="text-cyan-400">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#sobre" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Sobre
            </Link>
            <Link href="#projetos" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Projetos
            </Link>
            <Link href="#formacao" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Formação
            </Link>
            <Link href="/cliente">
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 bg-transparent"
              >
                Área do Cliente
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative py-20 md:py-32 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl">
            <p className="text-cyan-400 font-medium mb-4">Olá, eu sou</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Renato
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed text-pretty">
              Desenvolvedor apaixonado por tecnologia, especializado em{" "}
              <span className="text-cyan-400 font-semibold">aplicações Web</span> e{" "}
              <span className="text-blue-400 font-semibold">desenvolvimento de jogos</span>. Transformo ideias em
              experiências digitais funcionais e envolventes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/cliente">
                <Button
                  size="lg"
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                >
                  Ver Projetos <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#contato">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 bg-transparent"
                >
                  Entre em Contato
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">Sobre Mim</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Aplicações Web</h3>
                <p className="text-slate-300 leading-relaxed">
                  Desenvolvimento de sites, sistemas e plataformas web modernas com foco em performance e experiência do
                  usuário.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Desenvolvimento de Jogos</h3>
                <p className="text-slate-300 leading-relaxed">
                  Criação de jogos e experiências interativas, explorando mecânicas inovadoras e narrativas envolventes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Soluções Personalizadas</h3>
                <p className="text-slate-300 leading-relaxed">
                  Análise e desenvolvimento de soluções sob medida para atender necessidades específicas de cada
                  projeto.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="formacao" className="py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">Formação & Competências</h2>

          <div className="max-w-3xl space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Formação Acadêmica</h3>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                    <div>
                      <h4 className="font-semibold text-white">Curso Superior de Tecnologia (CST)</h4>
                      <p className="text-slate-300">Análise de Sistemas de Computação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Especializações</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border-blue-500/30">
                  Desenvolvimento Web
                </Badge>
                <Badge className="bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border-indigo-500/30">
                  Business Intelligence
                </Badge>
                <Badge className="bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border-cyan-500/30">
                  Big Data & Analytics
                </Badge>
                <Badge className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border-blue-500/30">
                  Ciência de Dados
                </Badge>
                <Badge className="bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border-indigo-500/30">
                  Google Workspace
                </Badge>
                <Badge className="bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border-cyan-500/30">
                  Microsoft Office
                </Badge>
                <Badge className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border-blue-500/30">
                  Sistemas Operacionais
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Tecnologias</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "HTML/CSS", "Git", "SQL", "Python"].map(
                  (tech) => (
                    <div key={tech} className="flex items-center gap-2 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{tech}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projetos" className="bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Projetos em Destaque</h2>
            <Link href="/cliente">
              <Button variant="ghost" className="gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10">
                Ver Todos <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { color: "blue", gradient: "from-blue-400 to-blue-600" },
              { color: "indigo", gradient: "from-indigo-400 to-indigo-600" },
              { color: "cyan", gradient: "from-cyan-400 to-cyan-600" },
            ].map((item, i) => (
              <Card
                key={i}
                className="overflow-hidden group hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 bg-slate-800/50 border-slate-700"
              >
                <div className={`aspect-video bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <div className="text-white text-6xl font-bold opacity-20">{i + 1}</div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Projeto {i + 1}</h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    Descrição do projeto desenvolvido com tecnologias modernas.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                      React
                    </Badge>
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
                      Next.js
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 border-0 shadow-2xl shadow-blue-600/30">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-white">
                Pronto para iniciar seu projeto?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto text-pretty">
                Entre em contato para discutirmos como posso ajudar a transformar sua ideia em realidade.
              </p>
              <Link href="/cliente/solicitar">
                <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                  Solicitar Projeto <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contato" className="bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Entre em Contato</h2>
          <div className="max-w-md mx-auto space-y-4">
            <Card className="hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="font-medium text-white">contato@renato.dev</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">GitHub</p>
                    <p className="font-medium text-white">github.com/renato</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Linkedin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">LinkedIn</p>
                    <p className="font-medium text-white">linkedin.com/in/renato</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>© 2025 Renato. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
