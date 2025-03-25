"use client"

import { useState, useRef } from "react"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/config"
import { useAuth } from "@/lib/auth-context"
import { v4 as uuidv4 } from 'uuid'

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [plotPath, setPlotPath] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [reportPath, setReportPath] = useState<string | null>(null)
  const { user } = useAuth();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    
    if (!selectedFile) return;
    
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File is too large. Please upload a WAV file smaller than 10MB.")
      return
    }
    
    // Check for both common WAV MIME types and file extension
    const isWavFile = selectedFile && (
      selectedFile.type === "audio/wav" || 
      selectedFile.type === "audio/wave" ||
      selectedFile.type === "audio/x-wav" ||
      selectedFile.name.toLowerCase().endsWith('.wav')
    )
    
    if (isWavFile) {
      setFile(selectedFile)
      setAudioUrl(URL.createObjectURL(selectedFile))
    } else {
      alert("Please upload a valid .wav file. The file must be in WAV format.")
    }
  }

  const analyzeAudio = async () => {
    if (!file) {
      alert("Please upload a .wav file first")
      return
    }
    
    setLoading(true)
    setResult(null)
    setPlotPath(null)
    setReportPath(null)
    
    try {
      const formData = new FormData()
      formData.append("audio", file)

      const response = await fetch(API_ENDPOINTS.AUDIO, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.Prediction)
      setPlotPath(data.PlotPath)
      setReportPath(data.ReportPath)

      // Save to localStorage if user is logged in
      if (user && data.ReportPath) {
        // Get existing history or initialize empty array
        const existingHistory = localStorage.getItem(`analysis_history_${user.uid}`)
        const history = existingHistory ? JSON.parse(existingHistory) : []
        
        // Add new analysis to history
        const newAnalysis = {
          id: uuidv4(),
          date: new Date().toISOString(),
          prediction: data.Prediction,
          riskLevel: data.RiskLevel || 'low',
          reportPath: data.ReportPath,
          plotPath: data.PlotPath
        }
        
        // Add to beginning of array (most recent first)
        history.unshift(newAnalysis)
        
        // Save back to localStorage
        localStorage.setItem(`analysis_history_${user.uid}`, JSON.stringify(history))
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error analyzing audio. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Add view report function
  const viewReport = async () => {
    if (!reportPath) return
    
    try {
      window.open(API_ENDPOINTS.REPORT(reportPath), '_blank')
    } catch (error) {
      console.error("Error viewing report:", error)
      alert("Error viewing report. Please try again.")
    }
  }

  // Update download report function
  const downloadReport = async () => {
    if (!reportPath) return
    
    try {
      window.open(API_ENDPOINTS.REPORT_DOWNLOAD(reportPath), '_blank')
    } catch (error) {
      console.error("Error downloading report:", error)
      alert("Error downloading report. Please try again.")
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-6">Voice Analysis</h1>
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Voice</CardTitle>
              <CardDescription>Upload a .wav file for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="file"
                  accept=".wav,audio/wav,audio/wave,audio/x-wav"
                  onChange={handleFileChange}
                  className="border p-2 rounded w-full max-w-md"
                />
                {audioUrl && (
                  <div className="w-full max-w-md">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <audio controls className="w-full">
                      <source src={audioUrl} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                <Button 
                  onClick={analyzeAudio} 
                  disabled={loading || !file} 
                  className="w-full max-w-md"
                >
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>
                {result && (
                  <div className="w-full max-w-md p-4 border rounded-md bg-muted">
                    <h3 className="font-medium mb-2">Analysis Result:</h3>
                    <p className="text-lg font-semibold">{result}</p>
                  </div>
                )}
                {reportPath && (
                  <div className="flex gap-4 justify-center w-full max-w-md">
                    <Button 
                      onClick={viewReport}
                      className="flex items-center gap-2 flex-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Report
                    </Button>
                    <Button 
                      onClick={downloadReport}
                      className="flex items-center gap-2 flex-1"
                      variant="outline"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}