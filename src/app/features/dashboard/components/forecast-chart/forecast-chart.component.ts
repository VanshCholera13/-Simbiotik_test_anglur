import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyForecast } from '../../../../core/services/weather.service';

@Component({
  selector: 'app-forecast-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="forecast && forecast.length > 0" class="space-y-6">
      
      <!-- 7-Day Extended Timeline -->
      <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-lg shadow-slate-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-blue-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            7-Day Extended Timeline
          </h2>
          <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scrollable timeline</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <div 
            *ngFor="let day of forecast; let idx = index"
            class="relative flex flex-col items-center p-4 rounded-2xl border transition duration-200"
            [ngClass]="{
              'bg-blue-50 border-blue-200 ring-1 ring-blue-100': idx === 0,
              'bg-slate-50 border-slate-100 hover:border-slate-200': idx !== 0
            }"
          >
            <!-- Today indicator / Day Label -->
            <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {{ idx === 0 ? 'Today' : day.dayOfWeek }}
            </span>
            <span class="text-[10px] text-slate-400 font-semibold mt-0.5">
              {{ formatDate(day.date) }}
            </span>

            <!-- Weather Icon -->
            <div class="my-3 flex items-center justify-center">
              <img 
                [src]="'https://openweathermap.org/img/wn/' + day.icon + '.png'" 
                [alt]="day.condition"
                class="w-12 h-12 filter drop-shadow-[0_2px_4px_rgba(59,130,246,0.1)]"
              />
            </div>

            <!-- Temperature Metrics -->
            <div class="text-sm font-extrabold text-slate-800">
              {{ day.tempAvg }}°
            </div>
            
            <div class="flex gap-2 text-[10px] text-slate-400 font-bold mt-1">
              <span class="text-blue-500">{{ day.tempMin }}°</span>
              <span>/</span>
              <span class="text-red-500">{{ day.tempMax }}°</span>
            </div>

            <!-- Projection Indicator Tag -->
            <span 
              *ngIf="day.isProjected"
              class="absolute bottom-2 px-1.5 py-0.5 text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-600 rounded font-black uppercase tracking-widest scale-90"
            >
              PROJ
            </span>
          </div>
        </div>
      </div>

      <!-- Mathematical Averages for Upcoming 4 Days -->
      <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-lg shadow-slate-100">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 text-indigo-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
              </svg>
              Upcoming 4-Day Averages
            </h2>
            <p class="text-xs text-slate-400 mt-1 font-semibold">
              Computed mathematically from the intervals of {{ getAveragesDateRange() }}
            </p>
          </div>
          <span class="text-xs bg-indigo-50 text-indigo-600 font-black uppercase px-2.5 py-1 rounded-lg border border-indigo-100 tracking-wider">
            Analysis Mode
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Average Temperature Card -->
          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2 hover:border-indigo-100 transition duration-200">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.03V3m0 3a9 9 0 1 1-9 9m9-9c1.657 0 3 1.343 3 3m-3-3C10.343 6 9 7.343 9 9m3-9v3.75" />
                </svg>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Average Temp</span>
            </div>
            <div class="flex items-baseline gap-1 pt-2">
              <span class="text-3xl font-black text-slate-900">{{ avgTemp }}°</span>
              <span class="text-slate-400 text-sm font-bold">C</span>
            </div>
          </div>

          <!-- Average Humidity Card -->
          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2 hover:border-indigo-100 transition duration-200">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.96-6.938 1.805 1.805 0 0 1-.85-1.014 3.75 3.75 0 0 0-6.963-3.007 1.915 1.915 0 0 1-2.085-1.332A3.75 3.75 0 0 0 3 8.25a3.75 3.75 0 0 0-2.25 3.41V15Z" />
                </svg>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Average Humidity</span>
            </div>
            <div class="flex items-baseline gap-1 pt-2">
              <span class="text-3xl font-black text-slate-900">{{ avgHumidity }}%</span>
            </div>
          </div>

          <!-- Average Wind Speed Card -->
          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2 hover:border-indigo-100 transition duration-200">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-3h.75A10.5 10.5 0 0 1 15.75 19.5v.75" />
                </svg>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Average Wind</span>
            </div>
            <div class="flex items-baseline gap-1 pt-2">
              <span class="text-3xl font-black text-slate-900">{{ avgWindSpeed }}</span>
              <span class="text-slate-400 text-xs font-bold">m/s</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class ForecastChartComponent implements OnChanges {
  @Input() forecast: DailyForecast[] = [];

  avgTemp = 0;
  avgHumidity = 0;
  avgWindSpeed = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['forecast'] && this.forecast && this.forecast.length > 0) {
      this.calculateUpcomingAverages();
    }
  }

  private calculateUpcomingAverages(): void {
    const upcomingDays = this.forecast.slice(1, 5);
    if (upcomingDays.length === 0) return;

    const temps = upcomingDays.map(d => d.tempAvg);
    const humidities = upcomingDays.map(d => d.humidityAvg);
    const winds = upcomingDays.map(d => d.windSpeedAvg);

    this.avgTemp = Math.round(temps.reduce((sum, val) => sum + val, 0) / temps.length);
    this.avgHumidity = Math.round(humidities.reduce((sum, val) => sum + val, 0) / humidities.length);
    
    const totalWind = winds.reduce((sum, val) => sum + val, 0);
    this.avgWindSpeed = parseFloat((totalWind / winds.length).toFixed(1));
  }

  getAveragesDateRange(): string {
    if (!this.forecast || this.forecast.length < 5) return '';
    const upcomingDays = this.forecast.slice(1, 5);
    const start = upcomingDays[0];
    const end = upcomingDays[upcomingDays.length - 1];
    return `${start.dayOfWeek} (${this.formatDate(start.date)}) to ${end.dayOfWeek} (${this.formatDate(end.date)})`;
  }

  formatDate(dateStr: string): string {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    return `${months[monthIdx]} ${day}`;
  }
}
