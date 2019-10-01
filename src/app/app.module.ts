import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { HttpClientModule } from "@angular/common/http";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { UserService } from "./services/user.service";
import { ConfigComponent } from "./components/config/config.component";
import { ExamlistComponent } from "./components/exam/examlist/examlist.component";
import { ExamComponent } from "./components/exam/exam/exam.component";
import { ExamitemComponent } from "./components/exam/exam/examitem/examitem.component";
import { SelectstudententryComponent } from "./components/exam/exam/modals/studentlist/selectstudententry/selectstudententry.component";
import { StudentlistComponent } from "./components/exam/exam/modals/studentlist/studentlist.component";
import { CommentEntryComponent } from "./components/exam/exam/modals/comment-entry/comment-entry.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ConfirmComponent } from './components/modals/confirm/confirm.component';
import { HelpPopup } from './components/modals/helppopup/helppopup.component';
import { StatusindindicatorComponent } from './components/exam/statusindindicator/statusindindicator.component';
import { StatusService } from "./services/status.service";
import { registerElement } from "nativescript-angular";
registerElement("PreviousNextView", () => require("nativescript-iqkeyboardmanager").PreviousNextView);

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        TNSCheckBoxModule,
        HttpClientModule,
        NativeScriptFormsModule
    ],
    entryComponents: [StudentlistComponent,
        CommentEntryComponent,
        ConfirmComponent
        ],
    declarations: [
        AppComponent,
        LoginComponent,
        ConfigComponent,
        ExamlistComponent,
        ExamComponent,
        ExamitemComponent,
        SelectstudententryComponent,
        StudentlistComponent,
        CommentEntryComponent,
        ConfirmComponent,
        HelpPopup,
        StatusindindicatorComponent
    ],
    // include services in here to make them available throughout the app...
    providers: [
        BarcodeScanner,
        UserService,
        StatusService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
