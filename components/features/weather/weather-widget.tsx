"use client";

import { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { weatherService } from '@/lib/services/weather-service';
import { WeatherData, ForecastDay } from '@/lib/types/weather-types';

export default function WeatherWidget() {
  const [location, setLocation] = useState('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!location.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await weatherService.getWeather(location);
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try a different location.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="h-10 w-10 text-blue-500" />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="h-10 w-10 text-blue-200" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-10 w-10 text-gray-400" />;
    } else {
      return <Sun className="h-10 w-10 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location..."
          className="flex-1"
        />
        <Button onClick={fetchWeather} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : weather ? (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{weather.location}</h2>
                  <p className="text-xl">{weather.current.temperature}°C</p>
                  <p>{weather.current.condition}</p>
                </div>
                <div className="text-white">
                  {getWeatherIcon(weather.current.condition)}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm opacity-80">Humidity</p>
                  <p className="font-semibold">{weather.current.humidity}%</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Wind</p>
                  <p className="font-semibold">{weather.current.windSpeed} km/h</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Feels Like</p>
                  <p className="font-semibold">{weather.current.feelsLike}°C</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {weather.forecast.map((day, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{day.date}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(day.condition)}
                    <div>
                      <p className="font-medium">{day.condition}</p>
                      <p className="text-sm text-muted-foreground">
                        {day.minTemp}°C - {day.maxTemp}°C
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}