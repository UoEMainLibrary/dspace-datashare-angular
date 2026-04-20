import { Component } from '@angular/core';

import { CopyrightComponent as BaseComponent } from '../../../../../app/info/copyright/copyright.component';
import { ThemedCopyrightComponent } from '../../../../../app/info/copyright/themed-copyright.component';


@Component({
  selector: 'ds-themed-copyright',
  styleUrls: ['./copyright.component.scss'],
  templateUrl: './copyright.component.html',
  standalone: true,
  imports: [ThemedCopyrightComponent],
})

/**
 * Component displaying the Copyright Statement
 */
export class CopyrightComponent extends BaseComponent {}

