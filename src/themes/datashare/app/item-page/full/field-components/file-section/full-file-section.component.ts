import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap, tap } from 'rxjs';

import { FullFileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { PaginationComponent } from '../../../../../../../app/shared/pagination/pagination.component';
import { FileSizePipe } from '../../../../../../../app/shared/utils/file-size-pipe';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';
import { PaginatedList } from '../../../../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../../../../app/core/data/remote-data';
import { Bitstream } from '../../../../../../../app/core/shared/bitstream.model';
import { PaginationComponentOptions } from '../../../../../../../app/shared/pagination/pagination-component-options.model';
import { followLink } from '../../../../../../../app/shared/utils/follow-link-config.model';
import { hasValue } from '../../../../../../../app/shared/empty.util';


@Component({
  selector: 'ds-themed-item-page-full-file-section',
  // styleUrls: ['./full-file-section.component.scss'],
  styleUrls: ['../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component.scss'],
  templateUrl: './full-file-section.component.html',
  // templateUrl: '../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component.html',
  standalone: true,
  imports: [
    PaginationComponent,
    NgIf,
    TranslateModule,
    AsyncPipe,
    VarDirective,
    ThemedThumbnailComponent,
    NgForOf,
    ThemedFileDownloadLinkComponent,
    FileSizePipe,
    MetadataFieldWrapperComponent,
  ],
})
export class FullFileSectionComponent extends BaseComponent {
  cclicenses$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  cclicenseOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'cclbo',
    currentPage: 1,
    pageSize: this.appConfig.item.bitstream.pageSize,
  });

  initialize(): void {
    super.initialize();
    this.cclicenses$ = this.paginationService.getCurrentPagination(this.cclicenseOptions.id, this.cclicenseOptions).pipe(
      switchMap((options: PaginationComponentOptions) => this.bitstreamDataService.findAllByItemAndBundleName(
        this.item,
        'CC-LICENSE',
        { elementsPerPage: options.pageSize, currentPage: options.currentPage },
        true,
        true,
        followLink('format'),
        followLink('thumbnail'),
      )),
      tap((rd: RemoteData<PaginatedList<Bitstream>>) => {
        if (hasValue(rd.errorMessage)) {
          this.notificationsService.error(this.translateService.get('file-section.error.header'), `${rd.statusCode} ${rd.errorMessage}`);
        }
      },
      ),
    );
  }

}
