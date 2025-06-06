import { Injectable, computed, signal } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatashareCustomisedSubmissionService {

  // Single shared signal for deposit button state
  private _showDepositButtonSignal = signal<boolean>(true);
  public readonly showDepositButtonSignal = this._showDepositButtonSignal.asReadonly();

  constructor() { 
    console.log('DatashareCustomisedSubmissionService created');
  }

  /**
   * Update the deposit button visibility state
   */
  updateShowDepositButton(show: boolean): void {
    console.log('Updating showDepositButton to:', show);
    this._showDepositButtonSignal.set(show);
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
    return duplicates.length > 0 ? duplicates.join(', ') : 'None';
  }

  /**
   * Create a signal-based duplicate file name detector
   * @param initialFileNames Initial array of file names
   * @returns Object with fileNamesSignal and showDepositButtonSignal
   */
  createDuplicateFileNameDetector(initialFileNames: string[] = []) {
    const fileNamesSignal = signal<string[]>(initialFileNames);

    const showDepositButtonSignal = computed(() => {
      const duplicates = this.getDuplicateFileNames(fileNamesSignal());
      return duplicates.length === 0;
    });

    return {
      fileNamesSignal,
      showDepositButtonSignal,
      updateFileNames: (newFileNames: string[]) => fileNamesSignal.set(newFileNames),
      getDuplicates: () => this.getDuplicateFileNames(fileNamesSignal())
    };
  }

  /**
   * Create an observable-based duplicate file name detector
   * @param fileNames$ Observable of file names array
   * @returns Observable that emits true when no duplicates exist
   */
  createObservableDuplicateDetector(fileNames$: Observable<string[]>): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      fileNames$.subscribe(fileNames => {
        const duplicates = this.getDuplicateFileNames(fileNames);
        subscriber.next(duplicates.length === 0);
      });
    });
  }
}
