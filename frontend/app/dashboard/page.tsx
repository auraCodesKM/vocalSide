"use client"

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, Mic, BarChart, Clock, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { API_ENDPOINTS } from '@/lib/config';
import { DashboardSidebar } from './dashboard-sidebar';

interface AnalysisResult {
  id: string;
  date: string;
  prediction: string;
  riskLevel: string;
  reportPath: string;
  plotPath: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    // Load analysis history from localStorage
    if (user) {
      const storedHistory = localStorage.getItem(`analysis_history_${user.uid}`);
      if (storedHistory) {
        setAnalysisHistory(JSON.parse(storedHistory));
      }
    }
  }, [user]);

  const viewReport = (reportPath: string) => {
    window.open(API_ENDPOINTS.REPORT(reportPath), '_blank');
  };

  const downloadReport = (reportPath: string) => {
    window.open(API_ENDPOINTS.REPORT_DOWNLOAD(reportPath), '_blank');
  };

  // Calculate statistics
  const totalAnalyses = analysisHistory.length;
  const healthyCount = analysisHistory.filter(item => item.prediction.includes('Healthy')).length;
  const issuesCount = totalAnalyses - healthyCount;
  const healthyPercentage = totalAnalyses > 0 ? Math.round((healthyCount / totalAnalyses) * 100) : 0;
  const issuesPercentage = totalAnalyses > 0 ? Math.round((issuesCount / totalAnalyses) * 100) : 0;
  
  // Generate mock data for charts
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(currentMonth - 5, currentMonth + 1).map((month, index) => {
      const value = 70 + Math.floor(Math.random() * 20);
      return { month, value };
    });
  };
  
  const chartData = generateChartData();
  const maxChartValue = Math.max(...chartData.map(d => d.value));
  
  // Generate risk distribution data
  const riskDistribution = {
    low: Math.max(healthyCount, 1),
    medium: Math.floor(issuesCount * 0.7),
    high: Math.floor(issuesCount * 0.3)
  };
  const totalRisk = riskDistribution.low + riskDistribution.medium + riskDistribution.high;
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 flex flex-col md:flex-row gap-6">
          <DashboardSidebar />
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button asChild>
                <Link href="/analysis">New Analysis</Link>
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnalyses}</div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime voice analyses
                  </p>
                  <div className="mt-3 h-1 w-full bg-muted">
                    <div 
                      className="h-1 bg-primary" 
                      style={{ width: `${totalAnalyses ? 100 : 0}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Healthy Results</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthyPercentage}%</div>
                  <p className="text-xs text-muted-foreground">
                    {healthyCount} healthy results
                  </p>
                  <div className="mt-3 h-1 w-full bg-muted">
                    <div 
                      className="h-1 bg-green-500" 
                      style={{ width: `${healthyPercentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Potential Issues</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{issuesPercentage}%</div>
                  <p className="text-xs text-muted-foreground">
                    {issuesCount} results with potential issues
                  </p>
                  <div className="mt-3 h-1 w-full bg-muted">
                    <div 
                      className="h-1 bg-amber-500" 
                      style={{ width: `${issuesPercentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vocal Health Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-bold">{healthyPercentage}</div>
                    <div className="ml-1 text-xs text-muted-foreground">/100</div>
                    {healthyPercentage > 50 ? (
                      <div className="ml-auto flex items-center text-green-500 text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Good
                      </div>
                    ) : (
                      <div className="ml-auto flex items-center text-red-500 text-xs">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Needs Attention
                      </div>
                    )}
                  </div>
                  <div className="mt-3 h-1 w-full bg-muted">
                    <div 
                      className={`h-1 ${healthyPercentage > 70 ? 'bg-green-500' : healthyPercentage > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${healthyPercentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vocal Health Trend</CardTitle>
                  <CardDescription>Your vocal health score over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {chartData.map((data, i) => (
                      <div key={i} className="relative flex flex-col items-center">
                        <div className="absolute -top-6 text-xs font-medium">{data.value}</div>
                        <div 
                          className="w-12 bg-primary/10 rounded-t-md relative group"
                          style={{ height: `${(data.value / maxChartValue) * 180}px` }}
                        >
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all duration-500"
                            style={{ height: `${(data.value / maxChartValue) * 180}px` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{data.month}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Breakdown of your vocal health risk levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <div className="text-sm">Low Risk</div>
                        </div>
                        <div className="text-sm font-medium">{Math.round((riskDistribution.low / totalRisk) * 100)}%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-green-500" 
                          style={{ width: `${(riskDistribution.low / totalRisk) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <div className="text-sm">Medium Risk</div>
                        </div>
                        <div className="text-sm font-medium">{Math.round((riskDistribution.medium / totalRisk) * 100)}%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-amber-500" 
                          style={{ width: `${(riskDistribution.medium / totalRisk) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <div className="text-sm">High Risk</div>
                        </div>
                        <div className="text-sm font-medium">{Math.round((riskDistribution.high / totalRisk) * 100)}%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-red-500" 
                          style={{ width: `${(riskDistribution.high / totalRisk) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>Your most recent voice analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                {analysisHistory.length > 0 ? (
                  <div className="space-y-4">
                    {analysisHistory.slice(0, 5).map((analysis) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${
                            analysis.prediction.includes('Healthy') 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            <Activity className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{analysis.prediction}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(analysis.date).toLocaleDateString()}</span>
                              <Clock className="h-3 w-3 ml-2" />
                              <span>{new Date(analysis.date).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => viewReport(analysis.reportPath)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button 
                            onClick={() => downloadReport(analysis.reportPath)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Mic className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analysis History</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md">
                      You haven't performed any voice analyses yet. Start your first analysis to track your vocal health.
                    </p>
                    <Button asChild>
                      <Link href="/analysis">Start First Analysis</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 