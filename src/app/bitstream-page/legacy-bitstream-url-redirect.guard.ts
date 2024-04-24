import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, UrlTree, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';
import { hasNoValue } from '../shared/empty.util';
import { BitstreamDataService } from '../core/data/bitstream-data.service';
import { ServerResponseService } from '../core/services/server-response.service';
import { map, tap } from 'rxjs/operators';
import { PAGE_NOT_FOUND_PATH } from '../app-routing-paths';
import { getFirstCompletedRemoteData } from '../core/shared/operators';

/**
 * Redirects to a bitstream based on the handle of the item, and the sequence id or the filename of the
 * bitstream. In production mode the status code will also be set the status code to 301 marking it as a permanent URL
 * redirect for bots.
 *
 * @returns Observable<UrlTree> Returns a URL to redirect the user to the new URL format
 */
export const legacyBitstreamURLRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  bitstreamDataService: BitstreamDataService = inject(BitstreamDataService),
  serverResponseService: ServerResponseService = inject(ServerResponseService),
  router: Router = inject(Router),
): Observable<UrlTree> => {
  const prefix = route.params.prefix;
  const suffix = route.params.suffix;
  const filename = route.params.filename;
  let sequenceId = route.params.sequence_id;
  if (hasNoValue(sequenceId)) {
    sequenceId = route.queryParams.sequenceId;
  }
  return bitstreamDataService.findByItemHandle(
    `${prefix}/${suffix}`,
    sequenceId,
    filename,
  ).pipe(
    getFirstCompletedRemoteData(),
    tap((rd: RemoteData<Bitstream>) => {
      if (rd.hasSucceeded && !rd.hasNoContent) {
        serverResponseService.setStatus(301);
      }
    }),
    map((rd: RemoteData<Bitstream>) => {
      if (rd.hasSucceeded && !rd.hasNoContent) {
        return router.parseUrl(`/bitstreams/${rd.payload.uuid}/download`);
      } else {
        return router.createUrlTree([PAGE_NOT_FOUND_PATH]);
      }
    })
  );
};
