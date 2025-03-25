"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Activity, 
  MapPin, 
  MessageSquare, 
  Dumbbell, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  
  const sidebarItems: SidebarItem[] = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: 'Doctor Connect',
      href: '/dashboard/doctor-connect',
      icon: <MapPin className="h-5 w-5" />
    },
    {
      title: 'Chatbot',
      href: '/dashboard/chatbot',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      title: 'Exercises',
      href: '/dashboard/exercises',
      icon: <Dumbbell className="h-5 w-5" />
    },
    {
      title: 'Recommendations',
      href: '/dashboard/recommendations',
      icon: <FileText className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
              pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            {item.icon}
            <span>{item.title}</span>
            {pathname === item.href && (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
} 