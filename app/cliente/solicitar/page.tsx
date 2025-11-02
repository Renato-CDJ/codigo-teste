"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SolicitarProjetoPage() {
  const [enviado, setEnviado] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    tipoProjeto: "",
    categoria: "",
    descricao: "",
    prazo: "",
    orcamento: "",
    funcionalidades: [] as string[],
    referencia: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria a integração com backend
    console.log("Dados do formulário:", formData)
    setEnviado(true)

    // Simular envio
    setTimeout(() => {
      setEnviado(false)
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        empresa: "",
        tipoProjeto: "",
        categoria: "",
        descricao: "",
        prazo: "",
        orcamento: "",
        funcionalidades: [],
        referencia: "",
      })
    }, 3000)
  }

  const handleFuncionalidadeChange = (funcionalidade: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      funcionalidades: checked
        ? [...prev.funcionalidades, funcionalidade]
        : prev.funcionalidades.filter((f) => f !== funcionalidade),
    }))
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-xl border-blue-100">
          <CardContent className="pt-12 pb-12">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Solicitação Enviada!</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Obrigado pelo seu interesse! Analisarei sua solicitação e entrarei em contato em breve para discutirmos os
              detalhes do projeto.
            </p>
            <Link href="/cliente">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4" />
                Voltar para Projetos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/cliente"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Projetos
          </Link>
        </div>
      </header>

      {/* Form Section */}
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Solicitar Novo Projeto</h1>
          <p className="text-lg text-slate-600 text-pretty">
            Preencha o formulário abaixo com os detalhes do seu projeto. Quanto mais informações você fornecer, melhor
            poderei entender suas necessidades.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações de Contato */}
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-slate-900">Informações de Contato</CardTitle>
              <CardDescription className="text-slate-600">Como posso entrar em contato com você?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-slate-700">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-slate-700">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa" className="text-slate-700">
                    Empresa
                  </Label>
                  <Input
                    id="empresa"
                    placeholder="Nome da empresa (opcional)"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Projeto */}
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-slate-900">Detalhes do Projeto</CardTitle>
              <CardDescription className="text-slate-600">Conte-me sobre o que você precisa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700">
                  Tipo de Projeto <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  required
                  value={formData.tipoProjeto}
                  onValueChange={(value) => setFormData({ ...formData, tipoProjeto: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="site" id="site" className="border-slate-300 text-blue-600" />
                    <Label htmlFor="site" className="font-normal cursor-pointer text-slate-700">
                      Site / Landing Page
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sistema" id="sistema" className="border-slate-300 text-blue-600" />
                    <Label htmlFor="sistema" className="font-normal cursor-pointer text-slate-700">
                      Sistema Web
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="plataforma" id="plataforma" className="border-slate-300 text-blue-600" />
                    <Label htmlFor="plataforma" className="font-normal cursor-pointer text-slate-700">
                      Plataforma / SaaS
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ecommerce" id="ecommerce" className="border-slate-300 text-blue-600" />
                    <Label htmlFor="ecommerce" className="font-normal cursor-pointer text-slate-700">
                      E-commerce
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outro" id="outro" className="border-slate-300 text-blue-600" />
                    <Label htmlFor="outro" className="font-normal cursor-pointer text-slate-700">
                      Outro
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-slate-700">
                  Categoria <span className="text-red-500">*</span>
                </Label>
                <Select
                  required
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger id="categoria" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporativo">Corporativo / Empresarial</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="ecommerce">E-commerce / Varejo</SelectItem>
                    <SelectItem value="entretenimento">Entretenimento</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-slate-700">
                  Descrição do Projeto <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva seu projeto, objetivos, público-alvo e qualquer informação relevante..."
                  className="min-h-32 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Funcionalidades Desejadas</Label>
                <div className="space-y-2">
                  {[
                    "Sistema de Login/Cadastro",
                    "Painel Administrativo",
                    "Integração com Pagamentos",
                    "Blog/Notícias",
                    "Formulários de Contato",
                    "Chat/Suporte",
                    "API/Integrações",
                    "Área de Membros",
                  ].map((func) => (
                    <div key={func} className="flex items-center space-x-2">
                      <Checkbox
                        id={func}
                        checked={formData.funcionalidades.includes(func)}
                        onCheckedChange={(checked) => handleFuncionalidadeChange(func, checked as boolean)}
                        className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={func} className="font-normal cursor-pointer text-slate-700">
                        {func}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referencia" className="text-slate-700">
                  Sites/Sistemas de Referência
                </Label>
                <Textarea
                  id="referencia"
                  placeholder="Cole links de sites ou sistemas que você gosta e gostaria de usar como referência..."
                  className="min-h-24 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  value={formData.referencia}
                  onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Prazo e Orçamento */}
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-slate-900">Prazo e Orçamento</CardTitle>
              <CardDescription className="text-slate-600">Informações sobre cronograma e investimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prazo" className="text-slate-700">
                    Prazo Desejado
                  </Label>
                  <Select value={formData.prazo} onValueChange={(value) => setFormData({ ...formData, prazo: value })}>
                    <SelectTrigger id="prazo" className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Selecione um prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgente">Urgente (1-2 semanas)</SelectItem>
                      <SelectItem value="rapido">Rápido (3-4 semanas)</SelectItem>
                      <SelectItem value="normal">Normal (1-2 meses)</SelectItem>
                      <SelectItem value="flexivel">Flexível (2+ meses)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orcamento" className="text-slate-700">
                    Orçamento Estimado
                  </Label>
                  <Select
                    value={formData.orcamento}
                    onValueChange={(value) => setFormData({ ...formData, orcamento: value })}
                  >
                    <SelectTrigger
                      id="orcamento"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <SelectValue placeholder="Selecione uma faixa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate-5k">Até R$ 5.000</SelectItem>
                      <SelectItem value="5k-10k">R$ 5.000 - R$ 10.000</SelectItem>
                      <SelectItem value="10k-20k">R$ 10.000 - R$ 20.000</SelectItem>
                      <SelectItem value="20k-mais">Acima de R$ 20.000</SelectItem>
                      <SelectItem value="negociar">A negociar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link href="/cliente" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
              >
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
              Enviar Solicitação
            </Button>
          </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-12 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>© 2025 Renato. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
