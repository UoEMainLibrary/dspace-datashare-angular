import {
  AsyncPipe,
  DatePipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {  DepositButtonComponent as BaseComponent } from '../../../../../app/datashare/deposit-button/deposit-button.component';
import { AuthorizationDataService } from '../../../../../app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../../app/core/data/feature-authorization/feature-id';
import { Observable } from 'rxjs/internal/Observable';
import { ThemedCreateItemParentSelectorComponent } from '../../../../../app/shared/dso-selector/modal-wrappers/create-item-parent-selector/themed-create-item-parent-selector.component';
@Component({
  selector: 'ds-themed-deposit-button',
  styleUrls: ['./deposit-button.component.scss'],
  // styleUrls: ['../../../../app/footer/footer.component.scss'],
  templateUrl: './deposit-button.component.html',
  // templateUrl: '../../../../app/footer/footer.component.html',
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe, DatePipe, TranslateModule],
})
export class  DepositButtonComponent extends BaseComponent {

  isAuthorized$: Observable<boolean>;
  constructor( protected authorizationService: AuthorizationDataService,
               protected modalService: NgbModal,
               protected router: Router) {
    super();
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanSubmit);
  }
  onDepositClick() {
    this.modalService.open(ThemedCreateItemParentSelectorComponent);
  }

  onLogInToDepositClick() {
    // Go to Login page onLogInToDepositClick "/login"
    this.router.navigate(['/login']);
  }

}