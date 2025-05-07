"use client";

class VoiceService {
  private recognition: any = null;
  private synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      // @ts-ignore - Speech recognition API might not be typed in TS
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }
  
  startRecognition(onTranscript: (text: string) => void) {
    if (!this.recognition) {
      throw new Error('Speech recognition is not supported in this browser');
    }
    
    this.recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscript(transcript);
    };
    
    this.recognition.start();
  }
  
  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
  
  speak(text: string) {
    if (!this.synthesis) return;
    
    // Stop any ongoing speech
    this.synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    this.synthesis.speak(utterance);
  }
  
  async processCommand(command: string): Promise<string> {
    // In a real implementation, this would send the command to a Python backend
    // for NLP processing and execute the appropriate action
    
    const lowerCommand = command.toLowerCase();
    
    // Simple command handling for demo purposes
    if (lowerCommand.includes('weather')) {
      return "Currently it's 22°C with partly cloudy skies. Tomorrow will be sunny with a high of 23°C.";
    } else if (lowerCommand.includes('time')) {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString()}.`;
    } else if (lowerCommand.includes('date')) {
      const now = new Date();
      return `Today is ${now.toLocaleDateString()}.`;
    } else if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      return "Hello! How can I help you today?";
    } else if (lowerCommand.includes('thank')) {
      return "You're welcome! Is there anything else you need?";
    } else if (lowerCommand.includes('calculator')) {
      return "Opening the calculator for you.";
    } else if (lowerCommand.includes('note')) {
      return "Opening the notes manager for you.";
    } else {
      return "I'm not sure how to help with that yet. You can try asking about the weather, time, or date.";
    }
  }
}

export const voiceService = new VoiceService();