import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { UploaderComponent } from '../../../../../../app/shared/upload/uploader/uploader.component';
import { SubmissionUploadFilesComponent as BaseComponent } from '../../../../../../app/submission/form/submission-upload-files/submission-upload-files.component';
import { TranslateModule } from '@ngx-translate/core';
import { AlertComponent } from '../../../../../../app/shared/alert/alert.component';
import { AlertType } from '../../../../../../app/shared/alert/alert-type';


@Component({
  selector: 'ds-themed-submission-upload-files',
  // DATASHARE - start
  templateUrl: './submission-upload-files.component.html',
  //templateUrl: '../../../../../../app/submission/form/submission-upload-files/submission-upload-files.component.html',
  // DATASHARE - end
  imports: [
    UploaderComponent,
    NgIf,
    // DATASHARE - start
    AlertComponent,
    TranslateModule,
    // DATASHARE - end
  ],
  standalone: true,
})
export class SubmissionUploadFilesComponent extends BaseComponent {
  //  DATASHARE - start
  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;
  //  DATASHARE - end
}
