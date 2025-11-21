import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { SearchFormComponent as BaseComponent } from '../../../../../app/shared/search-form/search-form.component';
import { BrowserOnlyPipe } from '../../../../../app/shared/utils/browser-only.pipe';

@Component({
  selector: 'ds-themed-search-form',
  // DATASHARE - start
  styleUrls: ['../../../../../app/shared/search-form/search-form.component.scss', './search-form.component.scss'],
  // styleUrls: ['../../../../../app/shared/search-form/search-form.component.scss'],
  templateUrl: './search-form.component.html',
  // templateUrl: '../../../../../app/shared/search-form/search-form.component.html',
  // DATASHARE - end
  standalone: true,
  imports: [FormsModule, NgIf, NgbTooltipModule, AsyncPipe, TranslateModule, BrowserOnlyPipe],
})
export class SearchFormComponent extends BaseComponent {
}
