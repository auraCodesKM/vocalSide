"use client"

import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DashboardSidebar } from '../dashboard-sidebar';

export default function DoctorConnectPage() {
  // Mock data for voice pathologists
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Voice Pathologist",
      distance: "1.2 miles",
      address: "123 Medical Center Dr, Suite 101",
      phone: "(555) 123-4567",
      email: "sjohnson@medcenter.com",
      availability: "Mon-Fri: 9am-5pm"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Speech-Language Pathologist",
      distance: "2.5 miles",
      address: "456 Health Parkway, Building B",
      phone: "(555) 987-6543",
      email: "mchen@voicehealth.org",
      availability: "Tue-Sat: 8am-4pm"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "ENT Specialist",
      distance: "3.8 miles",
      address: "789 Wellness Blvd, Suite 205",
      phone: "(555) 456-7890",
      email: "erodriguez@entclinic.com",
      availability: "Mon, Wed, Fri: 10am-6pm"
    }
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 flex flex-col md:flex-row gap-6">
          <DashboardSidebar />
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Find Voice Specialists</h1>
            </div>
            
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>Nearby Voice Pathologists</CardTitle>
                <CardDescription>Connect with specialists in your area</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video relative bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[url('/map-placeholder.jpg')] bg-cover bg-center">
                      {/* Map placeholder - would be replaced with actual map component */}
                      <div className="absolute inset-0 bg-black/5"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
                          <p className="text-sm text-muted-foreground">Interactive map would be displayed here</p>
                        </div>
                      </div>
                      
                      {/* Map pins for doctors */}
                      <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                          <MapPin className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p>{doctor.address}</p>
                        <p className="text-xs text-muted-foreground">{doctor.distance} away</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p>{doctor.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p>{doctor.email}</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-medium">Availability</p>
                      <p className="text-xs text-muted-foreground">{doctor.availability}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 gap-1">
                      Book Appointment <ExternalLink className="h-3 w-3" />
                    </Button>
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