"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import AppHeader from '@/components/app-header';
import WeatherWidget from '@/components/features/weather/weather-widget';
import TodoList from '@/components/features/todo/todo-list';
import OcrTool from '@/components/features/ocr/ocr-tool';
import WikiSearch from '@/components/features/wiki/wiki-search';
import VoiceAssistant from '@/components/features/voice/voice-assistant';
import NotesManager from '@/components/features/notes/notes-manager';
import AppLauncher from '@/components/features/launcher/app-launcher';
import Calculator from '@/components/features/calculator/calculator';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('weather');

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full overflow-x-auto flex-wrap justify-start p-1 sm:justify-center">
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="todo">Todo</TabsTrigger>
                <TabsTrigger value="ocr">OCR</TabsTrigger>
                <TabsTrigger value="wiki">Wikipedia</TabsTrigger>
                <TabsTrigger value="voice">Voice</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="launcher">Launcher</TabsTrigger>
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="weather" className="p-4">
                <WeatherWidget />
              </TabsContent>
              
              <TabsContent value="todo" className="p-4">
                <TodoList />
              </TabsContent>
              
              <TabsContent value="ocr" className="p-4">
                <OcrTool />
              </TabsContent>
              
              <TabsContent value="wiki" className="p-4">
                <WikiSearch />
              </TabsContent>
              
              <TabsContent value="voice" className="p-4">
                <VoiceAssistant />
              </TabsContent>
              
              <TabsContent value="notes" className="p-4">
                <NotesManager />
              </TabsContent>
              
              {/* <TabsContent value="launcher" className="p-4">
                <AppLauncher />
              </TabsContent> */}
              
              <TabsContent value="calculator" className="p-4">
                <Calculator />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}