import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative w-full max-w-lg mx-auto">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.608 10.608Z" />
        </svg>
      </div>
      <input
        type="text"
        [formControl]="searchControl"
        class="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 focus:border-blue-500/80 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-md shadow-slate-100 transition duration-200"
        placeholder="Search for cities (e.g. London, Tokyo)..."
      />
      <button
        *ngIf="searchControl.value"
        type="button"
        (click)="clearSearch()"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900 transition duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();
  
  searchControl = new FormControl('');
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter((val): val is string => val !== null)
    ).subscribe(value => {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        this.search.emit(trimmed);
      }
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
