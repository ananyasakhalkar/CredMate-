"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, ChevronLeft, ChevronRight } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { PandaMascot } from "@/components/panda-mascot"
import { getTranslation } from "@/lib/translations"
import { motion, AnimatePresence } from "framer-motion"

const demoSteps = [
  {
    title: "Welcome to VirtualBanker",
    description:
      "Our AI-powered Branch Manager guides you through the entire loan application process with video conversations instead of forms.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Personal Information",
    description:
      "Record video responses to provide your personal information. Our facial verification ensures security throughout the process.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Loan Details",
    description:
      "Explain your loan requirements and financial situation through video. It's more natural than filling out complex forms.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Document Upload",
    description: "Easily upload required documents with guided assistance from our virtual branch manager.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Application Review",
    description: "Get real-time feedback on your application and track its progress through our dashboard.",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [language, setLanguage] = useState("en")
  const [showPandaTip, setShowPandaTip] = useState(true)

  // Hide panda tip after 5 seconds
  useEffect(() => {
    const tipTimer = setTimeout(() => {
      setShowPandaTip(false)
    }, 5000)

    return () => clearTimeout(tipTimer)
  }, [])

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, demoSteps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const getPandaMessage = (step: number) => {
    switch (step) {
      case 0:
        return language === "es"
          ? "¡Hola! Soy BankPanda. Te mostraré cómo funciona nuestro sistema de solicitud de préstamos."
          : "Hi there! I'm BankPanda. I'll show you how our loan application system works."
      case 1:
        return language === "es"
          ? "Puedes proporcionar tu información personal a través de video. ¡Es más fácil que llenar formularios!"
          : "You can provide your personal information through video. It's easier than filling out forms!"
      case 2:
        return language === "es"
          ? "Explica tus necesidades de préstamo de manera natural, como si hablaras con un gerente real."
          : "Explain your loan needs naturally, just as if you were talking to a real manager."
      case 3:
        return language === "es"
          ? "Subir documentos es muy sencillo. Te guiaré en cada paso del proceso."
          : "Uploading documents is very simple. I'll guide you through each step of the process."
      case 4:
        return language === "es"
          ? "Revisaremos tu solicitud juntos y te mantendré informado sobre su progreso."
          : "We'll review your application together and I'll keep you informed about its progress."
      default:
        return language === "es"
          ? "¿Tienes alguna pregunta sobre el proceso?"
          : "Do you have any questions about the process?"
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#f8f9fa] to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#007a33]">
            <Building2 className="h-6 w-6" />
            <span>{getTranslation("app.name", language)}</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector onLanguageChange={handleLanguageChange} />
            <Link href="/apply">
              <Button className="bg-[#007a33] hover:bg-[#006128] shadow-md">
                {getTranslation("home.startApplication", language)}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#002147]">Product Demo</h1>
            <p className="text-muted-foreground mt-2">
              See how our AI-powered Branch Manager works to simplify your loan application process.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video bg-gradient-to-br from-[#f8f9fa] to-white relative">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={demoSteps[currentStep].image || "/placeholder.svg"}
                        alt={demoSteps[currentStep].title}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                    <div className="absolute top-3 left-3">
                      <PandaMascot
                        size="small"
                        position="top-left"
                        language={language}
                        welcomeMessage={getPandaMessage(currentStep)}
                      />

                      {/* Tooltip */}
                      {showPandaTip && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute left-16 top-2 bg-white p-2 rounded-lg shadow-md text-xs w-40 border border-[#007a33]/20"
                        >
                          Click me for assistance!
                          <div className="absolute left-[-6px] top-3 w-3 h-3 bg-white transform rotate-45 border-l border-b border-[#007a33]/20"></div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col bg-white">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1"
                      >
                        <h2 className="text-2xl font-bold mb-4 text-[#002147]">{demoSteps[currentStep].title}</h2>
                        <p className="text-muted-foreground">{demoSteps[currentStep].description}</p>
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center justify-between mt-8">
                      <div className="text-sm text-muted-foreground">
                        Step {currentStep + 1} of {demoSteps.length}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={prevStep}
                          disabled={currentStep === 0}
                          className="border-[#002147] text-[#002147] hover:bg-[#002147]/10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={nextStep}
                          disabled={currentStep === demoSteps.length - 1}
                          className="border-[#002147] text-[#002147] hover:bg-[#002147]/10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">Ready to experience it yourself?</p>
            <Link href="/apply">
              <Button size="lg" className="bg-[#007a33] hover:bg-[#006128] shadow-md">
                {getTranslation("home.startApplication", language)}
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <footer className="border-t py-8 bg-[#002147] text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-[20%] w-[30%] h-[50%] rounded-full bg-[#007a33]/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-[20%] w-[30%] h-[50%] rounded-full bg-[#00a3e0]/10 blur-3xl"></div>
        </div>

        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
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

