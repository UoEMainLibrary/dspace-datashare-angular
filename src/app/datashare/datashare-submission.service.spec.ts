import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NotificationsService } from '../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import { DatashareSubmissionService } from './datashare-submission.service';

describe('DatashareSubmissionService', () => {
  let service: DatashareSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
    });
    service = TestBed.inject(DatashareSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
