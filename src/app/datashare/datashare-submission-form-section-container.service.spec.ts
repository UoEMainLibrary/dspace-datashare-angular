import { TestBed } from '@angular/core/testing';

import { DatashareSubmissionFormSectionContainerService } from './datashare-submission-form-section-container.service';

describe('DatashareSubmissionFormSectionContainerService', () => {
  let service: DatashareSubmissionFormSectionContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatashareSubmissionFormSectionContainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
