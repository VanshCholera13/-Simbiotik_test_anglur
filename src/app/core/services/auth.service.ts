import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'weather_dashboard_auth';
  private readonly API_KEY_STORE = 'weather_dashboard_api_key';
  
  // Default to user's provided API key
  private readonly DEFAULT_API_KEY = '9a01d512523b09697a0bd187b02067aa';

  isAuthenticated = signal<boolean>(false);
  apiKey = signal<string>('');

  constructor() {
    this.checkInitialState();
  }

  private checkInitialState(): void {
    const isLoggedIn = localStorage.getItem(this.AUTH_KEY) === 'true';
    this.isAuthenticated.set(isLoggedIn);
    
    const savedKey = localStorage.getItem(this.API_KEY_STORE);
    this.apiKey.set(savedKey || this.DEFAULT_API_KEY);
  }

  login(apiKey: string): boolean {
    if (!apiKey || apiKey.trim().length < 10) {
      return false;
    }
    localStorage.setItem(this.AUTH_KEY, 'true');
    localStorage.setItem(this.API_KEY_STORE, apiKey.trim());
    this.isAuthenticated.set(true);
    this.apiKey.set(apiKey.trim());
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.API_KEY_STORE);
    this.isAuthenticated.set(false);
    this.apiKey.set(this.DEFAULT_API_KEY);
  }
}
