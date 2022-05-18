import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HasPermissionDirective} from "./directives/has-permission.directive";
import {DialogComponent} from './components/dialog/dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {OtpDialogComponent} from './components/otp-dialog/otp-dialog.component';
import {ErrorTranslatorPipe} from "./pipes/error-translator.pipe";
import {SmsRequestComponent} from './components/sms-request/sms-request.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HoverDirective} from "./directives/hover.directive";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {SearchPermissionPipe} from "../dashboard/role-managment/role-permissions/search-permission.pipe";
import {SelectionDialogComponent} from './components/selection-dialog/selection-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LoadingComponent} from './components/loading/loading.component';
import {MatCardModule} from "@angular/material/card";
import {ImageViewerComponent} from './components/image-viewer/image-viewer.component';
import {FileAttacherComponent} from './components/file-attacher/file-attacher.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./auth.interceptor";


@NgModule({
  declarations: [
    HasPermissionDirective,
    DialogComponent,
    OtpDialogComponent,
    ErrorTranslatorPipe,
    SearchPermissionPipe,
    SmsRequestComponent,
    HoverDirective,
    SelectionDialogComponent,
    LoadingComponent,
    ImageViewerComponent,
    FileAttacherComponent,
  ],
  entryComponents: [DialogComponent],
  exports: [
    HasPermissionDirective,
    DialogComponent,
    OtpDialogComponent,
    HoverDirective,
    LoadingComponent,
    ImageViewerComponent,
    SearchPermissionPipe,
    FileAttacherComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {
}
