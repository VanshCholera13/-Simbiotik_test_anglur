import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      <!-- Decorative Background Light Glows -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-100/40 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>

      <div class="relative z-10 w-full max-w-md p-8 mx-4">
        <!-- Dashboard Card Wrapper -->
        <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-slate-200">
          
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.879 7.519c1.171-1.171 3.071-1.171 4.242 0 1.172 1.172 1.172 3.07 0 4.242L3.64 15.24M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Weatherly</h1>
            <p class="text-slate-500 text-sm mt-2 font-medium">Predictive Weather Analytics & Dashboard</p>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Username/Email (Optional visual helper) -->
            <div>
              <label class="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2" for="username">
                Username / Identifier
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                placeholder="Enter username (optional)"
              />
            </div>

            <!-- API Key Input -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-slate-700 text-xs font-semibold uppercase tracking-wider" for="apiKey">
                  OpenWeatherMap API Key
                </label>
                <span class="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer" (click)="toggleKeyVisibility()">
                  {{ showKey() ? 'Hide' : 'Show' }}
                </span>
              </div>
              <input
                id="apiKey"
                [type]="showKey() ? 'text' : 'password'"
                formControlName="apiKey"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 font-mono text-sm"
                placeholder="Enter OpenWeatherMap API Key"
              />
              <div *ngIf="loginForm.get('apiKey')?.invalid && loginForm.get('apiKey')?.touched" class="text-red-600 text-xs mt-1 font-medium">
                Please enter a valid API key (at least 10 characters).
              </div>
            </div>

            <!-- Error Notification -->
            <div *ngIf="errorMsg()" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center">
              {{ errorMsg() }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid"
              class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/10 active:scale-[0.98] transition duration-150 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
            >
              Access Dashboard
            </button>
          </form>

          <!-- Footer Credits -->
          <div class="text-center mt-8">
            <span class="text-xs text-slate-400 font-medium">Simbiotik Solutions Placement Assessment</span>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showKey = signal<boolean>(false);
  errorMsg = signal<string>('');

  loginForm = new FormGroup({
    username: new FormControl('Guest User'),
    apiKey: new FormControl(this.authService.apiKey() || '', [
      Validators.required,
      Validators.minLength(10)
    ])
  });

  toggleKeyVisibility(): void {
    this.showKey.update(v => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const key = this.loginForm.value.apiKey || '';
    const success = this.authService.login(key);

    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMsg.set('Invalid API key provided. Please check and try again.');
    }
  }
}
