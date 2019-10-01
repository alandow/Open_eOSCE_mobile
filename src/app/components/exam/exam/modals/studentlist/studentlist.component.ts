import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ModalDialogService, ModalDialogOptions, ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Student } from '~/app/models/student.model';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';


@Component({
  selector: 'ns-studentlist',
  templateUrl: './studentlist.component.html',
  styleUrls: ['./studentlist.component.css'],
  moduleId: module.id,
})

export class StudentlistComponent implements OnInit {
  public result: string;

  constructor(private params: ModalDialogParams) {
    this.studentlist = params.context.studentlist;
    this.displayedStudentList = new ObservableArray<Student>(this.studentlist);
  }

  ngOnInit() {
  }

  public studentlist: Student[] = [];

  public displayedStudentList = new ObservableArray<Student>(this.studentlist);


  public close(result: Student) {
    this.params.closeCallback(result);
  }

    // pick and load a student from the list, reset the assessment
    selectStudent(student) {
      console.log('examdetail.component.ts.selectStudent:' + JSON.stringify(student))
      //this.selectedStudent = student;
      // reset the assessment a new answer
      //this.currentAssessment = _.cloneDeep(this.assessmentTemplate);
      this.close(student);
    }

  // filter student list based on the text input
  onStudentSearchTextChanged(event) {
    let searchBar = <SearchBar>event.object;
    let searchValue = searchBar.text.toLowerCase();
    console.log("SearchBar text changed! New value: " + searchBar.text);
    this.displayedStudentList = new ObservableArray<Student>();
    if (searchValue !== "") {
      for (let i = 0; i < this.studentlist.length; i++) {
        if (((this.studentlist[i].fname.toLowerCase() + ' ' + this.studentlist[i].lname.toLowerCase()).indexOf(searchValue) !== -1) || (this.studentlist[i].studentid.toLowerCase().indexOf(searchValue) !== -1)) {
          this.displayedStudentList.push(this.studentlist[i]);
        }
      }
    }else{
      this.displayedStudentList = new ObservableArray<Student>(this.studentlist);
    }
  }



}
