import { Component, OnInit } from '@angular/core';
import { Config } from '~/app/models/config.model';
import { Couchbase } from 'nativescript-couchbase-plugin';
import { BarcodeScanner } from 'nativescript-barcodescanner';
import { NetworkServiceService } from '~/app/services/network-service.service';
import { ActivatedRoute } from '@angular/router';
import { Page } from "tns-core-modules/ui/page";
import { isIOS } from "tns-core-modules/platform";
import * as utils from "tns-core-modules/utils/utils";
import { TextField } from "tns-core-modules/ui/text-field";
import { RouterExtensions } from 'nativescript-angular/router';


@Component({
  selector: 'ns-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  moduleId: module.id,
})

export class ConfigComponent implements OnInit {
  config: Config = new Config();
  storageDatabase: Couchbase;
  observableresult: object = {};
  // keyboard control
  private iqKeyboard: IQKeyboardManager;
  // processing indicator
  processing = false;
  // show an error message
  haserror = false;
  errormessage: string = '';

  // show a success message
  hassuccess = false;
  successmessage: string = '';

  constructor(private barcodeScanner: BarcodeScanner, private networkService: NetworkServiceService,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
  ) {
    // get values from storage if available
    this.storageDatabase = new Couchbase('storage');
    if (this.storageDatabase.getDocument("config")) {
      console.log('current config:' + JSON.stringify(this.storageDatabase.getDocument("config")));
      this.config = this.storageDatabase.getDocument("config");
    }
  }
  // keboard tweaks
  if(isIOS) {
    this.iqKeyboard = IQKeyboardManager.sharedManager();
    this.iqKeyboard.keyboardDistanceFromTextField = 80;
    this.iqKeyboard.shouldResignOnTouchOutside = true;
    this.iqKeyboard.shouldShowTextFieldPlaceholder = true;
  }

  ngOnInit() {
  }

  public update() {
    if (this.storageDatabase.getDocument("config")) {
      this.storageDatabase.updateDocument("config", this.config);
    } else {
      this.storageDatabase.createDocument(this.config, 'config');
    }
    this.networkService.config = this.config;
  }

  scanBarcode() {
    console.log('config.component.ts scanBarcode called');
    this.barcodeScanner.requestCameraPermission().then(
      () => {
        console.log("Camera permission requested");
        this.barcodeScanner.scan({
          formats: "QR_CODE, EAN_13",
          cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
          cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
          message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
          showFlipCameraButton: true,   // default false
          preferFrontCamera: false,     // default false
          showTorchButton: true,        // default false
          beepOnScan: false,             // Play or Suppress beep on scan (default true)
          torchOn: false,               // launch with the flashlight on (default false)
          closeCallback: () => { console.log("Scanner closed") }, // invoked when the scanner was closed (success or abort)
          resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
          // orientation: orientation,     // Android only, default undefined (sensor-driven orientation), other options: portrait|landscape
          openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
        }).then((result) => {
          // Note that this Promise is never invoked when a 'continuousScanCallback' function is provided
          console.log("Format: " + result.format + ",\nValue: " + result.text);
          try {
            let resultObj = JSON.parse(result.text);
            console.log("Result object: " + resultObj);
            if ((!!resultObj.service_url) && (!!resultObj.name) && (!!resultObj.client_id) && (!!resultObj.client_secret)) {
              this.config.name = resultObj.name;
              this.config.service_url = resultObj.service_url;
              this.config.client_id = resultObj.client_id;
              this.config.client_secret = resultObj.client_secret;
              this.update();
            } else {
              console.log('Not an eosce config code');
              this.errormessage = 'Not a valid Open eOSCE config code';
            }
          }
          catch (e) {
            console.log(e)
          }
          // this.config = 
          /*   alert({
              title: "Scan result",
              message: "Format: " + result.format + ",\nValue: " + result.text,
              okButtonText: "OK"
            }); */
        }, (errorMessage) => {
          this.errormessage = "No scan. " + errorMessage;
        });
      }
    );
    // hardcoded values for development
   // this.config.name = 'Open eOSCEmo';
    //this.config.service_url = 'http://192.168.1.52/eosce_laravel2';
    //this.config.client_id = '3';
    //this.config.client_secret = 'AhQjIqv7TzuYoTNTFe36tZNPaQLEfHKbzeBLhyEK';
    //this.update();
  }

  // these next few things are to deal with a little lag in updating the model.
  // Binding doesn't seem to be perfect
  // I mean, you should be doing this via the QR code scanny thing anyway, but you never know what people do...
  onURLChange(args) {
    console.log('onTextChange');
    this.config.service_url = args.value;
    console.log(this.config.service_url)
  }

  onClientIDChange(args) {
    this.config.client_id = args.value;
  }
  onClientSecretChange(args) {
    this.config.client_secret = args.value;
  }

  // send a little request to the backend sevice to confirm that the config values are correct
  checkConfig() {
    this.processing = true;

    this.networkService.checkConfig(this.config)
      .subscribe(result => {
        this.processing = false;
        console.log('config.component.ts.checkConfig() subscription result:' + JSON.stringify(result));
        //this.observableresult = observableresult;
        // test for correctness
        /*  for (let key in result) {
 
           console.log('key is'+key);
         }; */
        console.log(result.status)
        if ((result.status !== undefined) && (result.status.toString()=='true')) {
          console.log('correct!')
          this.haserror = false;
          this.hassuccess = true;
          this.successmessage = "Configuration for" + result.sysname + " valid :)";
          this.config.name = result.sysname;
          this.update();
        } else {
          this.hassuccess = false;
          this.haserror = true;
          this.errormessage = 'Unable to validate config :('
        }
      }),

      error => {
        this.hassuccess = false;
        this.haserror = true;
        this.errormessage = 'Unable to validate config :('
      },
      () => console.log('config.component.ts.checkConfig() subscription complete result:complete');
  }
  // return to login
  back() {
    this.update();
    this.routerExtensions.back();
  }
}

