import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
  Subscription,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { LinkService } from '../../../../../core/cache/builders/link.service';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { followLink } from '../../../../utils/follow-link-config.model';
import { hasValue } from '../../../../empty.util';
import { AccessStatusObject } from './access-status.model';

@Component({
  selector: 'ds-base-access-status-badge',
  templateUrl: './access-status-badge.component.html',
  styleUrls: ['./access-status-badge.component.scss'],
  standalone: true,
  imports: [AsyncPipe, TranslateModule],
})
/**
 * Component rendering the access status of an item or bitstream as a badge
 */
export class AccessStatusBadgeComponent implements OnDestroy, OnInit {

  @Input() object: Item | Bitstream;

  accessStatus$: Observable<string>;
  embargoDate$: Observable<string>;

  /**
   * Whether to show the access status badge or not
   */
  showAccessStatus: boolean;

  /**
   * Value based stylesheet class for access status badge
   */
  accessStatusClass: string;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    private linkService: LinkService,
  ) { }

  ngOnInit(): void {
    if (!hasValue(this.object)) {
      return;
    }
    if (!hasValue(this.object.accessStatus)) {
      // In case the access status has not been loaded, do it individually.
      this.linkService.resolveLink(this.object, followLink('accessStatus'));
    }
    switch ((this.object as any).type) {
      case Item.type.value:
        this.handleItem();
        break;
      case Bitstream.type.value:
        this.handleBitstream();
        break;
    }
  }

  /**
   * Method to handle the object type Item
   */
  private handleItem() {
    this.showAccessStatus = environment.item.showAccessStatuses;
    if (!this.showAccessStatus) {
      return;
    }
    this.accessStatus$ = this.object.accessStatus.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((accessStatus: AccessStatusObject) => hasValue(accessStatus.status) ? accessStatus.status : 'unknown'),
      map((status: string) => `access-status.${status.toLowerCase()}.listelement.badge`),
      catchError(() => observableOf('access-status.unknown.listelement.badge')),
    );

    // stylesheet based on the access status value
    this.subs.push(
      this.accessStatus$.pipe(
        map((accessStatusClass: string) => accessStatusClass.replace(/\./g, '-')),
      ).subscribe((accessStatusClass: string) => {
        this.accessStatusClass = accessStatusClass;
      }),
    );
  }

  /**
   * Method to handle the object type Bitstream
   */
  private handleBitstream() {
    this.showAccessStatus = environment.item.bitstream.showAccessStatuses;
    if (!this.showAccessStatus) {
      return;
    }
    this.embargoDate$ = this.object.accessStatus.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((accessStatus: AccessStatusObject) => hasValue(accessStatus.embargoDate) ? accessStatus.embargoDate : null),
      catchError(() => observableOf(null)),
    );
    this.accessStatus$ = this.embargoDate$.pipe(
      map(date => hasValue(date) ? 'embargo.listelement.badge' : null),
    );
    this.subs.push(
      this.embargoDate$.subscribe(date => {
        this.accessStatusClass = hasValue(date) ? 'embargo-listelement-badge' : '';
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
