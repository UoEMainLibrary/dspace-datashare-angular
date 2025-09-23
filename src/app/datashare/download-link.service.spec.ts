import { TestBed } from '@angular/core/testing';

import { DownloadLinkService } from './download-link.service';

describe('DownloadLinkService', () => {
  let service: DownloadLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
