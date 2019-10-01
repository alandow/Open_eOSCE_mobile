import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'ns-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
  moduleId: module.id,
})
export class ConfirmComponent implements OnInit {

private titletext:string = '';
private messagetext = '';
private confirmtext:string = '';
private canceltext:string = '';

  constructor(private params: ModalDialogParams) {
  }

  ngOnInit() {
    this.titletext = this.params.context.titletext;
    this.confirmtext = this.params.context.confirmtext;
    this.canceltext = this.params.context.canceltext;
    this.messagetext = this.params.context.messagetext;
  }

  public close(result: boolean) {
    this.params.closeCallback(result);
  }
}
