import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'ns-logoutconfirm',
  templateUrl: './logoutconfirm.component.html',
  styleUrls: ['./logoutconfirm.component.css'],
  moduleId: module.id,
})
export class LogoutconfirmComponent implements OnInit {

  constructor(private params: ModalDialogParams) {
  }

  ngOnInit() {
  }
  public close(result: boolean) {
    this.params.closeCallback(result);
  }
}
