"use client"

import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Info, Clock, BarChart } from 'lucide-react';
import { DashboardSidebar } from '../dashboard-sidebar';

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  steps: string[];
}

export default function ExercisesPage() {
  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Lip Trills',
      description: 'A gentle exercise that relaxes the vocal folds and improves breath control.',
      duration: '2-3 minutes',
      difficulty: 'Beginner',
      benefits: [
        'Reduces vocal tension',
        'Improves breath support',
        'Warms up the voice without strain'
      ],
      steps: [
        'Relax your lips and keep them loosely together',
        'Blow air through your lips to make them vibrate (like a motor sound)',
        'Add sound while continuing the lip vibration',
        'Glide up and down in pitch while maintaining the trill'
      ]
    },
    {
      id: '2',
      title: 'Humming Scales',
      description: 'A simple exercise that helps find resonance and proper placement.',
      duration: '3-5 minutes',
      difficulty: 'Beginner',
      benefits: [
        'Develops resonance',
        'Improves pitch accuracy',
        'Encourages proper vocal placement'
      ],
      steps: [
        'Start with your lips closed and relaxed',
        'Hum a comfortable note in your mid-range',
        'Slowly glide up five notes and back down',
        'Focus on feeling vibrations in your mask area (around the nose and cheeks)'
      ]
    },
    {
      id: '3',
      title: 'Vocal Sirens',
      description: 'An exercise that stretches the vocal range and improves flexibility.',
      duration: '2-3 minutes',
      difficulty: 'Intermediate',
      benefits: [
        'Extends vocal range',
        'Improves vocal flexibility',
        'Helps with smooth register transitions'
      ],
      steps: [
        'Start with an "oo" or "ee" vowel sound',
        'Begin at your lowest comfortable pitch',
        'Glide smoothly up to your highest comfortable pitch',
        'Then glide back down to the bottom',
        'Keep the sound connected and smooth throughout'
      ]
    },
    {
      id: '4',
      title: 'Straw Phonation',
      description: 'A semi-occluded vocal tract exercise that promotes efficient vocal fold vibration.',
      duration: '3-5 minutes',
      difficulty: 'Intermediate',
      benefits: [
        'Reduces vocal fold collision force',
        'Balances air pressure and vocal fold resistance',
        'Promotes vocal efficiency'
      ],
      steps: [
        'Place a straw between your lips',
        'Hum or sing through the straw',
        'Practice scales, sirens, or simple melodies',
        'Focus on keeping the sound steady and controlled'
      ]
    }
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 flex flex-col md:flex-row gap-6">
          <DashboardSidebar />
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Vocal Exercises</h1>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="bg-muted/50">
                <CardTitle>Daily Vocal Practice</CardTitle>
                <CardDescription>
                  Regular practice of these exercises can help maintain and improve your vocal health
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  These exercises are designed to help strengthen your voice, improve vocal quality, and prevent strain. 
                  For best results, practice these exercises daily for 10-15 minutes in a quiet, comfortable environment.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>10-15 minutes daily</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    <span>Start with beginner exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    <span>Track your progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{exercise.title}</CardTitle>
                        <CardDescription>{exercise.description}</CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exercise.difficulty === 'Beginner' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : exercise.difficulty === 'Intermediate'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {exercise.difficulty}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {exercise.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Steps:</h4>
                      <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                        {exercise.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{exercise.duration}</span>
                      </div>
                      <Button size="sm" className="gap-1">
                        <Play className="h-3 w-3" /> Practice Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 