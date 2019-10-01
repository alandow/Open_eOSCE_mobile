import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'ns-helppopup',
  templateUrl: './helppopup.component.html',
  styleUrls: ['./helppopup.component.css'],
  moduleId: module.id,
})
export class HelpPopup extends Observable implements OnInit{


private messagetext = '';


@Output() changeEvent = new EventEmitter();

  constructor(public message: string) {
    super();
  }

  ngOnInit() {
    this.messagetext = this.message;
  }

  // send something- anything
  public close(result: boolean) {
    this.changeEvent.emit({status:true});
  }
}
