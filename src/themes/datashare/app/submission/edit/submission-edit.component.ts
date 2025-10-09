import { AfterViewInit, ChangeDetectorRef, Component, computed, effect, inject, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';

import { SubmissionEditComponent as BaseComponent } from '../../../../../app/submission/edit/submission-edit.component';
import { SubmissionFormComponent } from '../../../../../app/submission/form/submission-form.component';

/**
 * This component allows to edit an existing workspaceitem/workflowitem.
 * Added functionality to handle license selection and display.
 * Created with Cody AI.
 */
@Component({
  selector: 'ds-themed-submission-edit',
  styleUrls: ['./submission-edit.component.scss', '../../../../../app/submission/edit/submission-edit.component.scss'],
  templateUrl: '../../../../../app/submission/edit/submission-edit.component.html',
  standalone: true,
  imports: [
    SubmissionFormComponent,
  ],
})

export class SubmissionEditComponent extends BaseComponent implements AfterViewInit, OnDestroy {
  // DATASHARE - start

  // Use ViewChild to get a reference to the component's root element
  @ViewChild('submissionForm', { static: false, read: ElementRef })
  private submissionFormRef?: ElementRef<HTMLElement>;

  // Inject dependencies using the inject function
  private cdr = inject(ChangeDetectorRef);

  // Signals for managing state
  private licenseDropdownValue = signal<string>('');
  private elementsInitialized = signal<boolean>(false);

  // Computed signal to determine if textarea should be disabled
  private shouldDisableTextarea = computed(() => {
    const currentValue = this.licenseDropdownValue();
    // console.log('🧮 Computing shouldDisableTextarea:', {
    //   currentValue,
    //   isEmpty: currentValue === '',
    //   isOther: currentValue === 'Other',
    //   result: currentValue !== 'Other'
    // });
    return currentValue !== 'Other';
  });

  // Store element references
  private dropdownElement: HTMLElement | null = null;
  private textareaElement: HTMLTextAreaElement | null = null;
  private dropdownChangeHandler?: (event: Event) => void;
  private retryCount = 0;
  private maxRetries = 10;
  private mutationObserver?: MutationObserver;

  // Effect to handle textarea state changes
  private licenseEffect = effect(() => {
    // console.log('🔄 Effect triggered');
    // console.log('Elements initialized:', this.elementsInitialized());
    // console.log('Textarea element exists:', !!this.textareaElement);
    // console.log('License dropdown value:', `"${this.licenseDropdownValue()}"`);

    if (this.elementsInitialized() && this.textareaElement) {
      // console.log('✅ Updating textarea state');
      this.updateTextareaState();
    } else {
      // console.log('❌ Conditions not met for textarea update');
    }
  });

  ngAfterViewInit(): void {
    // console.log('🚀 ngAfterViewInit called');

    // // Call parent's ngAfterViewInit if it exists
    // if (super.ngAfterViewInit) {
    //   super.ngAfterViewInit();
    // }

    // Wait for the DOM to be fully rendered
    setTimeout(() => {
      // console.log('⏰ Setting up license elements after timeout');
      this.setupLicenseElements();
    }, 500);
  }

  ngOnDestroy(): void {
    // console.log('🧹 Cleaning up component');

    // Clean up event listeners
    if (this.dropdownElement && this.dropdownChangeHandler) {
      this.dropdownElement.removeEventListener('blur', this.dropdownChangeHandler);
      this.dropdownElement.removeEventListener('change', this.dropdownChangeHandler);
      this.dropdownElement.removeEventListener('click', this.dropdownChangeHandler);
    }

    // Clean up mutation observer
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    // Call parent's ngOnDestroy if it exists
    if (super.ngOnDestroy) {
      super.ngOnDestroy();
    }
  }

  private setupLicenseElements(): void {
    // console.log('🔍 Setting up license elements... (Attempt:', this.retryCount + 1, ')');

    // Try to find elements within the component's scope first, then globally
    const searchScope = this.submissionFormRef?.nativeElement || document;

    this.dropdownElement = searchScope.querySelector('#combobox_ds_license_dropdown-value_listbox') as HTMLElement;
    this.textareaElement = searchScope.querySelector('#ds_license_rights-text') as HTMLTextAreaElement;

    // If not found in component scope, try global search
    if (!this.dropdownElement || !this.textareaElement) {
      // console.log('🔍 Elements not found in component scope, trying global search...');
      this.dropdownElement = document.getElementById('combobox_ds_license_dropdown-value_listbox') as HTMLElement;
      this.textareaElement = document.getElementById('ds_license_rights-text') as HTMLTextAreaElement;
    }

    // console.log('Dropdown element found:', !!this.dropdownElement);
    // console.log('Textarea element found:', !!this.textareaElement);

    if (this.dropdownElement && this.textareaElement) {
      // console.log('✅ Both elements found, initializing...');

      // Set up mutation observer to watch for dynamic changes
      this.setupMutationObserver();

      const initialValue = this.getSelectedDropdownValue();
      // console.log('Initial dropdown value:', `"${initialValue}"`);

      this.licenseDropdownValue.set(initialValue);
      this.elementsInitialized.set(true);
      this.setupDropdownListener();
      this.retryCount = 0; // Reset retry count on success
    } else {
      this.retryCount++;
      if (this.retryCount < this.maxRetries) {
        // console.log(`❌ Elements not found, retrying in 1 second... (${this.retryCount}/${this.maxRetries})`);
        setTimeout(() => this.setupLicenseElements(), 1000);
      } else {
        // console.error('❌ Max retries reached. Elements not found:', {
        //   dropdown: !!this.dropdownElement,
        //   textarea: !!this.textareaElement,
        //   availableElements: this.logAvailableElements()
        // });
      }
    }
  }

  private setupMutationObserver(): void {
    if (!this.dropdownElement) return;

    // console.log('👁️ Setting up mutation observer for dropdown changes');

    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // console.log('🔄 DOM mutation detected in dropdown area:', {
          //   type: mutation.type,
          //   target: mutation.target,
          //   addedNodes: mutation.addedNodes.length,
          //   removedNodes: mutation.removedNodes.length,
          //   attributeName: mutation.attributeName
          // });

          // Check if the selected element was added/modified
          const newValue = this.getSelectedDropdownValue();
          const currentValue = this.licenseDropdownValue();

          if (newValue !== currentValue) {
            // console.log('📝 Value changed via mutation:', {
            //   from: `"${currentValue}"`,
            //   to: `"${newValue}"`
            // });
            this.licenseDropdownValue.set(newValue);
            this.cdr.detectChanges();
          }
        }
      });
    });

    // Observe the dropdown and its parent for changes
    this.mutationObserver.observe(this.dropdownElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-selected', 'class', 'title']
    });

    // Also observe the parent element in case the selected element is created there
    if (this.dropdownElement.parentElement) {
      this.mutationObserver.observe(this.dropdownElement.parentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-selected', 'class', 'title']
      });
    }
  }

  private logAvailableElements(): string[] {
    // Helper method to debug what elements are actually available
    const allElements = document.querySelectorAll('[id*="license"], [id*="dropdown"], [id*="rights"], [id*="combobox"]');
    const elementInfo = Array.from(allElements).map(el => ({
      id: el.id,
      tag: el.tagName,
      classes: Array.from(el.classList).join(' ')
    }));
    // console.log('Available license-related elements:', elementInfo);
    return elementInfo.map(info => info.id).filter(id => id);
  }

  private setupDropdownListener(): void {
    // console.log('🎧 Setting up dropdown listener');

    if (!this.dropdownElement) {
      // console.log('❌ No dropdown element found');
      return;
    }

    // Store the previous value to detect actual changes
    let previousValue = this.getSelectedDropdownValue();
    // console.log('Initial previous value for listener:', `"${previousValue}"`);

    this.dropdownChangeHandler = (event: Event) => {
      // console.log('🔥 Dropdown event fired!', {
      //   eventType: event.type,
      //   target: event.target,
      //   currentTarget: event.currentTarget
      // });

      // Add a small delay to ensure DOM is updated
      setTimeout(() => {
        const newValue = this.getSelectedDropdownValue();

        // console.log('📊 Event handler values:', {
        //   previousValue: `"${previousValue}"`,
        //   newValue: `"${newValue}"`,
        //   changed: previousValue !== newValue
        // });

        // Only update the signal if value actually changed
        if (previousValue !== newValue) {
          // console.log('📝 Dropdown value changed from:', `"${previousValue}"`, 'to:', `"${newValue}"`);
          this.licenseDropdownValue.set(newValue);
          previousValue = newValue;

          // Trigger change detection
          this.cdr.detectChanges();
        } else {
          // console.log('👀 Event fired but no value change detected');
        }
      }, 50);
    };

    // Listen to multiple events to catch changes
    this.dropdownElement.addEventListener('change', this.dropdownChangeHandler);
    this.dropdownElement.addEventListener('blur', this.dropdownChangeHandler);
    this.dropdownElement.addEventListener('click', this.dropdownChangeHandler);

    // Listen for keyboard events (arrow keys, enter, etc.)
    this.dropdownElement.addEventListener('keydown', this.dropdownChangeHandler);
    this.dropdownElement.addEventListener('keyup', this.dropdownChangeHandler);

    // Also listen for clicks on the dropdown options if it's a datashare dropdown
    const dropdownOptions = this.dropdownElement.querySelectorAll('[role="option"], option, li, .option');
    // console.log(`Adding click listeners to ${dropdownOptions.length} dropdown options`);

    dropdownOptions.forEach((option, index) => {
      option.addEventListener('click', (event) => {
        // console.log(`🖱️ Option ${index} clicked:`, {
        //   text: option.textContent?.trim(),
        //   value: (option as HTMLOptionElement).value
        // });
        this.dropdownChangeHandler!(event);
      });
    });

    // console.log('✅ Dropdown listeners attached');
  }

  private updateTextareaState(): void {
    // console.log('🔄 Updating textarea state...');

    if (!this.textareaElement) {
      // console.log('❌ No textarea element');
      return;
    }

    const currentDropdownValue = this.licenseDropdownValue();
    const isOtherSelected = this.shouldDisableTextarea();

    // console.log('📊 Textarea update details:', {
    //   currentDropdownValue: `"${currentDropdownValue}"`,
    //   isOtherSelected,
    //   textareaCurrentlyDisabled: this.textareaElement.disabled
    // });

    if (isOtherSelected) {
      // console.log('🔒 Disabling and clearing textarea');
      this.textareaElement.disabled = true;
      this.textareaElement.value = '';
      this.textareaElement.classList.add('disabled-field');
    } else {
      // console.log('🔓 Enabling textarea');
      this.textareaElement.disabled = false;
      this.textareaElement.classList.remove('disabled-field');
    }
  }

  private getSelectedDropdownValue(): string {
    if (!this.dropdownElement) {
      // console.log('❌ No dropdown element for value detection');
      return '';
    }

    // console.log('🔍 Attempting to get dropdown value...');

    // Method 1: Check for selected option with title attribute (might not exist initially)
    const selectedWithTitle = this.dropdownElement.querySelector('#combobox_ds_license_dropdown-value_selected')?.getAttribute('title');
    if (selectedWithTitle) {
      // console.log('✅ Found value via title attribute:', `"${selectedWithTitle}"`);
      return selectedWithTitle;
    }

    // Method 2: Check parent/sibling elements for the selected element
    const parentElement = this.dropdownElement.parentElement;
    if (parentElement) {
      const selectedInParent = parentElement.querySelector('#combobox_ds_license_dropdown-value_selected')?.getAttribute('title');
      if (selectedInParent) {
        // console.log('✅ Found value via parent title attribute:', `"${selectedInParent}"`);
        return selectedInParent;
      }
    }

    // Method 3: Check if it's a regular select element
    if (this.dropdownElement.tagName === 'SELECT') {
      const selectElement = this.dropdownElement as HTMLSelectElement;
      const value = selectElement.options[selectElement.selectedIndex]?.text || selectElement.value || '';
      // console.log('✅ Found value via SELECT element:', `"${value}"`);
      return value;
    }

    // Method 4: Check for aria-selected option
    const ariaSelected = this.dropdownElement.querySelector('[aria-selected="true"]');
    if (ariaSelected) {
      const value = ariaSelected.textContent?.trim() || ariaSelected.getAttribute('title') || '';
      // console.log('✅ Found value via aria-selected:', `"${value}"`);
      return value;
    }

    // Method 5: Check for active/selected class
    const activeOption = this.dropdownElement.querySelector('.selected, .active, [class*="selected"]');
    if (activeOption) {
      const value = activeOption.textContent?.trim() || activeOption.getAttribute('title') || '';
      // console.log('✅ Found value via selected class:', `"${value}"`);
      return value;
    }

    // Method 6: Check input value if it's an input-based dropdown
    const inputElement = this.dropdownElement.querySelector('input');
    if (inputElement) {
      // console.log('✅ Found value via input element:', `"${inputElement.value}"`);
      return inputElement.value;
    }

    // Method 7: Check for currently visible/displayed text
    const displayElement = this.dropdownElement.querySelector('[class*="display"], [class*="current"], [class*="value"]');


    // console.log('⚠️ Could not determine dropdown value using any method');
    return '';
  }
  // Datashare - end
}
