"use client"

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { DashboardSidebar } from '../dashboard-sidebar';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your vocal health assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hoarse') || input.includes('hoarseness')) {
      return "Hoarseness can be caused by vocal strain, infection, or reflux. Try resting your voice, staying hydrated, and avoiding irritants like smoking. If it persists for more than 2 weeks, please consult a voice specialist.";
    } else if (input.includes('sore throat') || input.includes('pain')) {
      return "Sore throats can be caused by infections, dryness, or vocal strain. Try gargling with warm salt water, staying hydrated, and using throat lozenges. If you have severe pain or it lasts more than a week, please see a doctor.";
    } else if (input.includes('vocal') && input.includes('exercise')) {
      return "Great question! Some beneficial vocal exercises include lip trills, humming scales, and gentle sirens. Check our Exercises page for detailed instructions and demonstrations.";
    } else if (input.includes('water') || input.includes('hydration')) {
      return "Staying hydrated is crucial for vocal health! Aim for 8-10 glasses of water daily. Room temperature water is best for your vocal folds. Avoid excessive caffeine and alcohol as they can be dehydrating.";
    } else if (input.includes('warm up') || input.includes('warmup')) {
      return "Vocal warm-ups are essential before extended speaking or singing. Try gentle humming, lip trills, or tongue twisters for 5-10 minutes. This helps prevent strain and improves vocal quality.";
    } else {
      return "I'm here to help with vocal health questions. You can ask about vocal exercises, hydration, warm-ups, or specific voice issues like hoarseness or vocal strain.";
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 flex flex-col md:flex-row gap-6">
          <DashboardSidebar />
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Vocal Health Assistant</h1>
            </div>
            
            <Card className="flex flex-col h-[calc(100vh-16rem)]">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Voice Health Chatbot
                </CardTitle>
                <CardDescription>Ask questions about vocal health and get personalized recommendations</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className={message.sender === 'user' ? 'bg-primary' : 'bg-muted'}>
                        <AvatarFallback>
                          {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`rounded-lg p-3 text-sm ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              
              <CardFooter className="border-t p-4">
                <form 
                  className="flex w-full gap-2" 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Type your question about vocal health..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 