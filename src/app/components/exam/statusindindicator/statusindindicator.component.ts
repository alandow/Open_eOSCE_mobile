import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { StatusService } from '~/app/services/status.service';

@Component({
  selector: 'ns-statusindindicator',
  templateUrl: './statusindindicator.component.html',
  styleUrls: ['./statusindindicator.component.css'],
  moduleId: module.id,
})
export class StatusindindicatorComponent implements OnInit {

  constructor(public status:StatusService) { }

  @Output() networkStatusChange = new EventEmitter();

  
  // hacking the text change event- probably a much more elegant way of doing this...
  onTextChange(){
   // this.networkStatusChange.emit({ connected:this.status.connected });
  }
  
  ngOnInit() {
  }

}
