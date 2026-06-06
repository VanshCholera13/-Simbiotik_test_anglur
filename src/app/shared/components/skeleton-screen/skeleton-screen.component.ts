import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-pulse">
      <!-- Current Weather Skeleton -->
      <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div class="space-y-4 flex-1">
          <div class="h-4 bg-slate-200 rounded-full w-24"></div>
          <div class="h-14 bg-slate-200 rounded-2xl w-40"></div>
          <div class="h-4 bg-slate-200 rounded-full w-32"></div>
        </div>
        <div class="w-24 h-24 bg-slate-200 rounded-2xl md:mx-0"></div>
      </div>

      <!-- Grid for details -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm" *ngFor="let i of [1,2,3,4]">
          <div class="h-3 bg-slate-200 rounded-full w-12"></div>
          <div class="h-6 bg-slate-200 rounded-lg w-20"></div>
        </div>
      </div>

      <!-- 7-Day Timeline Timeline Skeleton -->
      <div class="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
        <div class="h-5 bg-slate-200 rounded-full w-48"></div>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-3" *ngFor="let i of [1,2,3,4,5,6,7]">
            <div class="h-3 bg-slate-200 rounded-full w-10"></div>
            <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div class="h-4 bg-slate-200 rounded-full w-12"></div>
            <div class="h-3 bg-slate-200 rounded-full w-8"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SkeletonScreenComponent {}
