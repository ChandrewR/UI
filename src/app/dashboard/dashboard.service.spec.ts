import { TestBed,inject, async  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { Routes, RouterModule, Router } from '@angular/router';

describe('DashboardService', () => {
  let service : DashboardService;
  let backend : HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports : [HttpClientTestingModule,RouterModule.forRoot([])],
    providers : [DashboardService]
  }));

  it('should be created',inject([HttpTestingController,DashboardService],
    (backend: HttpTestingController, service: DashboardService) => {
    //const service: DashboardService = TestBed.get(DashboardService);
    expect(service).toBeTruthy();
  }));
});
