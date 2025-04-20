"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUp, Loader2, X } from "lucide-react"
import { getTranslation } from "@/lib/translations"
import { PandaMascot } from "@/components/panda-mascot"

interface DocumentUploadProps {
  onDocumentUploaded: (documentUrl: string) => void
  language?: string
}

export function DocumentUpload({ onDocumentUploaded, language = "en" }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([])
  const [showPandaTip, setShowPandaTip] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const tipTimer = setTimeout(() => {
      setShowPandaTip(false)
    }, 5000)

    return () => clearTimeout(tipTimer)
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    setIsUploading(true)

    // Simulate file upload with a delay
    setTimeout(() => {
      Array.from(files).forEach((file) => {
        // Create a fake URL for the uploaded file
        const fakeUrl = URL.createObjectURL(new Blob([file], { type: file.type }))

        setUploadedFiles((prev) => [...prev, { name: file.name, url: fakeUrl }])
        onDocumentUploaded(fakeUrl)
      })

      setIsUploading(false)
    }, 1500)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed ${
          isDragging ? "border-[#007a33] bg-[#007a33]/5" : "border-muted-foreground/20"
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-10 text-center relative">
          <div className="absolute top-3 right-3 z-10">
            <PandaMascot
              size="tiny"
              language={language}
              welcomeMessage={
                language === "es"
                  ? "Puedes arrastrar y soltar tus documentos aquí o hacer clic para seleccionarlos."
                  : "You can drag and drop your documents here or click to select them."
              }
            />

            {/* Tooltip */}
            {showPandaTip && (
              <div className="absolute right-10 top-0 bg-white p-2 rounded-lg shadow-md text-xs w-40 border border-[#007a33]/20">
                Need help with documents?
                <div className="absolute right-[-6px] top-3 w-3 h-3 bg-white transform rotate-45 border-r border-t border-[#007a33]/20"></div>
              </div>
            )}
          </div>
          <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2 text-[#002147]">{getTranslation("docs.title", language)}</h3>
          <p className="text-sm text-muted-foreground mb-4">{getTranslation("docs.dragDrop", language)}</p>
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" multiple />
          <Button
            onClick={openFileDialog}
            variant="outline"
            disabled={isUploading}
            className="border-[#002147] text-[#002147]"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {getTranslation("docs.uploading", language)}
              </>
            ) : (
              getTranslation("docs.selectFiles", language)
            )}
          </Button>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{getTranslation("docs.uploaded", language)}</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-background">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 bg-[#00a3e0]/10 rounded flex items-center justify-center">
                    <FileUp className="h-4 w-4 text-[#00a3e0]" />
                  </div>
                  <span className="text-sm font-medium truncate">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

