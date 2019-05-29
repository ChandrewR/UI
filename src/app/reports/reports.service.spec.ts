import { TestBed,inject, async   } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Routes, RouterModule, Router } from '@angular/router';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({

    imports : [HttpClientTestingModule,RouterModule.forRoot([])],
    providers : [ReportsService]
  }));

  it('should be created', () => {
    const service: ReportsService = TestBed.get(ReportsService);
    expect(service).toBeTruthy();
  });
});
