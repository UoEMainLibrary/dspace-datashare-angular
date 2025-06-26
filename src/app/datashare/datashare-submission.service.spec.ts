import { TestBed } from '@angular/core/testing';

import { DatashareSubmissionService } from './datashare-submission.service';

describe('DatashareCustomisedSubmissionService', () => {
  let service: DatashareSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatashareSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
