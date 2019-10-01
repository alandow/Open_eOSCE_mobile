import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { Config } from '~/app/models/config.model';
import { User } from '~/app/models/user.model';
import { UserService } from '~/app/services/user.service';
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { NetworkServiceService } from '~/app/services/network-service.service';
import { isIOS } from "tns-core-modules/platform";
import { StatusService } from '~/app/services/status.service';
import { Popup } from 'nativescript-popup';
import { Label } from "tns-core-modules/ui/label";
import { Page } from 'tns-core-modules/ui/page/page';
import { Button } from "tns-core-modules/ui/button";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout/stack-layout';



@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  moduleId: module.id,
})

export class LoginComponent implements OnInit {
  /* username: string = 'user1';
  password: string = 'password'; */
  username: string = '';
  password: string = '';
  loginResult: object = {};
  userResult: object = {};
  config: Config;
  processing: boolean = false;
  haserror = false;
  errormessage = '';

  // keyboard control
  private iqKeyboard: IQKeyboardManager;

  private popup: Popup;


  @ViewChild("passwordControl", { static: false }) passwordControl: ElementRef;

  constructor(
    public userService: UserService,
    public networkService: NetworkServiceService,
    // public loginService:LoginService,
    private router: Router,
    //private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private routerExtensions: RouterExtensions,
    private statusservice: StatusService,
    private page: Page
  ) {
    // is there a config?
    //if ((this.networkService.config.name)&&(this.networkService.config.service_url)&&(this.networkService.config.client_secret)&&(this.networkService.config.client_id)) {
      if (this.networkService.config) {  
    console.log(networkService.config);
    } else {
      console.log('goto config');
      this.routerExtensions.navigate(['config']);
    }
    if (isIOS) {
      this.iqKeyboard = IQKeyboardManager.sharedManager();
      this.iqKeyboard.keyboardDistanceFromTextField = 80;
      this.iqKeyboard.shouldResignOnTouchOutside = true;
      this.iqKeyboard.shouldShowTextFieldPlaceholder = true;
    }
    // subscribe to messages coming from the network service...
    // statusservice.connectionChanged$.subscribe(
    //   status => {
    //     console.log('in login.component.ts the network status is:'+status);//this.history.push(`${astronaut} confirmed the mission`);
    //   });
  }


  ngOnInit() {
    this.processing = false;
    //this.login();
  }

  focusPassword() {
    this.passwordControl.nativeElement.focus();
}
  // show a hint
  hint(targetid: string, messagetext: string) {
    const stack: any = new StackLayout();
  
    //stack.height = '100%';
    stack.className = 'dialog';
    stack.horizontalAlignment = 'center';
    stack.verticalAlignment = 'center';
    const lbl: any = new Label();
    lbl.text = messagetext;
    lbl.textAlignment = 'center'
   // lbl.textWrap = true;
    lbl.className = 'popuplabel';
    //lbl.backgroundColor = '#f6f6f6';
    //lbl.marginTop = 5;
    //lbl.height = 40;
    stack.addChild(lbl);
    const dismissBtn = new Button();
    dismissBtn.className = 'btn-info';
    dismissBtn.text = 'Got it';
    stack.addChild(dismissBtn);

    dismissBtn.on('tap', args => {
      console.log('closing popup');
      this.hidePopup();
    });

    this._showPopup(this.page.getViewById(targetid), stack);
  }

  // show a popup
  _showPopup(source, view) {
    this.popup = new Popup({
      backgroundColor: '#f6f6f6',
     width: 20,
      height:10,
      unit: '%',
      elevation: 10,
      borderRadius: 5
    });
    this.popup.showPopup(source, view).then(data => {
      console.log(data);
    });
  }

  hidePopup(index?) {
    this.popup.hidePopup(index);
  }

  login() {
    // turn on the waiting thing
    this.processing = true;
    this.haserror = false;

    this.networkService.login(this.username, this.password)
      .subscribe(observableresult => {
        console.log(JSON.stringify(observableresult['status']));
        // is there a status? If so, it's probably an error
        if (typeof (observableresult['status']) !== 'undefined') {
          if (observableresult['status'] == '401') {
            // 401 is a bad authentication
            this.handleError('Login failed');
            this.networkService.logged_on = false;
            return;
          } else {
            // anything else is something wrong with the network or the backend service
            this.handleError('Network error');
            this.networkService.logged_on = false;
            return;
          }
        }

        // no status; we're in, boys!
        // Question... do we really need to test further?
        this.networkService.access_token = observableresult['access_token'];
        this.networkService.getUserDetails()
          .subscribe(result => {
            console.log(JSON.stringify(result));
            if (typeof (result['status']) !== 'undefined') {
              // if there's a status at all, there's a problem
              //this.handleError('Network error: ' + result['message']);
              this.handleError('Network error: ' + result['message']);
              return;
            }
            // store the user details
            this.userService.user.id = result['id'];
            this.userService.user.name = result['name'];
            this.userService.user.type = result['type'];
            this.userService.user.currentToken = this.networkService.access_token;
            this.networkService.logged_on = true;
            // turn off the waiting dialog
            this.processing = false;
            // go to the examlist page
            this.routerExtensions.navigate(['examlist']);
          }),
          error => this.handleError(error)

      }),
      error => this.handleError(error);
  }

  handleError(message: string) {
    console.log('handleError called');
    this.haserror = true;
    this.processing = false
    this.errormessage = message;
  }


  alert(message: string) {
    return alert({
      title: "Error",
      okButtonText: "OK",
      message: message
    });
  }

}
