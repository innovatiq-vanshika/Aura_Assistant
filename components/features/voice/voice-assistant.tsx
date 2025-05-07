"use client";

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { voiceService } from '@/lib/services/voice-service';

type VoiceMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your voice assistant. Ask me anything or give me a command.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      voiceService.startRecognition((text) => {
        setTranscript(text);
      });
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    voiceService.stopRecognition();
    
    if (transcript.trim()) {
      processVoiceCommand(transcript);
    }
  };

  const processVoiceCommand = async (command: string) => {
    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      text: command,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setIsProcessing(true);
    
    try {
      // Process the command
      const response = await voiceService.processCommand(command);
      
      // Add assistant response
      const assistantMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      voiceService.speak(response);
      
    } catch (error) {
      console.error('Failed to process command:', error);
      
      // Add error message
      const errorMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process that command. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <CardTitle>Voice Assistant</CardTitle>
        <CardDescription>
          Speak to your assistant or type a command
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100vh-20rem)]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <div
                className={`${
                  isListening
                    ? 'animate-pulse bg-primary/25'
                    : 'bg-muted'
                } rounded-md p-3 min-h-[3rem] flex items-center`}
              >
                {isListening ? (
                  transcript || "Listening..."
                ) : (
                  isProcessing ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    "Press the microphone button to speak..."
                  )
                )}
              </div>
            </div>
            <Button 
              size="icon" 
              className={`h-12 w-12 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
              onClick={toggleListening}
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}