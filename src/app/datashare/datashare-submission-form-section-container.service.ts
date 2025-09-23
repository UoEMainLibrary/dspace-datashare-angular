import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatashareSubmissionFormSectionContainerService {

  openPanelId = signal<string | null>(null);

  sectionPanelIds = signal<string[]>([]);

  constructor() { }

  /**
   * Set the ID of the currently open panel
   * @param id The ID of the panel to open, or null to close all panels
   */
  setOpenPanelId(id: string | null): void {
    console.log('Setting open panel ID to:', id);
    this.openPanelId.set(id);
  }
}
