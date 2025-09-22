import { Component } from '@angular/core';
import { AccessibilityStatementComponent as BaseComponent } from '../../../../../app/info/accessibility-statement/accessibility-statement.component';


@Component({
  selector: 'ds-accessibility-statement',
  styleUrls: ['./accessibility-statement.component.scss'],
  templateUrl: './accessibility-statement.component.html',
  standalone: true,
})

/**
 * Component displaying the Accessibility Statement
 */
export class AccessibilityStatementComponent extends BaseComponent {}

