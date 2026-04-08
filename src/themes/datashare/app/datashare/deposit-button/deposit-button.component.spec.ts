import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of as observableOf } from 'rxjs';

import { AuthorizationDataService } from '../../../../../app/core/data/feature-authorization/authorization-data.service';
import { DepositButtonComponent } from './deposit-button.component';

describe('DepositButtonComponent', () => {
  let component: DepositButtonComponent;
  let fixture: ComponentFixture<DepositButtonComponent>;

  const mockAuthorizationService = {
    isAuthorized: () => observableOf(true),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositButtonComponent],
      providers: [
        { provide: AuthorizationDataService, useValue: mockAuthorizationService },
        { provide: NgbModal, useValue: {} },
        { provide: Router, useValue: { navigate: () => {} } },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DepositButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
