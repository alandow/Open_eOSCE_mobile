import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Student } from '~/app/models/student.model';
import { EventData, Observable, ViewBase } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'ns-selectstudententry',
  templateUrl: './selectstudententry.component.html',
  styleUrls: ['./selectstudententry.component.css'],
  moduleId: module.id,
})
export class SelectstudententryComponent  implements  OnInit {

  @Input() student: Student = new Student();

  // Event emitter: https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
  @Output() studentSelectEvent = new EventEmitter<Student>();


  
  ngOnInit() {

  }

  onTap() {
    console.log('SelectstudententryComponent onTap')
    this.studentSelectEvent.emit(this.student);
  }

}
