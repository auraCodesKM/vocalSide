"use client"

import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Droplet, Coffee, Pizza, Cigarette, Volume2, Moon, Sun } from 'lucide-react';
import { DashboardSidebar } from '../dashboard-sidebar';

export default function RecommendationsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 flex flex-col md:flex-row gap-6">
          <DashboardSidebar />
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Vocal Health Recommendations</h1>
            </div>
            
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General Tips</TabsTrigger>
                <TabsTrigger value="diet">Dietary Guidelines</TabsTrigger>
                <TabsTrigger value="precautions">Precautions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle>Daily Vocal Health Practices</CardTitle>
                    <CardDescription>
                      Incorporate these habits into your daily routine for optimal vocal health
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <Droplet className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Stay Hydrated</h3>
                            <p className="text-sm text-muted-foreground">
                              Drink 8-10 glasses of water daily. Room temperature water is best for your vocal folds.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <Volume2 className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Vocal Rest</h3>
                            <p className="text-sm text-muted-foreground">
                              Give your voice regular breaks, especially after periods of heavy use. Aim for 10 minutes of silence every 2 hours.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <Moon className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Proper Sleep</h3>
                            <p className="text-sm text-muted-foreground">
                              Get 7-8 hours of quality sleep. Sleep allows your vocal folds to recover from daily use.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <Sun className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Warm Up Your Voice</h3>
                            <p className="text-sm text-muted-foreground">
                              Always warm up before extended speaking or singing. Try gentle humming or lip trills for 5-10 minutes.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Avoid Shouting</h3>
                            <p className="text-sm text-muted-foreground">
                              Use amplification when needed. Shouting can cause vocal strain and damage over time.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <Coffee className="h-5 w-5 text-brown-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Limit Caffeine</h3>
                            <p className="text-sm text-muted-foreground">
                              Reduce caffeine intake as it can dehydrate your vocal folds. Balance with extra water if consumed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="diet" className="space-y-6">
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle>Dietary Guidelines for Vocal Health</CardTitle>
                    <CardDescription>
                      What you eat and drink can significantly impact your vocal health
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Foods & Drinks to Avoid</h3>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-sm">Dairy products (can increase mucus)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-sm">Spicy foods (can cause acid reflux)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-sm">Caffeine (dehydrating)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-sm">Alcohol (dehydrating)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-sm">Citrus fruits (can irritate throat)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-sm">Carbonated beverages</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Recommended Foods & Drinks</h3>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm">Water (room temperature)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm">Herbal teas (non-caffeinated)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm">Honey (soothes throat)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm">Ginger (anti-inflammatory)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm">Non-acidic fruits</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm">Vegetables (well-cooked)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Special Note on Timing</h4>
                        <p className="text-sm text-muted-foreground">
                          Avoid eating heavy meals 2-3 hours before performances or extended speaking engagements. 
                          This helps prevent acid reflux which can irritate the vocal folds.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="precautions" className="space-y-6">
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle>Vocal Health Precautions</CardTitle>
                    <CardDescription>
                      Important warnings and precautions to protect your vocal health
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/30">
                        <div className="mt-1">
                          <Cigarette className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-red-700 dark:text-red-400">Avoid Smoking & Secondhand Smoke</h3>
                          <p className="text-sm text-red-600/80 dark:text-red-300/80 mt-1">
                            Smoking and exposure to secondhand smoke can cause significant damage to your vocal folds, 
                            leading to chronic hoarseness, reduced vocal range, and increased risk of throat cancer.
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-muted rounded-lg border">
                          <h3 className="font-medium mb-2">When to Seek Medical Help</h3>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Hoarseness lasting more than 2 weeks</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Complete loss of voice for more than a few days</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Pain when speaking or swallowing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Difficulty breathing while speaking</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Blood in sputum when coughing</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-muted rounded-lg border">
                          <h3 className="font-medium mb-2">Environmental Factors</h3>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Avoid dry environments; use a humidifier if needed</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Limit exposure to dust, pollen, and chemical fumes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Be cautious in extremely cold weather (breathe through nose)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Avoid speaking in noisy environments</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>Use proper amplification when addressing large groups</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
                        <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Professional Voice Users</h3>
                        <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
                          If you use your voice professionally (teachers, singers, actors, etc.), consider regular check-ups 
                          with a voice specialist or ENT doctor, even when you're not experiencing problems. Early detection 
                          of potential issues can prevent serious vocal damage.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 