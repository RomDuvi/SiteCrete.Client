import { TestBed, inject } from '@angular/core/testing';

import { EnterServiceService } from './enter-service.service';

describe('EnterServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnterServiceService]
    });
  });

  it('should be created', inject([EnterServiceService], (service: EnterServiceService) => {
    expect(service).toBeTruthy();
  }));
});
