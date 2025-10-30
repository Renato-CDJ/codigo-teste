// Core types for the call center script system

export type UserRole = "operator" | "admin"

export interface User {
  id: string
  username: string
  fullName: string
  role: UserRole
  isOnline: boolean
  createdAt: Date
  lastLoginAt?: Date
  loginSessions?: LoginSession[]
}

export interface LoginSession {
  id: string
  loginAt: Date
  logoutAt?: Date
  duration?: number // in milliseconds
}

export interface ScriptStep {
  id: string
  title: string
  content: string
  order: number
  buttons: ScriptButton[]
  createdAt: Date
  updatedAt: Date
  productId?: string // Added productId to track which product this step belongs to
  tabulations?: Array<{
    id: string
    name: string
    description: string
  }> // Changed from single tabulationInfo to array of tabulations
  contentSegments?: ContentSegment[]
  formatting?: {
    textColor?: string
    bold?: boolean
    italic?: boolean
    textAlign?: "left" | "center" | "right" | "justify"
  }
  alert?: {
    title: string // Added title field to alert object for customizable alert titles
    message: string
    createdAt: Date
  }
}

export interface ContentSegment {
  id: string
  text: string
  formatting: {
    bold?: boolean
    italic?: boolean
    color?: string
    backgroundColor?: string
    fontSize?: "sm" | "base" | "lg" | "xl"
  }
}

export interface ScriptButton {
  id: string
  label: string
  nextStepId: string | null // null means end of script
  variant: "default" | "primary" | "secondary" | "destructive"
  order: number
  primary?: boolean
}

export interface Tabulation {
  id: string
  name: string
  description: string
  color: string
  createdAt: Date
}

export interface ServiceSituation {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: Date
  expanded?: boolean // Added expanded state for accordion-style display
}

export interface Channel {
  id: string
  name: string
  contact: string // Changed from icon to contact (number or link)
  isActive: boolean
  createdAt: Date
}

export interface Note {
  id: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  title: string
  content: string
  createdBy: string // admin user id
  createdByName: string // admin user name
  createdAt: Date
  isActive: boolean
  seenBy: string[] // array of operator user ids who have seen this message
  recipients: string[] // array of operator user ids, empty array means all operators
}

export interface Quiz {
  id: string
  question: string
  options: QuizOption[]
  correctAnswer: string // id of the correct option
  createdBy: string // admin user id
  createdByName: string // admin user name
  createdAt: Date
  isActive: boolean
  scheduledDate?: Date // optional date for when quiz should become active
}

export interface QuizOption {
  id: string
  label: string // a, b, c, d
  text: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  operatorId: string
  operatorName: string
  selectedAnswer: string // id of the selected option
  isCorrect: boolean
  attemptedAt: Date
}

export interface CallSession {
  id: string
  operatorId: string
  currentStepId: string
  startedAt: Date
  tabulationId?: string
  situationId?: string
  channelId?: string
  notes: string[]
}

export interface AttendanceConfig {
  attendanceType: "ativo" | "receptivo"
  personType: "fisica" | "juridica"
  product: string
}

export interface Product {
  id: string
  name: string
  scriptId: string // Links to the first step of the script for this product
  category: "habitacional" | "comercial" | "outros"
  isActive: boolean
  createdAt: Date
  attendanceTypes?: ("ativo" | "receptivo")[]
  personTypes?: ("fisica" | "juridica")[]
  description?: string // Added description field for hover tooltip
}
