"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Loader2 } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { PandaMascot } from "@/components/panda-mascot"
import { getTranslation } from "@/lib/translations"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [language, setLanguage] = useState("en")
  const [showPandaTip, setShowPandaTip] = useState(true)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, you would redirect after successful login
    }, 2000)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  // Hide panda tip after 5 seconds
  useState(() => {
    const tipTimer = setTimeout(() => {
      setShowPandaTip(false)
    }, 5000)

    return () => clearTimeout(tipTimer)
  })

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f8f9fa] via-white to-[#f8f9fa]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#007a33]">
            <Building2 className="h-6 w-6" />
            <span>{getTranslation("app.name", language)}</span>
          </Link>
          <LanguageSelector onLanguageChange={handleLanguageChange} />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 relative">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#007a33]/5 blur-3xl"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-[#00a3e0]/5 blur-3xl"></div>
        </div>

        <div className="container max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-none shadow-lg overflow-hidden">
              <CardHeader className="space-y-1 bg-gradient-to-r from-[#f8f9fa] to-white border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-[#002147]">
                    {getTranslation("login.title", language)}
                  </CardTitle>

                  {/* Add Panda Mascot */}
                  <div className="relative">
                    <PandaMascot
                      size="tiny"
                      language={language}
                      welcomeMessage={
                        language === "es"
                          ? "¡Bienvenido de nuevo! Ingresa tus credenciales para acceder a tu cuenta."
                          : "Welcome back! Enter your credentials to access your account."
                      }
                    />

                    {/* Tooltip */}
                    {showPandaTip && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-10 top-0 bg-white p-2 rounded-lg shadow-md text-xs w-40 border border-[#007a33]/20"
                      >
                        Need help logging in?
                        <div className="absolute right-[-6px] top-3 w-3 h-3 bg-white transform rotate-45 border-r border-t border-[#007a33]/20"></div>
                      </motion.div>
                    )}
                  </div>
                </div>
                <CardDescription>{getTranslation("login.description", language)}</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">{getTranslation("login.email", language)}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-[#002147]/20 focus:border-[#007a33] focus:ring-[#007a33]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{getTranslation("login.password", language)}</Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-[#00a3e0] hover:text-[#007a33] transition-colors"
                      >
                        {getTranslation("login.forgotPassword", language)}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-[#002147]/20 focus:border-[#007a33] focus:ring-[#007a33]/20"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-[#007a33] hover:bg-[#006128] shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {getTranslation("login.signingIn", language)}
                      </>
                    ) : (
                      getTranslation("login.signIn", language)
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    {getTranslation("login.noAccount", language)}{" "}
                    <Link href="/register" className="text-[#00a3e0] hover:text-[#007a33] transition-colors">
                      {getTranslation("login.signUp", language)}
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>

      <footer className="border-t py-8 bg-[#002147] text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-[20%] w-[30%] h-[50%] rounded-full bg-[#007a33]/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-[20%] w-[30%] h-[50%] rounded-full bg-[#00a3e0]/10 blur-3xl"></div>
        </div>

        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {getTranslation("app.name", language)}.{" "}
            {getTranslation("footer.rights", language)}
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="#" className="hover:underline text-white/80 hover:text-white transition-colors">
              {getTranslation("footer.terms", language)}
            </Link>
            <Link href="#" className="hover:underline text-white/80 hover:text-white transition-colors">
              {getTranslation("footer.privacy", language)}
            </Link>
            <Link href="#" className="hover:underline text-white/80 hover:text-white transition-colors">
              {getTranslation("footer.security", language)}
            </Link>
          </div>

          {/* Tiny panda in footer */}
          <div className="absolute bottom-4 right-4">
            <PandaMascot
              size="tiny"
              language={language}
              welcomeMessage={
                language === "es"
                  ? "¿Necesitas más ayuda? ¡Estoy aquí para asistirte!"
                  : "Need more help? I'm here to assist you!"
              }
            />
          </div>
        </div>
      </footer>
    </div>
  )
}

