"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Building2, Loader2 } from "lucide-react"
import { VideoRecorder } from "@/components/video-recorder"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentProcessor } from "@/components/document-processor"
import { FinancialAdvice } from "@/components/financial-advice"
import { LoanCalculator } from "@/components/loan-calculator"
import { LanguageSelector } from "@/components/language-selector"
import { PandaMascot } from "@/components/panda-mascot"
import { getTranslation } from "@/lib/translations"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  { id: 1, name: "step.introduction" },
  { id: 2, name: "step.personalInfo" },
  { id: 3, name: "step.loanDetails" },
  { id: 4, name: "step.documents" },
  { id: 5, name: "step.review" },
]

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [videoResponses, setVideoResponses] = useState<Record<number, string>>({})
  const [documents, setDocuments] = useState<{ name: string; url: string }[]>([])
  const [processedDocuments, setProcessedDocuments] = useState<any[]>([])
  const [language, setLanguage] = useState("en")
  const [loanType, setLoanType] = useState("personal")
  const [loanAmount, setLoanAmount] = useState(10000)
  const [showPandaTip, setShowPandaTip] = useState(true)

  const progress = (currentStep / steps.length) * 100

  // Hide panda tip after 5 seconds
  useEffect(() => {
    const tipTimer = setTimeout(() => {
      setShowPandaTip(false)
    }, 5000)

    return () => clearTimeout(tipTimer)
  }, [])

  const handleNextStep = () => {
    setLoading(true)
    // Simulate processing
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
      setLoading(false)
    }, 1000)
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleVideoRecorded = (videoBlob: Blob) => {
    const url = URL.createObjectURL(videoBlob)
    setVideoResponses((prev) => ({ ...prev, [currentStep]: url }))
  }

  const handleDocumentUploaded = (documentUrl: string) => {
    const docName = `Document ${documents.length + 1}`
    setDocuments((prev) => [...prev, { name: docName, url: documentUrl }])
  }

  const handleProcessingComplete = (processedDocs: any[]) => {
    setProcessedDocuments(processedDocs)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const getPandaMessage = () => {
    switch (currentStep) {
      case 1:
        return language === "es"
          ? "¡Hola! Soy BankPanda. Cuéntame un poco sobre ti y qué tipo de préstamo te interesa."
          : "Hi there! I'm BankPanda. Tell me a bit about yourself and what type of loan you're interested in."
      case 2:
        return language === "es"
          ? "Necesito algunos datos personales para verificar tu identidad. ¡Tu información está segura conmigo!"
          : "I need some personal details to verify your identity. Your information is safe with me!"
      case 3:
        return language === "es"
          ? "Ahora hablemos sobre los detalles del préstamo. Puedes usar la calculadora para estimar tus pagos."
          : "Now let's talk about loan details. You can use the calculator to estimate your payments."
      case 4:
        return language === "es"
          ? "Necesito algunos documentos para verificar tu información. Puedes subirlos aquí."
          : "I need some documents to verify your information. You can upload them here."
      case 5:
        return language === "es"
          ? "¡Excelente! Revisemos tu solicitud antes de enviarla."
          : "Great job! Let's review your application before submitting."
      default:
        return language === "es" ? "¿En qué puedo ayudarte hoy?" : "How can I help you today?"
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden border bg-gradient-to-br from-[#f8f9fa] to-white shadow-md relative">
              <video src="/placeholder.svg?height=400&width=600" controls className="w-full h-full object-cover">
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-3 left-3">
                <PandaMascot size="small" position="top-left" language={language} welcomeMessage={getPandaMessage()} />

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
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#002147]">Virtual Branch Manager Introduction</h3>
              <p className="text-muted-foreground">
                Hello, I'm your Virtual Branch Manager. I'll guide you through the loan application process. Please
                record a short video introducing yourself and telling us what type of loan you're interested in.
              </p>
            </div>
            <VideoRecorder onRecordingComplete={handleVideoRecorded} language={language} />
            {videoResponses[1] && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <h4 className="text-sm font-medium">Your Response:</h4>
                <div className="aspect-video rounded-lg overflow-hidden border shadow-md">
                  <video src={videoResponses[1]} controls className="w-full h-full object-cover">
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>
            )}
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden border bg-gradient-to-br from-[#f8f9fa] to-white shadow-md relative">
              <video src="/placeholder.svg?height=400&width=600" controls className="w-full h-full object-cover">
                Your browser does not support the video tag.
              </video>
              <PandaMascot size="small" position="top-left" language={language} welcomeMessage={getPandaMessage()} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#002147]">Personal Information</h3>
              <p className="text-muted-foreground">
                Please record a video providing your full name, contact information, and current address. This
                information will be used to verify your identity.
              </p>
            </div>
            <VideoRecorder onRecordingComplete={handleVideoRecorded} language={language} />
            {videoResponses[2] && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <h4 className="text-sm font-medium">Your Response:</h4>
                <div className="aspect-video rounded-lg overflow-hidden border shadow-md">
                  <video src={videoResponses[2]} controls className="w-full h-full object-cover">
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>
            )}
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden border bg-gradient-to-br from-[#f8f9fa] to-white shadow-md relative">
              <video src="/placeholder.svg?height=400&width=600" controls className="w-full h-full object-cover">
                Your browser does not support the video tag.
              </video>
              <PandaMascot size="small" position="top-left" language={language} welcomeMessage={getPandaMessage()} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#002147]">Loan Details</h3>
              <p className="text-muted-foreground">
                Please record a video explaining the loan amount you're seeking, the purpose of the loan, and your
                current employment and income details.
              </p>
            </div>
            <LoanCalculator language={language} defaultAmount={loanAmount} defaultType={loanType} defaultTerm={36} />
            <VideoRecorder onRecordingComplete={handleVideoRecorded} language={language} />
            {videoResponses[3] && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <h4 className="text-sm font-medium">Your Response:</h4>
                <div className="aspect-video rounded-lg overflow-hidden border shadow-md">
                  <video src={videoResponses[3]} controls className="w-full h-full object-cover">
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>
            )}
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden border bg-gradient-to-br from-[#f8f9fa] to-white shadow-md relative">
              <video src="/placeholder.svg?height=400&width=600" controls className="w-full h-full object-cover">
                Your browser does not support the video tag.
              </video>
              <PandaMascot size="small" position="top-left" language={language} welcomeMessage={getPandaMessage()} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#002147]">Document Upload</h3>
              <p className="text-muted-foreground">
                Please upload the following documents to support your loan application:
                <ul className="list-disc list-inside mt-2">
                  <li>Government-issued ID (passport, driver's license)</li>
                  <li>Proof of income (pay stubs, tax returns)</li>
                  <li>Proof of address (utility bill, bank statement)</li>
                </ul>
              </p>
            </div>
            <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
            {documents.length > 0 && (
              <DocumentProcessor
                documents={documents}
                language={language}
                onProcessingComplete={handleProcessingComplete}
              />
            )}
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden border bg-gradient-to-br from-[#f8f9fa] to-white shadow-md relative">
              <video src="/placeholder.svg?height=400&width=600" controls className="w-full h-full object-cover">
                Your browser does not support the video tag.
              </video>
              <PandaMascot size="small" position="top-left" language={language} welcomeMessage={getPandaMessage()} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#002147]">Application Review</h3>
              <p className="text-muted-foreground">
                Thank you for completing your loan application. Our team will review your information and get back to
                you within 2-3 business days. You'll receive updates via email and SMS.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border p-4 bg-gradient-to-br from-[#f8f9fa] to-white shadow-md space-y-3"
            >
              <h4 className="font-medium text-[#002147]">Application Summary</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">Application ID:</span> APP-{Math.floor(Math.random() * 1000000)}
                </li>
                <li>
                  <span className="font-medium">Submission Date:</span> {new Date().toLocaleDateString()}
                </li>
                <li>
                  <span className="font-medium">Video Responses:</span> {Object.keys(videoResponses).length}
                </li>
                <li>
                  <span className="font-medium">Documents Uploaded:</span> {documents.length}
                </li>
                <li>
                  <span className="font-medium">Documents Verified:</span>{" "}
                  {processedDocuments.filter((doc) => doc.status === "verified").length}
                </li>
              </ul>
            </motion.div>

            <FinancialAdvice language={language} loanType={loanType} loanAmount={loanAmount} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#007a33]">
            <Building2 className="h-6 w-6" />
            <span>{getTranslation("app.name", language)}</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector onLanguageChange={handleLanguageChange} />
            <div className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="#" className="text-[#00a3e0] hover:text-[#007a33] transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#002147]">
              {getTranslation("apply.title", language)}
            </h1>
            <p className="text-muted-foreground mt-2">{getTranslation("apply.subtitle", language)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                {getTranslation("apply.step", language)} {currentStep} {getTranslation("apply.of", language)}{" "}
                {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {getTranslation(steps[currentStep - 1].name, language)}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-[#f8f9fa]" indicatorClassName="bg-[#007a33]" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-none shadow-lg overflow-hidden bg-white">
              <CardHeader className="border-b bg-gradient-to-r from-[#f8f9fa] to-white">
                <CardTitle className="text-[#002147]">
                  {getTranslation(steps[currentStep - 1].name, language)}
                </CardTitle>
                <CardDescription>
                  {currentStep < steps.length
                    ? "Complete this step to continue your application."
                    : "Review your application before submission."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex justify-between border-t mt-6 pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1 || loading}
                  className="border-[#002147] text-[#002147] hover:bg-[#002147]/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {getTranslation("apply.back", language)}
                </Button>
                {currentStep < steps.length ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={loading}
                    className="bg-[#007a33] hover:bg-[#006128] shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {getTranslation("apply.processing", language)}
                      </>
                    ) : (
                      <>
                        {getTranslation("apply.next", language)}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Link href="/">
                    <Button className="bg-[#007a33] hover:bg-[#006128] shadow-md">
                      {getTranslation("apply.finish", language)}
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
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

