import { TestBed } from '@angular/core/testing';

import { DatashareCustomisedSubmissionService } from './datashare-submission.service';

describe('DatashareCustomisedSubmissionService', () => {
  let service: DatashareCustomisedSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatashareCustomisedSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
