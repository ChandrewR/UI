import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdministrationService } from './administration.service';

describe('AdministrationService', () => {

  let service : AdministrationService;
  let backend : HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports : [HttpClientTestingModule],
    providers : [AdministrationService]
  }));

  it('should be created', inject([HttpTestingController,AdministrationService],
   (backend: HttpTestingController, service: AdministrationService) => {
    //const service: AdministrationService = TestBed.get(AdministrationService);
    expect(service).toBeTruthy();
  }));
});
