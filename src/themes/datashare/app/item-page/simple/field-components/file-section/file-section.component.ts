import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component';
import { slideSidebarPadding } from '../../../../../../../app/shared/animations/slide';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { FileSizePipe } from '../../../../../../../app/shared/utils/file-size-pipe';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';
import { getFirstCompletedRemoteData } from '../../../../../../../app/core/shared/operators';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { RemoteData } from '../../../../../../../app/core/data/remote-data';
import { PaginatedList } from '../../../../../../../app/core/data/paginated-list.model';
import { Bitstream } from '../../../../../../../app/core/shared/bitstream.model';
import { hasValue, isEmpty } from '../../../../../../../app/shared/empty.util';
import { PaginationComponentOptions } from '../../../../../../../app/shared/pagination/pagination-component-options.model';
import { followLink } from '../../../../../../../app/shared/utils/follow-link-config.model';
import { BitstreamDataService } from '../../../../../../../app/core/data/bitstream-data.service';
import { NotificationsService } from '../../../../../../../app/shared/notifications/notifications.service';
import { DSONameService } from '../../../../../../../app/core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../../../config/app-config.interface';
import { PaginationService } from '../../../../../../../app/core/pagination/pagination.service';
import { PaginationComponent } from '../../../../../../../app/shared/pagination/pagination.component';
import { DownloadLinkService } from '../../../../../../../app/datashare/download-link.service';
import { response } from 'express';

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
  ],
})
export class FileSectionComponent extends BaseComponent {

  cclicenses$: Observable<RemoteData<PaginatedList<Bitstream>>>;
  licenses$: Observable<RemoteData<PaginatedList<Bitstream>>>;
  downloadLink$: Observable<string>;
  downloadLinkAvailable$: Observable<boolean>;

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
      filter(response => !!response && response.length > 0),
      map(response => response)
    );
    this.downloadLinkAvailable$ = this.downloadLinkService.isDownloadLinkAvailable(this.item.id).pipe(
        filter((response: boolean) => !!response && response),
      map(response => response)
  );

  }

  hasValuesInBundle(bundle: PaginatedList<Bitstream>) {
    return hasValue(bundle) && !isEmpty(bundle.page);
  }

}
