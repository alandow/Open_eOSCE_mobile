import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'ns-submitconfirm',
  templateUrl: './submitconfirm.component.html',
  styleUrls: ['./submitconfirm.component.css'],
  moduleId: module.id,
})
export class SubmitconfirmComponent implements OnInit {
  private status: string = "";

  constructor(private params: ModalDialogParams) {
  }

  ngOnInit() {
    this.status = this.params.context.status

  }
  public close(result: boolean) {
    this.params.closeCallback();
  }

}
