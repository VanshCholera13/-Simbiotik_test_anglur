import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../../../core/services/weather.service';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="weather" class="space-y-6">
      <!-- Main Temperature & Condition Card -->
      <div class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100">
        <div class="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-3xl font-black text-slate-900 tracking-tight">{{ weather.city }}</span>
              <span class="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md uppercase border border-blue-100">{{ weather.country }}</span>
            </div>
            <p class="text-slate-500 text-sm font-medium">Current Weather</p>
            <div class="flex items-baseline gap-2 mt-4">
              <span class="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tighter">{{ weather.current.temp }}°</span>
              <span class="text-slate-400 text-lg font-bold">C</span>
            </div>
            <div class="flex gap-4 text-xs font-bold text-slate-500">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 text-blue-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
                H: {{ weather.current.tempMax }}°
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 text-indigo-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
                L: {{ weather.current.tempMin }}°
              </span>
            </div>
          </div>
          
          <div class="flex flex-col items-center md:items-end gap-2 self-stretch justify-between md:self-auto">
            <div class="w-24 h-24 flex items-center justify-center bg-slate-50 rounded-3xl border border-slate-100">
              <img 
                [src]="'https://openweathermap.org/img/wn/' + weather.current.icon + '@2x.png'" 
                [alt]="weather.current.description"
                class="w-20 h-20 filter drop-shadow-[0_4px_6px_rgba(59,130,246,0.15)]"
              />
            </div>
            <div class="text-left md:text-right">
              <p class="text-lg font-bold text-slate-900 capitalize leading-none">{{ weather.current.description }}</p>
              <p class="text-xs text-slate-400 font-semibold mt-1">Feels like {{ weather.current.feelsLike }}°C</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid (2x2 layout, vertical format to prevent text truncation) -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Humidity -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-blue-500/30 transition duration-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Humidity</span>
            <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.96-6.938 1.805 1.805 0 0 1-.85-1.014 3.75 3.75 0 0 0-6.963-3.007 1.915 1.915 0 0 1-2.085-1.332A3.75 3.75 0 0 0 3 8.25a3.75 3.75 0 0 0-2.25 3.41V15Z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-black text-slate-800 mt-1">{{ weather.current.humidity }}%</p>
        </div>

        <!-- Wind Speed -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-blue-500/30 transition duration-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wind Speed</span>
            <div class="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-3h.75A10.5 10.5 0 0 1 15.75 19.5v.75" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-black text-slate-800 mt-1">{{ weather.current.windSpeed }} <span class="text-xs font-semibold text-slate-400">m/s</span></p>
        </div>

        <!-- Pressure -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-blue-500/30 transition duration-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pressure</span>
            <div class="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M3 12h18" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-black text-slate-800 mt-1">{{ weather.current.pressure }} <span class="text-xs font-semibold text-slate-400">hPa</span></p>
        </div>

        <!-- Coordinates -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-blue-500/30 transition duration-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Geo Coords</span>
            <div class="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
          </div>
          <p class="text-base font-black text-slate-800 mt-2 truncate" [title]="weather.lat + ', ' + weather.lon">
            {{ weather.lat.toFixed(2) }}, {{ weather.lon.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
  `
})
export class WeatherCardComponent {
  @Input('weatherData') weather?: WeatherData;
}
