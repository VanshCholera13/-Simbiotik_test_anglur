import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeatherService, WeatherData } from '../../core/services/weather.service';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { ForecastChartComponent } from './components/forecast-chart/forecast-chart.component';
import { SkeletonScreenComponent } from '../../shared/components/skeleton-screen/skeleton-screen.component';
import { RetryTriggerComponent } from '../../shared/components/retry-trigger/retry-trigger.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SearchInputComponent,
    WeatherCardComponent,
    ForecastChartComponent,
    SkeletonScreenComponent,
    RetryTriggerComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      <!-- Navbar / Header -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5.5 h-5.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.879 7.519c1.171-1.171 3.071-1.171 4.242 0 1.172 1.172 1.172 3.07 0 4.242L3.64 15.24M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-black leading-none text-slate-900 tracking-tight">Weatherly</h1>
            <span class="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Live Dashboard</span>
          </div>
        </div>

        <!-- Right action elements -->
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex flex-col text-right">
            <span class="text-xs font-bold text-slate-800">Active User</span>
            <span class="text-[10px] text-slate-400 font-semibold">Session Key Valid</span>
          </div>
          <button
            type="button"
            (click)="logout()"
            class="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        <!-- Search bar layout -->
        <div class="flex flex-col gap-4 text-center">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Real-Time Weather Intelligence
          </h2>
          <p class="text-slate-500 text-sm max-w-lg mx-auto font-medium">
            Monitor real-time temperatures, calculate upcoming trends, and analyze metrics instantly.
          </p>
          <div class="w-full mt-2">
            <app-search-input (search)="onSearch($event)"></app-search-input>
          </div>
        </div>

        <!-- Dynamic Content Area -->
        <div class="relative min-h-[300px]">
          <!-- ERROR STATE (Yellow retry trigger) -->
          <div *ngIf="hasError()" class="py-12">
            <app-retry-trigger [message]="errorMsg()" (retry)="onRetry()"></app-retry-trigger>
          </div>

          <!-- SKELETON STATE (Pending first load or loading states) -->
          <div *ngIf="isInitialLoading() && !hasError()" class="py-4">
            <app-skeleton-screen></app-skeleton-screen>
          </div>

          <!-- DATA STATE -->
          <div *ngIf="weatherData() && !isInitialLoading() && !hasError()" class="space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <!-- Current Metrics -->
              <div class="lg:col-span-5">
                <app-weather-card [weatherData]="weatherData()!"></app-weather-card>
              </div>

              <!-- Forecast Charts / Averages -->
              <div class="lg:col-span-7">
                <app-forecast-chart [forecast]="weatherData()!.forecast"></app-forecast-chart>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly weatherService = inject(WeatherService);
  private readonly authService = inject(AuthService);
  protected readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);

  private readonly defaultCity = 'Bengaluru';
  private lastSearchCity = '';
  private lastSearchCoords: { lat: number; lon: number } | null = null;

  weatherData = signal<WeatherData | null>(null);
  isInitialLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  errorMsg = signal<string>('');

  ngOnInit(): void {
    this.loadInitialWeather();
  }

  private loadInitialWeather(): void {
    this.isInitialLoading.set(true);
    this.hasError.set(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.lastSearchCoords = { lat, lon };
          this.fetchByCoords(lat, lon);
        },
        (error) => {
          console.warn('Geolocation permission denied, defaulting to Bengaluru.', error);
          this.fetchByCity(this.defaultCity);
        }
      );
    } else {
      this.fetchByCity(this.defaultCity);
    }
  }

  onSearch(city: string): void {
    this.lastSearchCoords = null;
    this.fetchByCity(city);
  }

  onRetry(): void {
    this.hasError.set(false);
    this.isInitialLoading.set(true);
    
    if (this.lastSearchCoords) {
      this.fetchByCoords(this.lastSearchCoords.lat, this.lastSearchCoords.lon);
    } else if (this.lastSearchCity) {
      this.fetchByCity(this.lastSearchCity);
    } else {
      this.loadInitialWeather();
    }
  }

  private fetchByCity(city: string): void {
    this.lastSearchCity = city;
    this.isInitialLoading.set(true);
    this.hasError.set(false);

    this.weatherService.getWeatherData(city).subscribe({
      next: (data) => {
        this.weatherData.set(data);
        this.isInitialLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching weather data:', err);
        this.hasError.set(true);
        this.isInitialLoading.set(false);
        if (err.status === 404) {
          this.errorMsg.set(`City "${city}" not found. Please verify spelling and try again.`);
        } else if (err.status === 401) {
          this.errorMsg.set('Unauthorized. The OpenWeatherMap API Key is invalid or not yet active.');
        } else {
          this.errorMsg.set('Failed to connect to weather services. Please check your network and try again.');
        }
      }
    });
  }

  private fetchByCoords(lat: number, lon: number): void {
    this.isInitialLoading.set(true);
    this.hasError.set(false);

    this.weatherService.getWeatherDataByCoords(lat, lon).subscribe({
      next: (data) => {
        this.weatherData.set(data);
        this.isInitialLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching weather data by coords:', err);
        this.hasError.set(true);
        this.isInitialLoading.set(false);
        this.errorMsg.set('Failed to retrieve weather metrics for your physical location.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
