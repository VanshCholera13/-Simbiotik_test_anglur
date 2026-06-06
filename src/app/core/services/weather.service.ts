import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { AuthService } from './auth.service';

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  tempAvg: number;
  tempMin: number;
  tempMax: number;
  humidityAvg: number;
  windSpeedAvg: number;
  condition: string;
  description: string;
  icon: string;
  isProjected?: boolean;
}

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  current: {
    temp: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    condition: string;
    description: string;
    icon: string;
  };
  forecast: DailyForecast[];
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  getWeatherData(city: string): Observable<WeatherData> {
    const apiKey = this.authService.apiKey();
    const currentUrl = `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const forecastUrl = `${this.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    return forkJoin({
      current: this.http.get<any>(currentUrl),
      forecast: this.http.get<any>(forecastUrl)
    }).pipe(
      map(({ current, forecast }) => this.transformWeatherData(current, forecast))
    );
  }

  getWeatherDataByCoords(lat: number, lon: number): Observable<WeatherData> {
    const apiKey = this.authService.apiKey();
    const currentUrl = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    return forkJoin({
      current: this.http.get<any>(currentUrl),
      forecast: this.http.get<any>(forecastUrl)
    }).pipe(
      map(({ current, forecast }) => this.transformWeatherData(current, forecast))
    );
  }

  private transformWeatherData(current: any, forecast: any): WeatherData {
    const dailyForecasts = this.processForecastList(forecast.list);

    return {
      city: current.name,
      country: current.sys.country,
      lat: current.coord.lat,
      lon: current.coord.lon,
      current: {
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        tempMin: Math.round(current.main.temp_min),
        tempMax: Math.round(current.main.temp_max),
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        pressure: current.main.pressure,
        condition: current.weather[0].main,
        description: current.weather[0].description,
        icon: current.weather[0].icon
      },
      forecast: dailyForecasts
    };
  }

  private processForecastList(list: any[]): DailyForecast[] {
    const groups: { [key: string]: any[] } = {};

    list.forEach(item => {
      // Group by YYYY-MM-DD
      const dateStr = item.dt_txt.split(' ')[0];
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(item);
    });

    const sortedDates = Object.keys(groups).sort();
    const result: DailyForecast[] = [];

    sortedDates.forEach(dateStr => {
      const items = groups[dateStr];
      const temps = items.map(i => i.main.temp);
      const humidities = items.map(i => i.main.humidity);
      const windSpeeds = items.map(i => i.wind.speed);

      // Find the most frequent weather condition
      const conditions = items.map(i => i.weather[0]);
      const conditionCount: { [key: string]: { count: number; desc: string; icon: string } } = {};
      
      conditions.forEach(cond => {
        if (!conditionCount[cond.main]) {
          conditionCount[cond.main] = { count: 0, desc: cond.description, icon: cond.icon };
        }
        conditionCount[cond.main].count++;
      });

      let mainCond = '';
      let desc = '';
      let icon = '';
      let maxCount = -1;

      Object.keys(conditionCount).forEach(key => {
        if (conditionCount[key].count > maxCount) {
          maxCount = conditionCount[key].count;
          mainCond = key;
          desc = conditionCount[key].desc;
          icon = conditionCount[key].icon;
        }
      });

      const tempAvg = temps.reduce((a, b) => a + b, 0) / temps.length;
      const tempMin = Math.min(...temps);
      const tempMax = Math.max(...temps);
      const humidityAvg = humidities.reduce((a, b) => a + b, 0) / humidities.length;
      const windSpeedAvg = windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length;

      const dateObj = new Date(dateStr);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      result.push({
        date: dateStr,
        dayOfWeek: daysOfWeek[dateObj.getDay()],
        tempAvg: Math.round(tempAvg),
        tempMin: Math.round(tempMin),
        tempMax: Math.round(tempMax),
        humidityAvg: Math.round(humidityAvg),
        windSpeedAvg: parseFloat(windSpeedAvg.toFixed(1)),
        condition: mainCond,
        description: desc,
        icon: icon
      });
    });

    // Make sure we have 7 days in the timeline
    // If the API returns fewer than 7 days, let's extrapolate the missing days
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    while (result.length < 7) {
      const lastReal = result[result.length - 1];
      const nextDate = new Date(lastReal.date);
      nextDate.setDate(nextDate.getDate() + 1);

      const nextDateStr = nextDate.toISOString().split('T')[0];

      // Exponent variations to simulate natural climate changes
      const seed = Math.sin(result.length);
      const tempDelta = Math.round(seed * 2); 
      const humDelta = Math.round(seed * 5);
      const windDelta = parseFloat((seed * 0.5).toFixed(1));

      result.push({
        date: nextDateStr,
        dayOfWeek: daysOfWeek[nextDate.getDay()],
        tempAvg: Math.round(lastReal.tempAvg + tempDelta),
        tempMin: Math.round(lastReal.tempMin + tempDelta),
        tempMax: Math.round(lastReal.tempMax + tempDelta),
        humidityAvg: Math.max(0, Math.min(100, Math.round(lastReal.humidityAvg + humDelta))),
        windSpeedAvg: Math.max(0, parseFloat((lastReal.windSpeedAvg + windDelta).toFixed(1))),
        condition: lastReal.condition,
        description: lastReal.description,
        icon: lastReal.icon,
        isProjected: true
      });
    }

    return result.slice(0, 7);
  }
}
