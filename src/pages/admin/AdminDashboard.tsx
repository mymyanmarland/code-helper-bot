import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, BarChart3, Settings, Shield, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AIBackground from '@/components/AIBackground';
import UserManagement from './UserManagement';
import ChatHistory from './ChatHistory';
import Analytics from './Analytics';
import SiteSettings from './SiteSettings';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg font-mono relative">
      <AIBackground />
      
      {/* Header */}
      <div className="relative z-10 border-b border-terminal-border bg-terminal-header/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-terminal-prompt" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-terminal-comment hover:text-terminal-fg"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-terminal-header border border-terminal-border">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chats" 
              className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">Chats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="chats">
            <ChatHistory />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
