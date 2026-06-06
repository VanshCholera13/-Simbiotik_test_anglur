import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from './app';
import { LoadingService } from './core/services/loading.service';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let loadingServiceMock: any;

  beforeEach(async () => {
    loadingServiceMock = {
      isLoading: () => false
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: LoadingService, useValue: loadingServiceMock },
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
