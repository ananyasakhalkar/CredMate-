"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, RefreshCw, FileText } from "lucide-react"
import { getTranslation } from "@/lib/translations"

interface Document {
  id: string
  name: string
  status: "pending" | "verified" | "rejected"
  message?: string
  progress: number
}

interface DocumentProcessorProps {
  documents: { name: string; url: string }[]
  language: string
  onProcessingComplete: (processedDocs: Document[]) => void
}

export function DocumentProcessor({ documents, language, onProcessingComplete }: DocumentProcessorProps) {
  const [processedDocuments, setProcessedDocuments] = useState<Document[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (documents.length > 0 && !isProcessing) {
      processDocuments()
    }
  }, [documents])

  const processDocuments = () => {
    setIsProcessing(true)

    // Create initial document states
    const initialDocs = documents.map((doc, index) => ({
      id: `doc-${index}`,
      name: doc.name || `Document ${index + 1}`,
      status: "pending" as const,
      progress: 0,
    }))

    setProcessedDocuments(initialDocs)

    // Simulate document processing with progress updates
    initialDocs.forEach((doc, index) => {
      const totalTime = 3000 + Math.random() * 5000 // Random processing time between 3-8 seconds
      const intervalTime = 100
      const steps = totalTime / intervalTime
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const progress = Math.min(Math.round((currentStep / steps) * 100), 100)

        setProcessedDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, progress } : d)))

        // When processing is complete
        if (progress === 100) {
          clearInterval(interval)

          // Randomly determine if document is verified or rejected
          const isVerified = Math.random() > 0.3 // 70% chance of verification

          setTimeout(() => {
            setProcessedDocuments((prev) =>
              prev.map((d) =>
                d.id === doc.id
                  ? {
                      ...d,
                      status: isVerified ? "verified" : "rejected",
                      message: isVerified ? undefined : "Document quality issues. Please resubmit a clearer copy.",
                    }
                  : d,
              ),
            )

            // Check if all documents are processed
            if (index === initialDocs.length - 1) {
              setIsProcessing(false)
              setTimeout(() => {
                onProcessingComplete(processedDocuments)
              }, 1000)
            }
          }, 500)
        }
      }, intervalTime)
    })
  }

  const resubmitDocument = (docId: string) => {
    setProcessedDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: "pending", progress: 0, message: undefined } : d)),
    )

    // Simulate reprocessing
    const doc = processedDocuments.find((d) => d.id === docId)
    if (doc) {
      const totalTime = 3000 + Math.random() * 3000
      const intervalTime = 100
      const steps = totalTime / intervalTime
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const progress = Math.min(Math.round((currentStep / steps) * 100), 100)

        setProcessedDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, progress } : d)))

        if (progress === 100) {
          clearInterval(interval)

          // Higher chance of verification on resubmission
          const isVerified = Math.random() > 0.1 // 90% chance of verification

          setTimeout(() => {
            setProcessedDocuments((prev) =>
              prev.map((d) =>
                d.id === docId
                  ? {
                      ...d,
                      status: isVerified ? "verified" : "rejected",
                      message: isVerified
                        ? undefined
                        : "Document still has quality issues. Please try a different document.",
                    }
                  : d,
              ),
            )
          }, 500)
        }
      }, intervalTime)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-amber-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {getTranslation("docProcess.verified", language)}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {getTranslation("docProcess.rejected", language)}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {getTranslation("docProcess.pending", language)}
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTranslation("docProcess.title", language)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {processedDocuments.map((doc) => (
          <div key={doc.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{doc.name}</span>
              </div>
              {getStatusBadge(doc.status)}
            </div>

            {doc.status === "pending" && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{getTranslation("docProcess.verifying", language)}</span>
                  <span>{doc.progress}%</span>
                </div>
                <Progress value={doc.progress} className="h-2" />
              </div>
            )}

            {doc.message && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">{doc.message}</div>
            )}

            {doc.status === "rejected" && (
              <Button variant="outline" size="sm" className="gap-1" onClick={() => resubmitDocument(doc.id)}>
                <RefreshCw className="h-4 w-4" />
                {getTranslation("docProcess.resubmit", language)}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

