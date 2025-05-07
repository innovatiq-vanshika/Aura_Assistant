"use client";

import { WeatherData } from '../types/weather-types';

class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  
  // Mocked data for demo purposes
  async getWeather(location: string): Promise<WeatherData> {
    // In a real implementation, this would call the weather API
    // const response = await fetch(`${this.apiUrl}?q=${location}&appid=${API_KEY}&units=metric`);
    // const data = await response.json();
    
    // For demo, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          location: location,
          current: {
            temperature: 22,
            feelsLike: 23,
            humidity: 65,
            windSpeed: 12,
            condition: location.toLowerCase().includes('rain') ? 'Rain' : 'Partly Cloudy'
          },
          forecast: [
            {
              date: 'Today',
              minTemp: 18,
              maxTemp: 24,
              condition: 'Partly Cloudy'
            },
            {
              date: 'Tomorrow',
              minTemp: 17,
              maxTemp: 23,
              condition: 'Sunny'
            },
            {
              date: 'Wed',
              minTemp: 16,
              maxTemp: 22,
              condition: 'Cloudy'
            }
          ]
        });
      }, 800);
    });
  }
}

export const weatherService = new WeatherService();