"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, FileCheck, Shield, Video, ChevronDown } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { getTranslation } from "@/lib/translations"
import { PandaMascot } from "@/components/panda-mascot"
import { motion } from "framer-motion"

export default function Home() {
  const [language, setLanguage] = useState("en")
  const [scrolled, setScrolled] = useState(false)
  const [showPandaTip, setShowPandaTip] = useState(true)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    // Show panda tip for 5 seconds
    const tipTimer = setTimeout(() => {
      setShowPandaTip(false)
    }, 5000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(tipTimer)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white overflow-x-hidden">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-[#007a33]">
            <Building2 className="h-6 w-6" />
            <span>{getTranslation("app.name", language)}</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-sm font-medium hover:text-[#007a33] transition-colors">
              {getTranslation("nav.about", language)}
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#007a33] transition-colors">
              {getTranslation("nav.products", language)}
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#007a33] transition-colors">
              {getTranslation("nav.support", language)}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSelector onLanguageChange={setLanguage} />
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-[#002147] text-[#002147] hover:bg-[#002147]/10">
                {getTranslation("nav.login", language)}
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="sm" className="bg-[#007a33] hover:bg-[#006128] shadow-md">
                {getTranslation("nav.apply", language)}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#f8f9fa] to-white"></div>
            <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#007a33]/5 blur-3xl"></div>
            <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#00a3e0]/5 blur-3xl"></div>
          </div>

          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center space-y-6"
              >
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl text-[#002147]">
                    {getTranslation("app.tagline", language)}
                  </h1>
                  <p className="text-muted-foreground text-lg md:text-xl/relaxed max-w-[600px]">
                    {getTranslation("app.description", language)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/apply">
                    <Button size="lg" className="gap-1.5 bg-[#007a33] hover:bg-[#006128] shadow-lg">
                      {getTranslation("home.startApplication", language)}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#002147] text-[#002147] hover:bg-[#002147]/10"
                    >
                      {getTranslation("home.watchDemo", language)}
                    </Button>
                  </Link>
                </div>

                {/* Tiny panda in corner */}
                <div className="relative h-10 w-10 self-start mt-4">
                  <PandaMascot
                    size="tiny"
                    position="top-left"
                    language={language}
                    welcomeMessage={
                      language === "es"
                        ? "¡Hola! Soy BankPanda. Haz clic en mí para obtener ayuda con tu solicitud de préstamo."
                        : "Hi! I'm BankPanda. Click on me for help with your loan application."
                    }
                  />

                  {/* Tooltip */}
                  {showPandaTip && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-12 top-0 bg-white p-2 rounded-lg shadow-md text-xs w-40 border border-[#007a33]/20"
                    >
                      Click me for assistance!
                      <div className="absolute left-[-6px] top-3 w-3 h-3 bg-white transform rotate-45 border-l border-b border-[#007a33]/20"></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mx-auto w-full max-w-[500px] aspect-video rounded-xl overflow-hidden border shadow-xl bg-white"
              >
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-white">
                  <img
                    src="/placeholder.svg?height=500&width=800"
                    alt="Virtual Branch Manager Interface"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>

                {/* Large panda mascot centered on the hero image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <PandaMascot
                    size="large"
                    position="center"
                    language={language}
                    welcomeMessage={
                      language === "es"
                        ? "¡Hola! Soy BankPanda. Puedo ayudarte con tu solicitud de préstamo de manera fácil y rápida."
                        : "Hi! I'm BankPanda. I can help you with your loan application in an easy and quick way."
                    }
                  />
                </div>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            >
              <span className="text-sm text-muted-foreground mb-2">Scroll to learn more</span>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                <ChevronDown className="h-6 w-6 text-[#007a33]" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 lg:py-32 bg-white relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#007a33]/5 blur-3xl"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-[#00a3e0]/5 blur-3xl"></div>
          </div>

          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <div className="space-y-2 max-w-[800px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#002147]">
                  {getTranslation("home.howItWorks", language)}
                </h2>
                <p className="mx-auto text-muted-foreground text-lg md:text-xl/relaxed">
                  {getTranslation("home.howItWorks.description", language)}
                </p>
              </div>
            </motion.div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: <Video className="h-8 w-8 text-[#00a3e0]" />,
                  title: getTranslation("home.feature1.title", language),
                  description: getTranslation("home.feature1.description", language),
                  color: "bg-[#00a3e0]",
                },
                {
                  icon: <FileCheck className="h-8 w-8 text-[#007a33]" />,
                  title: getTranslation("home.feature2.title", language),
                  description: getTranslation("home.feature2.description", language),
                  color: "bg-[#007a33]",
                },
                {
                  icon: <Shield className="h-8 w-8 text-[#002147]" />,
                  title: getTranslation("home.feature3.title", language),
                  description: getTranslation("home.feature3.description", language),
                  color: "bg-[#002147]",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center space-y-4 text-center group"
                >
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${feature.color}/10 group-hover:${feature.color}/20 transition-colors duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#002147]">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-[#002147] text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-[20%] w-[30%] h-[50%] rounded-full bg-[#007a33]/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-[20%] w-[30%] h-[50%] rounded-full bg-[#00a3e0]/10 blur-3xl"></div>
        </div>

        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <Building2 className="h-6 w-6" />
              <span>{getTranslation("app.name", language)}</span>
            </div>
            <p className="text-sm text-white/70">
              &copy; {new Date().getFullYear()} {getTranslation("app.name", language)}.{" "}
              {getTranslation("footer.rights", language)}
            </p>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-white/90">Company</h4>
              <div className="flex flex-col gap-1">
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  About
                </Link>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  Careers
                </Link>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  Press
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-white/90">Legal</h4>
              <div className="flex flex-col gap-1">
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  {getTranslation("footer.terms", language)}
                </Link>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  {getTranslation("footer.privacy", language)}
                </Link>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  {getTranslation("footer.security", language)}
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-white/90">Support</h4>
              <div className="flex flex-col gap-1">
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  Help Center
                </Link>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  {getTranslation("footer.contact", language)}
                </Link>
                <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
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

