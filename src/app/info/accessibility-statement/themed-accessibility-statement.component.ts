import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { AccessibilityStatementComponent } from './accessibility-statement.component';

/**
 * Themed wrapper for AccessibilityComponent
 */
@Component({
  selector: 'ds-accessibility-statement',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [AccessibilityStatementComponent],
})
export class ThemedAccessibilityStatementComponent extends ThemedComponent<AccessibilityStatementComponent> {
  protected getComponentName(): string {
    return 'AccessibilityStatementComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/accessibility-statement/accessibility-statement.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./accessibility-statement.component`);
  }

}
