import {
  AsyncPipe,
  NgClass,
  NgComponentOutlet,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedUserMenuComponent } from 'src/app/shared/auth-nav-menu/user-menu/themed-user-menu.component';

import { NavbarComponent as BaseComponent } from '../../../../app/navbar/navbar.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';
// DATASHARE - start
import { RouterLink } from '@angular/router';
// DATASHARE - end

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-themed-navbar',
  // DATASHARE - start
  styleUrls: ['../../../../app/navbar/navbar.component.scss', './navbar.component.scss'],
  // styleUrls: ['../../../../app/navbar/navbar.component.scss'],
  templateUrl: './navbar.component.html',
  // templateUrl: '../../../../app/navbar/navbar.component.html',
  // DATASHARE - end
  animations: [slideMobileNav],
  standalone: true,
  // DATASHARE - start
  imports: [RouterLink, NgbDropdownModule, NgClass, NgIf, ThemedUserMenuComponent, NgFor, NgComponentOutlet, AsyncPipe, TranslateModule],
  // imports: [NgbDropdownModule, NgClass, NgIf, ThemedUserMenuComponent, NgFor, NgComponentOutlet, AsyncPipe, TranslateModule],
  // DATASHARE - end
})
export class NavbarComponent extends BaseComponent {
}
