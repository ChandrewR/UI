import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Routes, RouterModule, Router } from '@angular/router';

describe('AuthService', () => {
  let service : AuthService;
  let backend : HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({

    imports : [HttpClientTestingModule,RouterModule.forRoot([])],
    providers : [AuthService]
  }));

  it('should be created', inject([HttpTestingController,AuthService],
    (backend: HttpTestingController, service: AuthService) => {
    //const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  }));
});
