import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { DepositButtonComponent } from './deposit-button.component';

/**
 * Themed wrapper for DepositButtonComponent
 */
@Component({
  selector: 'ds-deposit-button',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [DepositButtonComponent],
})
export class ThemedDepositButtonComponent extends ThemedComponent<DepositButtonComponent> {
  protected getComponentName(): string {
    return 'DepositButtonComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/datashare/deposit-button/deposit-button.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./deposit-button.component');
  }
}
