import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Assessment } from '~/app/models/assessment.model';
import { UserService } from '~/app/services/user.service';
import { NetworkServiceService } from '~/app/services/network-service.service';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import { Couchbase } from 'nativescript-couchbase-plugin';
import { Toasty, ToastPosition } from 'nativescript-toasty';
import { StatusService } from '~/app/services/status.service';
import { Observable, PropertyChangeData } from 'tns-core-modules/data/observable';


@Component({
  selector: 'ns-examlist',
  templateUrl: './examlist.component.html',
  styleUrls: ['./examlist.component.css'],
  moduleId: module.id,
})
export class ExamlistComponent implements OnInit {
  processing: boolean = false;
  haserror = false;
  errormessage = '';
  assessmentlist: Assessment[] = [];
  // keeping cached ones 
  cachedassessmentlist: Assessment[] = [];



  // storage
  private storageDatabase: Couchbase;

  constructor(public userservice: UserService,
    private networkService: NetworkServiceService,
    // weird spelling because this seemed to somehow interact badly with the same service on other views
    private modaalService: ModalDialogService,
    public statusService: StatusService,

    private routerExtensions: RouterExtensions,
    private viewContainerRef: ViewContainerRef) {
    this.storageDatabase = new Couchbase('storage');
 
  }

  ngOnInit() {
    console.log('examlist.component.ts ngOnInit called');
    this.getAssessments();
  }

  ngAfterViewInit() {
    console.log('examlist.component.ts ngAfterViewInit')
  }

  getAssessments() {
    this.processing = true;
    this.haserror = false;
    console.log("examilst.component.ts says: getAssessments() called");
    this.networkService.getUserAssessments()
      .subscribe(result => {
        if (typeof (result['status']) !== 'undefined') {
          // of there's a status at all, there's a problem
          this.handleError('Network error: ' + result['message']);
          return;
        }
        result.forEach(element => {
          // console.log('Element:'+JSON.stringify(element));
          this.assessmentlist.push(element);

        });
        this.processing = false;
        this.haserror = false;
        if (getConnectionType() == (connectionType.wifi || connectionType.mobile)) {
          this.storageDatabase.createDocument({ 'type': 'cached_examlist', 'data': result });
        }
        console.log('assessment list is:' + JSON.stringify(this.assessmentlist));
       
      }),
      error => console.log(error),
      () => console.log('login.component.ts.login() subscription complete result:complete');
  }

  logout() {
    let options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      animated: true,
      context: { titletext: 'Really log out?', messagetext: '', confirmtext: "Log out", canceltext: 'Cancel' }
    };
    var parent = this;
    this.modaalService.showModal(ConfirmComponent, options)
      .then(result => {
        if (result) {
          this.processing = true;
          this.haserror = false;
          console.log("examilst.component.ts says: getAssessments() called");
          this.networkService.logout()
            .subscribe(result => {
              if (typeof (result['status']) !== 'undefined') {
                // of there's a status at all, there's a problem
                this.handleError('Network error: ' + result['message']);
                return;
              }
              this.processing = false;
              this.haserror = false;
              this.userservice.user.id = '';
              this.userservice.user.name = '';
              this.userservice.user.type = '';
              this.networkService.access_token = '';
              this.userservice.user.currentToken = '';
              this.networkService.logged_on = false;
              // go to the login page
              this.routerExtensions.navigate(['login'], { transition: { name: "slideRight" } });


              //console.log('assessment list is:'+JSON.stringify(this.assessmentlist));
            }),
            error => console.log(error),
            () => console.log('login.component.ts.login() subscription complete result:complete');

        }
      });

  }

  handleError(message: string) {
    console.log('handleError called');
    this.haserror = true;
    this.processing = false
    this.errormessage = message;
  }

}
