"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadDialogProps {
  onUploadComplete: (data: any) => void
}

export function UploadDialog({ onUploadComplete }: UploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [needsPassword, setNeedsPassword] = useState(false)
  const [processingStage, setProcessingStage] = useState("")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file")
        return
      }
      setFile(selectedFile)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    console.log("[v0] Starting upload for file:", file.name)
    setIsUploading(true)
    setUploadProgress(0)
    setError("")
    setProcessingStage("Uploading document...")

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", file)
      if (password) {
        formData.append("password", password)
      }

      console.log("[v0] FormData created, making API call...")

      const progressStages = [
        { progress: 20, stage: "Uploading document..." },
        { progress: 40, stage: "Extracting text from PDF..." },
        { progress: 60, stage: "Analyzing transactions..." },
        { progress: 80, stage: "Categorizing expenses..." },
        { progress: 95, stage: "Generating insights..." },
      ]

      let stageIndex = 0
      const progressInterval = setInterval(() => {
        if (stageIndex < progressStages.length) {
          const currentStage = progressStages[stageIndex]
          setUploadProgress(currentStage.progress)
          setProcessingStage(currentStage.stage)
          stageIndex++
        } else {
          clearInterval(progressInterval)
        }
      }, 800) // Slower, more realistic progress updates

      // Upload and analyze the document
      const response = await fetch("/api/analyze-statement", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] API response status:", response.status)
      clearInterval(progressInterval)
      setUploadProgress(100)
      setProcessingStage("Complete!")

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[v0] API error response:", errorData)

        if (response.status === 401 && errorData.needsPassword) {
          setNeedsPassword(true)
          setError("This PDF is password protected. Please enter the password.")
          setIsUploading(false)
          setUploadProgress(0)
          setProcessingStage("")
          return
        }

        throw new Error(errorData.error || "Upload failed")
      }

      const analysisData = await response.json()
      console.log("[v0] Analysis data received:", analysisData)

      setTimeout(() => {
        // Call the callback with the analyzed data
        onUploadComplete(analysisData)

        // Reset form and close dialog
        setFile(null)
        setPassword("")
        setNeedsPassword(false)
        setIsOpen(false)
        setUploadProgress(0)
        setProcessingStage("")
      }, 500)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err instanceof Error ? err.message : "Upload failed")
      setUploadProgress(0)
      setProcessingStage("")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPassword("")
    setError("")
    setNeedsPassword(false)
    setUploadProgress(0)
    setIsUploading(false)
    setProcessingStage("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <span>Upload Document</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Bank Statement</DialogTitle>
          <DialogDescription>Upload your bank statement PDF to analyze your financial data with AI.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!file && (
            <div>
              <Label htmlFor="file-upload">Select PDF File</Label>
              <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileSelect} className="mt-1" />
            </div>
          )}

          {file && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null)
                    setNeedsPassword(false)
                    setPassword("")
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          {needsPassword && (
            <div>
              <Label htmlFor="password">PDF Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PDF password"
                className="mt-1"
              />
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{processingStage}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                This may take a few moments depending on the size of your statement...
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? "Processing..." : "Upload & Analyze"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
