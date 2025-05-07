"use client";

import { AppShortcut } from '../types/launcher-types';

class LauncherService {
  private storageKey = 'aura-app-shortcuts';
  
  getShortcuts(): AppShortcut[] {
    if (typeof window === 'undefined') return this.getDefaultShortcuts();
    
    const storedShortcuts = localStorage.getItem(this.storageKey);
    return storedShortcuts ? JSON.parse(storedShortcuts) : this.getDefaultShortcuts();
  }
  
  saveShortcuts(shortcuts: AppShortcut[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.storageKey, JSON.stringify(shortcuts));
  }
  
  getDefaultShortcuts(): AppShortcut[] {
    return [
      {
        id: '1',
        name: 'Google',
        url: 'https://www.google.com',
        icon: '🔍',
        category: 'productivity'
      },
      {
        id: '2',
        name: 'Gmail',
        url: 'https://mail.google.com',
        icon: '📧',
        category: 'productivity'
      },
      {
        id: '3',
        name: 'YouTube',
        url: 'https://www.youtube.com',
        icon: '🎬',
        category: 'entertainment'
      },
      {
        id: '4',
        name: 'Twitter',
        url: 'https://twitter.com',
        icon: '🐦',
        category: 'social'
      },
      {
        id: '5',
        name: 'GitHub',
        url: 'https://github.com',
        icon: '💻',
        category: 'productivity'
      },
      {
        id: '6',
        name: 'Netflix',
        url: 'https://www.netflix.com',
        icon: '🍿',
        category: 'entertainment'
      }
    ];
  }
}

export const launcherService = new LauncherService();