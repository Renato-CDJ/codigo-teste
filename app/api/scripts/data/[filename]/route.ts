import { type NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const { filename } = params

    // Security: only allow specific JSON files
    const allowedFiles = ["comercial.json", "hab532.json", "habitacional-script.json"]

    if (!allowedFiles.includes(filename)) {
      return NextResponse.json({ error: "Arquivo não permitido" }, { status: 403 })
    }

    // Read the file from the data directory
    const filePath = join(process.cwd(), "data", filename)
    const fileContent = readFileSync(filePath, "utf-8")
    const jsonData = JSON.parse(fileContent)

    return NextResponse.json(jsonData)
  } catch (error) {
    console.error("[v0] Error reading JSON file:", error)
    return NextResponse.json({ error: "Arquivo não encontrado ou erro ao ler" }, { status: 404 })
  }
}
