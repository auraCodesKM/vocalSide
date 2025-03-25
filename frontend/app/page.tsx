"use client"

import { Layout } from "@/components/layout"
import Link from "next/link"
import { ArrowRight, Mic, Activity, Users, Play, QrCode, BarChart2, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Layout>
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-green-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#22c55e15_1px,transparent_1px),linear-gradient(to_bottom,#22c55e15_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          <div className="absolute top-0 left-0 w-32 h-32 text-green-100">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-40 text-blue-100">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute top-1/4 right-1/4 w-16 h-16 text-green-100">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 text-blue-100">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1 rounded-full mb-6">
              VOCALWELL AI
              </div>
              
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-8">
                <span className="text-gray-900">Caring for </span>
                <span className="text-green-500 relative inline-block">
                  Voice
                  <span className="absolute bottom-2 left-0 w-full h-2 bg-green-500 opacity-20"></span>
                </span>
                <br />
                <span className="text-gray-900">Caring for You</span>
              </h1>
              
              <p className="text-gray-600 text-xl mb-10 max-w-xl">
                A vocal assessment platform for patients and doctors alike. The one solution 
                you can count on to protect your vocal health and detect issues early.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button size="lg" className="rounded-md px-8 py-6 bg-green-500 hover:bg-green-600 text-white text-lg" asChild>
                  <Link href={user ? "/analysis" : "/signup"}>
                    Get Started
                  </Link>
                </Button>
                
                <Button size="lg" variant="outline" className="rounded-md px-8 py-6 border-blue-500 text-blue-500 hover:bg-blue-50 text-lg" asChild>
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-6 max-w-lg">
                <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-md border border-gray-100">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-lg">HIPAA Compliant</h3>
                  <p className="text-sm text-gray-500 mt-2 text-center">Secure & Private</p>
                </div>
                
                <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-md border border-gray-100">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Activity className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-lg">AI Powered</h3>
                  <p className="text-sm text-gray-500 mt-2 text-center">Advanced Analysis</p>
                </div>
                
                <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-md border border-gray-100">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-amber-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-lg">Doctor Connect</h3>
                  <p className="text-sm text-gray-500 mt-2 text-center">Expert Support</p>
                </div>
                
                <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-md border border-gray-100">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart2 className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-lg">Real-time Results</h3>
                  <p className="text-sm text-gray-500 mt-2 text-center">Instant Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-muted/50 py-24">
        <div className="container space-y-12">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
            Why Choose VocalWell
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <BarChart2 className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Early Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify potential voice disorders before they become serious issues.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Mic className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced neural modeling for accurate and instant voice analysis.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card>
                <CardContent className="p-6 space-y-2">
                  <Shield className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">
                    Your voice data is analyzed securely and never shared with third parties.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="voice-health-india" className="py-24">
        <div className="container space-y-12">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
            Voice Health in India
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                In India, where oral communication plays a crucial role in various professions and daily life, voice
                health is often overlooked. VocalWell aims to address this gap by providing accessible voice health
                solutions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>High prevalence of voice disorders among teachers and call center employees</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Limited awareness about vocal health and its impact on career longevity</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Need for accessible and affordable voice health solutions</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <motion.img
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Voice Health in India"
                className="rounded-lg shadow-lg object-cover w-full h-[400px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="qr-code-scanner" className="bg-muted/50 py-24">
        <div className="container space-y-12">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
            Instant Voice Health Reports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Get your voice health report instantly on your phone. Simply scan the QR code to access your
                personalized analysis and recommendations.
              </p>
              <Button size="lg" className="gap-2">
                <QrCode className="h-4 w-4" /> Scan QR Code
              </Button>
            </div>
            <div className="relative">
              <motion.div
                className="bg-white p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <QrCode className="h-64 w-64 mx-auto" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
              VocalWell makes voice disorder detection simple and accessible. Here's how you can get started:
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              <Play className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/analysis">
                <Mic className="w-4 h-4" /> Start Your Voice Analysis
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="md:grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Start Your Voice Health Journey Today
                  </h2>
                  <p className="text-muted-foreground">
                    Join thousands of users who trust VocalWell for their voice health monitoring. 
                    Get started with a free account and access all features.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {user ? (
                      <Button asChild size="lg" className="gap-2">
                        <Link href="/dashboard">
                          Go to Dashboard <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild size="lg" className="gap-2">
                          <Link href="/signup">
                            Sign Up Free <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                          <Link href="/signin">
                            Sign In
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-muted p-8 md:p-12 flex items-center justify-center">
                <div className="max-w-sm">
                  <div className="space-y-2">
                    <Award className="h-12 w-12 text-primary mb-4" />
                    <blockquote className="text-lg font-medium italic">
                      "VocalWell helped me detect early signs of vocal strain, allowing me to seek treatment before it became serious. As a professional speaker, this tool is invaluable."
                    </blockquote>
                    <p className="font-semibold">- Sarah J., Professional Speaker</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

