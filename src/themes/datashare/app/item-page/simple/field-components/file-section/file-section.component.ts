// DATASHARE - start
import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  filter,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { DSONameService } from '../../../../../../../app/core/breadcrumbs/dso-name.service';
import { AccessStatusDataService } from '../../../../../../../app/core/data/access-status-data.service';
import { BitstreamDataService } from '../../../../../../../app/core/data/bitstream-data.service';
import { PaginatedList } from '../../../../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../../../../app/core/data/remote-data';
import { PaginationService } from '../../../../../../../app/core/pagination/pagination.service';
import { Bitstream } from '../../../../../../../app/core/shared/bitstream.model';
import { getFirstCompletedRemoteData } from '../../../../../../../app/core/shared/operators';
import { DownloadLinkService } from '../../../../../../../app/datashare/download-link.service';
import { FileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component';
import { GenericItemPageFieldComponent } from '../../../../../../../app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { slideSidebarPadding } from '../../../../../../../app/shared/animations/slide';
import {
  hasValue,
  isEmpty,
} from '../../../../../../../app/shared/empty.util';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { NotificationsService } from '../../../../../../../app/shared/notifications/notifications.service';
import { PaginationComponent } from '../../../../../../../app/shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../../../../../app/shared/pagination/pagination-component-options.model';
import { FileSizePipe } from '../../../../../../../app/shared/utils/file-size-pipe';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';
import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../../config/app-config.interface';


@Component({
  selector: 'ds-themed-item-page-file-section',
  templateUrl: './file-section.component.html',
  // templateUrl: '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component.html',
  styleUrls: ['./file-section.component.scss'],
  animations: [slideSidebarPadding],
  standalone: true,
  imports: [
    CommonModule,
    ThemedFileDownloadLinkComponent,
    MetadataFieldWrapperComponent,
    PaginationComponent,
    ThemedLoadingComponent,
    TranslateModule,
    FileSizePipe,
    VarDirective,
    GenericItemPageFieldComponent,
  ],
})
export class FileSectionComponent extends BaseComponent implements OnInit {

  cclicenses$: Observable<RemoteData<PaginatedList<Bitstream>>>;
  licenses$: Observable<RemoteData<PaginatedList<Bitstream>>>;
  downloadLink$: Observable<string>;
  downloadLinkAvailable$: Observable<boolean>;
  hasEmbargo$: Observable<boolean>;

  cclicenseOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'cclbo',
    currentPage: 1,
    pageSize: 1,
  });

  licenseOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'lbo',
    currentPage: 1,
    pageSize: 1,
  });


  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    protected paginationService: PaginationService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected downloadLinkService: DownloadLinkService,
    protected accessStatusDataService: AccessStatusDataService,
  ) {
    super(bitstreamDataService, notificationsService, translateService, dsoNameService, appConfig);

  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initialize();
  }

  initialize(): void {
    this.cclicenses$ = this.paginationService.getCurrentPagination(this.cclicenseOptions.id, this.cclicenseOptions).pipe(
      switchMap((options: PaginationComponentOptions) => this.bitstreamDataService.findAllByItemAndBundleName(
        this.item,
        'CC-LICENSE',
        { elementsPerPage: 1, currentPage: 1 },
        true,
        true,
      )),
      tap((rd: RemoteData<PaginatedList<Bitstream>>) => {
        if (hasValue(rd.errorMessage)) {
          this.notificationsService.error(this.translateService.get('file-section.error.header'), `${rd.statusCode} ${rd.errorMessage}`);
        }
      },
      ),
    );

    this.licenses$ = this.paginationService.getCurrentPagination(this.licenseOptions.id, this.licenseOptions).pipe(
      switchMap((options: PaginationComponentOptions) => this.bitstreamDataService.findAllByItemAndBundleName(
        this.item,
        'LICENSE',
        { elementsPerPage: 1, currentPage: 1 },
        true,
        true,
      )),
      tap((rd: RemoteData<PaginatedList<Bitstream>>) => {
        if (hasValue(rd.errorMessage)) {
          this.notificationsService.error(this.translateService.get('file-section.error.header'), `${rd.statusCode} ${rd.errorMessage}`);
        }
      },
      ),
    );

    this.downloadLink$ = this.downloadLinkService.getDownloadLink(this.item.id).pipe(
      filter(link => hasValue(link) && link.length > 0),
      map(link => link),
    );

    this.hasEmbargo$ = this.accessStatusDataService.findAccessStatusFor(this.item).pipe(
      getFirstCompletedRemoteData(),
      map(rd => rd?.hasSucceeded && rd.payload?.status === 'embargo'),
    );

  }

  hasValuesInBundle(bundle: PaginatedList<Bitstream>) {
    return hasValue(bundle) && !isEmpty(bundle.page);
  }

  showTombstone(): boolean {
    const value = this.item?.firstMetadataValue('ds.withdrawn.showtombstone');
    return value === 'true';
  }

}
// DATASHARE - end
