import {
  AsyncPipe,
  DatePipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {  DepositButtonComponent as BaseComponent } from '../../../../../app/datashare/deposit-button/deposit-button.component';

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
}