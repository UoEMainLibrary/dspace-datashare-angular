import { Injectable, computed, signal } from '@angular/core';
import { Observable, BehaviorSubject, take, switchMap, of as observableOf, map, filter, } from 'rxjs';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../core/auth/auth.service';
import { DatashareUsernameModel } from './datashare-username.model';
import { EPerson } from '../core/eperson/models/eperson.model';
import { hasValue } from '../shared/empty.util';

@Injectable({
  providedIn: 'root'
})
export class DatashareSubmissionService {

  MAX_FILE_SIZE_GB = 20;
  MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_GB * 1024 * 1024 * 1024;

  // Single shared signal for deposit button state
  private _hasUploadFilesErrorsSignal = signal<boolean>(true);
  public readonly hasUploadFilesErrorsSignal = this._hasUploadFilesErrorsSignal.asReadonly();
  // Subscription to the auth service to get the current user
  private _depositorUsernameSubscription: any = null;
  // Shared signal for depositor username with readonly access
  private _datashareDepositorUsernameSignal = signal<DatashareUsernameModel>(new DatashareUsernameModel());
  public readonly datashareDepositorUsernameSignal = this._datashareDepositorUsernameSignal.asReadonly();


  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    console.log('DatashareSubmissionService created');
  }

  /**
   * Update the deposit button visibility state
   */
  updatehasUploadFilesErrors(show: boolean): void {
    console.log('Updating hasUploadFilesErrors to:', show);
    this._hasUploadFilesErrorsSignal.set(show);
  }

  /**
   * Calculate total size of uploaded files
   * @param files Array of file objects with sizeBytes property
   * @returns Total size in bytes
   */
  calculateTotalUploadedFilesSize(files: any[]): number {
    return files.reduce((total, file) => {
      return total + (file.sizeBytes || 0);
    }, 0);
  }

  /**
   * Check if total uploaded files size exceeds the maximum allowed size.
   * @param totalUploadedFilesSize Number of bytes
   * @returns True if total size exceeds the maximum allowed size, false otherwise
   */
  isTotalUploadedFilesSizeExceeded(totalUploadedFilesSize: number): boolean {
    return totalUploadedFilesSize > this.MAX_FILE_SIZE_BYTES;
  }

  /**
   * Format bytes to human readable format
   * @param bytes Number of bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get duplicate file names from an array of file names
   * @param fileNames Array of file names
   * @returns Array of duplicate file names
   */
  getDuplicateFileNames(fileNames: string[]): string[] {
    const counts = fileNames.reduce((acc, fileName) => {
      acc[fileName] = (acc[fileName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).filter(fileName => counts[fileName] > 1);
  }

  /**
   * Get duplicate file names as a formatted string
   * @param fileNames Array of file names
   * @returns Comma-separated string of duplicates or 'None'
   */
  getDuplicateFileNamesDisplay(fileNames: string[]): string {
    const duplicates = this.getDuplicateFileNames(fileNames);
    return duplicates.length > 0 ? duplicates.join(', ') : '';
  }

  /**
   * Create a signal-based duplicate file name detector
   * @param initialFileNames Initial array of file names
   * @returns Object with fileNamesSignal and hasUploadFilesErrorsSignal
   */
  createDuplicateFileNameDetector(initialFileNames: string[] = []) {
    const fileNamesSignal = signal<string[]>(initialFileNames);

    const hasUploadFilesErrorsSignal = computed(() => {
      const duplicates = this.getDuplicateFileNames(fileNamesSignal());
      return duplicates.length !== 0;
    });

    return {
      fileNamesSignal,
      hasUploadFilesErrorsSignal,
      updateFileNames: (newFileNames: string[]) => fileNamesSignal.set(newFileNames),
      getDuplicates: () => this.getDuplicateFileNames(fileNamesSignal()),
      getDuplicateFileNamesDisplay: () => this.getDuplicateFileNamesDisplay(fileNamesSignal()),
    };
  }

  /**
   * Send a notification that the submission cannot be submitted.
    */
  sendCannotSubmitNotification(): void {
    this.notificationsService.error(null, this.translate.get('datashare.submission.sections.upload.submit.errors'));
  }

  /**
   * Create an observable to get the depositor username.
   */
  getDepositorUserName$(): Observable<DatashareUsernameModel> {
    return this.authService.isAuthenticated()
      .pipe(
        switchMap((loggedIn: boolean) => {
          if (loggedIn) {
            // console.log('Authenticated user:', this.authService.getAuthenticatedUserFromStore());
            return this.authService.getAuthenticatedUserFromStore();
          }
          return observableOf(undefined);
        }),
        // Filter out undefined/null values and keep retrying until we get a valid EPerson
        filter((eperson: EPerson) => hasValue(eperson) && hasValue(eperson.firstName) && hasValue(eperson.lastName)),
        take(1), // Take only the first valid result
        map((eperson: EPerson) => {
          const datashareUsername = new DatashareUsernameModel();
          console.log('Authenticated user:', eperson.firstName + ' ' + eperson.lastName);
          datashareUsername.firstName = eperson.firstName;
          datashareUsername.lastName = eperson.lastName;
          return datashareUsername;
        })
      );
  }

  /**
   *  Create a signal for the user name.
   */
  createDepositorUserNameSignal() {
    // Prevent multiple subscriptions
    if (this._depositorUsernameSubscription) {
      // console.log('Depositor username subscription already exists, skipping');
      return;
    }

    console.log('Creating signal for depositor username');
    this._depositorUsernameSubscription = this.getDepositorUserName$().subscribe(datashareUsername => {
      // console.log('Depositor username:', datashareUsername);
      this._datashareDepositorUsernameSignal.set(datashareUsername);
    });
  }
}

