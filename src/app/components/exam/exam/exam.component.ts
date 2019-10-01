import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { Student } from '~/app/models/student.model';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { Assessment } from '~/app/models/assessment.model';
import { Answer } from '~/app/models/answer.model';
import { NetworkServiceService } from '~/app/services/network-service.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '~/app/services/user.service';
import * as _ from "lodash";
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { StudentlistComponent } from './modals/studentlist/studentlist.component';
import { ModalStack, overrideModalViewMethod } from "nativescript-windowed-modal";
import { registerElement } from "nativescript-angular/element-registry";
import { CommentEntryComponent } from './modals/comment-entry/comment-entry.component';
import { isIOS } from "tns-core-modules/platform";
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { RouterExtensions } from 'nativescript-angular/router';
import { Couchbase } from 'nativescript-couchbase-plugin';
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar";
import { Toasty, ToastPosition } from 'nativescript-toasty';
import { StatusService } from '~/app/services/status.service';
import { AssessmentDemo } from '~/app/models/assessment.model_demo';
import { StudentListDemo } from '~/app/models/studentlist_demo.model';
import { Popup } from 'nativescript-popup';
import { Label } from "tns-core-modules/ui/label";
import { Page } from 'tns-core-modules/ui/page/page';
import { Button } from "tns-core-modules/ui/button";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout/stack-layout';




overrideModalViewMethod()
registerElement("ModalStack", () => ModalStack);

@Component({
  selector: 'ns-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css'],
  moduleId: module.id,
})
export class ExamComponent implements OnInit {

  processing = true;
  haserror = false;
  firstrun = true;

  public assessmentTemplate: Assessment;
  currentAssessment: Assessment;
  public answer: Answer[] = [];
  public studentlist: Student[] = [];
  public displayedStudentList = new ObservableArray<Student>(this.studentlist);
  finalcomment = '';
  private snackbar: SnackBar = new SnackBar();
  connnectedstring: string = '';
  headingstring: string = '';

  private exam_id: string;

  private demo_mode = false;

  examEnabled: boolean = false;
  examValid: boolean = false;

  selectedStudent: Student;

  // keyboard control
  private iqKeyboard: IQKeyboardManager;

  // storage
  private storageDatabase: Couchbase;

  connected: boolean = true;

  @ViewChild("mainview", { static: false }) viewContainer: ElementRef;

  constructor(private route: ActivatedRoute,
    public userservice: UserService,
    public networkService: NetworkServiceService,
    public statusService: StatusService,
    private modalService: ModalDialogService,
    private routerExtensions: RouterExtensions,
    private viewContainerRef: ViewContainerRef,
    private page: Page
  ) {
    this.storageDatabase = new Couchbase('storage');

    // iOS keyboard tweaks
    if (isIOS) {
      this.iqKeyboard = IQKeyboardManager.sharedManager();
      this.iqKeyboard.keyboardDistanceFromTextField =200;
      this.iqKeyboard.shouldResignOnTouchOutside = true;
      this.iqKeyboard.shouldShowTextFieldPlaceholder = true;
    }

    // subscribe to connected/disconnected messages coming from the network service, notify accordingly
    statusService.connectionChanged$.subscribe(
      status => {
        console.log('in exam.component.ts the network status is:' + status);
        this.connected = status;
        if (this.currentAssessment) {
          // TODO- make this an icon at some point
          this.connnectedstring = status ? '' : ' (disconnected)';
        }

        const toast = new Toasty({
          text: status ? 'Connected!' : 'Disconnected from server',
          position: ToastPosition.BOTTOM,
          backgroundColor: status ? '#5cb85c' : '#f0ad4e',
          android: { yAxisOffset: 100 },
          ios: {
            // anchorView: someButton.ios, // must be the native iOS view instance (button, page, action bar, tabbar, etc.)
            displayShadow: true,
            /*  shadowColor: '#fff000',
             cornerRadius: 24  */
          }
        });
        toast.show();
      });
  }

  ngOnInit() {
    console.log('exam.component.ts ngOnInit')
  }

  ngAfterViewInit() {
    this.exam_id = this.route.snapshot.paramMap.get('id');
    console.log('exam.component.ts ngAfterViewInit')
    // is this a demo?
    if (this.exam_id == '-1') {
      this.demo_mode = true;
      this.processing = true;
      setTimeout(() => {
        this.processing = false;
        this.assessmentTemplate = new AssessmentDemo().data;
        // clone the assessment 
        this.currentAssessment = _.cloneDeep(this.assessmentTemplate);
        this.headingstring = this.currentAssessment.name;
       // this.hint('getstudentbut', 'Show list of candidates\n(tap anywhere ');
      },
        1000);

    } else {
      this.demo_mode = false;
      this.getAssessment();
    }
  }


  getAssessment() {
    this.processing = true;
    console.log("examilst.component.ts says: getAssessment() called");
    this.answer = [];
    this.networkService.getAssessment(this.exam_id)
      .subscribe(result => {
        this.processing = false;
        console.log('Getting assesment complete!')
        // cache the exam
        if (getConnectionType() == (connectionType.wifi || connectionType.mobile)) {

          console.log('Caching examination:');
          // clean up the existing cached exam
          //console.log('Getting currently cached examination:');
          let cachedexam = this.storageDatabase.query({
            select: [], // Leave empty to query for all
            //  from: 'otherDatabaseName', // Omit or set null to use current db
            where: [
              { property: 'type', comparison: 'equalTo', value: 'cached_exam' },
              { logical: 'and', property: 'exam_id', comparison: 'equalTo', value: this.exam_id },
            ]
          });
          //console.log('Deleting...');
          cachedexam.forEach(element => {
            //console.log(element)
            this.storageDatabase.deleteDocument(element.id);
          });
          //console.log('Recaching examination:');
          this.storageDatabase.createDocument({ 'type': 'cached_exam', 'exam_id': this.exam_id/*  */, 'data': JSON.stringify(result) });
        } else {
          // this.connectionStr = ' (Disconnected)'
        }
        //console.log('Exam data is:' + JSON.stringify(result));
        // // get the template
        this.assessmentTemplate = result;
        // clone the assessment 
        this.currentAssessment = _.cloneDeep(this.assessmentTemplate);
        this.headingstring = this.currentAssessment.name;
        // this.headingstring = this.headingstring0+this.connectionStr;
      }
      ),
      error => console.log(error),
      () => console.log('examdetail.component.ts.getAssessments() subscription complete result:complete');
  }

  // getting then showing the student list
  getStudentList() {
    this.processing = true;
    if (this.demo_mode) {
      this.studentlist = new StudentListDemo().data;
      setTimeout(() => {
        this.processing = false;
        this.showStudentSelectDialog();
      },
        1000);
    } else {
      //const id = this.route.snapshot.paramMap.get('id');
      this.studentlist = [];
      //this.loader.show({ message: 'Getting students', });
      console.log("examilst.component.ts says: getStudentList() called");
      this.networkService.getstudentsForAssessment(this.exam_id)
        .subscribe(result => {
          // cache the result (if connected)
          this.processing = false;
          if (getConnectionType() == (connectionType.wifi || connectionType.mobile)) {
            let cachedstudents = this.storageDatabase.query({
              select: [], // Leave empty to query for all
              //  from: 'otherDatabaseName', // Omit or set null to use current db
              where: [
                { property: 'type', comparison: 'equalTo', value: 'cached_students' },
                { logical: 'and', property: 'exam_id', comparison: 'equalTo', value: this.exam_id },
              ]
            });
            //console.log('Deleting...');
            cachedstudents.forEach(element => {
              //console.log(element)
              this.storageDatabase.deleteDocument(element.id);
            });
            this.storageDatabase.createDocument({ 'type': 'cached_students', 'exam_id': this.exam_id, 'data': result });
          }
          // this.assessment = result;
          console.log('get studentlist result is:' + JSON.stringify(result));
          // get student list  
          result.forEach(element => {
            //      console.log('Element:' + JSON.stringify(element));
            this.studentlist.push(element);
          });
          // this.displayedStudentList = new ObservableArray<Student>(this.studentlist);
          //  this.loader.hide();
          this.showStudentSelectDialog()
        }

        ),
        error => console.log(error),
        () => console.log('examdetail.component.ts.openUserSelect() subscription complete result:complete');

    }

  }

  // show the student select dialog
  public showStudentSelectDialog() {
    let options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      animated: true,
      context: { studentlist: this.studentlist }
    };
    var parent = this;
    this.modalService.showModal(StudentlistComponent, options)
      .then((dialogResult: Student) => this.setStudent(dialogResult)
      );
  }

  // set the selected student
  setStudent(student) {
    if (student) {
      this.selectedStudent = student;
      this.examEnabled = true;
      this.headingstring = this.currentAssessment.name + "\nExamining: " + this.selectedStudent.fname + " " + this.selectedStudent.lname;
    }
    if (this.demo_mode) {
      //   this.hint('headertext', 'Current candidate is shown here');
      //   this.hint('theform', 'Fill in the form');
    }
  }

  // 
  public showCommentEntry(event) {
    console.log('showcommententry')
    let itemid = event.id;
    let oldcomment = event.comment;
    let options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      animated: true,
      //fullscreen: true,
      context: { comment: oldcomment }
    };
    this.modalService.showModal(CommentEntryComponent, options)
      .then((dialogResult: string) => this.setComment(itemid, dialogResult));
  }

  setComment(id, newcomment) {
    // console.log('setting comment ' + id + ' to ' + newcomment)
    this.currentAssessment.exam_instance_items[this.currentAssessment.exam_instance_items.findIndex(x => x.id == id)].comment = newcomment;

  }

  hasntShownExamHint: boolean = true;
  // handle a value change
  onChangeEvent(event) {
   
    console.log(event.id);
    console.log('examdetail.component.ts says: onChangeEvent()');
    // record the answer in the answers array
    // find any affected element index, set visibility accordingly
    if(this.currentAssessment.exam_instance_items){
    this.currentAssessment.exam_instance_items.forEach(element => {
      if (element.show_if_id == event.id) {
        //console.log('Affected item:' + element.id)
        //console.log('Looking for value:' + element.show_if_answer_id)
        if (element.show_if_answer_id == event.selectedid) {
          this.currentAssessment.exam_instance_items[this.currentAssessment.exam_instance_items.findIndex(x => x.id == element.id)].visible = true;
        } else {
          this.currentAssessment.exam_instance_items[this.currentAssessment.exam_instance_items.findIndex(x => x.id == element.id)].visible = false;
        }
      }
    });
  }
    this.validateExam();
  }

  // checking exam
  validateExam() {
    console.log('examd.component.ts says: validateExam()');
    //  console.log('event.id is:' + event.id);

    // loop through and see if everything's valid
    var test = true;
    this.currentAssessment.exam_instance_items.forEach(element => {
      // console.log(element.valid ? 'Element is valid' : 'Element is n valid');
      if ((!element.heading) && (!element.valid)) {
        if (element.visible) {
          test = false;
        }
      }
    });
    this.examValid = test;
    if (this.demo_mode && this.examValid) {
      //   this.hint('submitbut', 'Tap to submit');
    }
    console.log(this.examValid ? 'Exam is valid' : 'Not valid');
  }


  // submit the assessment to the service
  submit() {
    //const id = this.route.snapshot.paramMap.get('id');
    this.processing = true;
    //  this.currentAssessment.comment = this.finalcomment;
    this.networkService.submitAssessment(this.selectedStudent.id, this.currentAssessment)
      .subscribe(result => {
        console.log('submit result is:' + JSON.stringify(result));

        this.processing = false;
        // reset here
        // disable exam
        this.examEnabled = false;
        // invalidate exam
        this.examValid = false;
        // reset exam container
        this.currentAssessment = _.cloneDeep(this.assessmentTemplate);
        // reset student
        // @TODO but first remove cached student if offline
        if (!(getConnectionType() == (connectionType.wifi || connectionType.mobile))) {
          // get the cacged students for this exam
          var cachedstudents = this.storageDatabase.query({
            select: [],
            where: [
              { property: 'type', comparison: 'equalTo', value: 'cached_student' },
              { logical: 'and', property: 'exam_id', comparison: 'equalTo', value: this.exam_id },
            ]
          });
          // loop through the students, delete if the id matches the current student
          cachedstudents.forEach(element => {
            if (element[0].id = this.selectedStudent.id) {
              this.storageDatabase.deleteDocument(element.id);
            }
          })

        }
        this.selectedStudent = null;
        this.headingstring = this.currentAssessment.name;
      }

      ),
      error => console.log(error),
      this.processing = false;
    // show some feedback

    const toast = new Toasty({
      text: (getConnectionType() == (connectionType.wifi || connectionType.mobile)) ? 'Exam submitted!' : 'Exam cached for later submission',
      position: ToastPosition.CENTER,
      backgroundColor: (getConnectionType() == (connectionType.wifi || connectionType.mobile)) ? '#5cb85c' : '#f0ad4e',
      android: { yAxisOffset: 100 },
      ios: {
        // anchorView: someButton.ios, // must be the native iOS view instance (button, page, action bar, tabbar, etc.)
        displayShadow: true,
        /*    shadowColor: '#fff000',
           cornerRadius: 24 */
      }
    });
    toast.show();
    () => console.log('examdetail.component.ts.submit() submission complete result:complete');
  }

  back() {
    if (this.selectedStudent) {
      let options: ModalDialogOptions = {
        viewContainerRef: this.viewContainerRef,
        fullscreen: false,
        animated: true,
        context: { titletext: 'Really?', messagetext: 'This will abandon the current assessment', confirmtext: "OK", canceltext: 'Cancel' }
      };
      var parent = this;
      this.modalService.showModal(ConfirmComponent, options)
        .then(result => {
          if (result) {
            // go to the examlist page
            this.routerExtensions.back();
          }

        });
    } else {
      this.routerExtensions.back();
    }
  }



  // experiment to show a chached exam data
  showcache() {
    const id = this.route.snapshot.paramMap.get('id')
    const cachedexam = this.storageDatabase.query({
      select: [], // Leave empty to query for all
      //  from: 'otherDatabaseName', // Omit or set null to use current db
      where: [
        { property: 'type', comparison: 'equalTo', value: 'cached_exam' },
        { logical: 'and', property: 'exam_id', comparison: 'equalTo', value: id },
      ]
    });
    console.log('Getting cached examination');
    console.log(cachedexam[0].data)
    // return this as an observable
    // return from([JSON.parse(cachedexam[0].data)]);
  }

  // hints for tutorial

  private popups: Popup[] = [];


  // show a hint
  hint(targetid: string, messagetext: string) {
    let stack: any = new StackLayout();

    //stack.height = '100%';
    stack.className = 'dialog';
    stack.horizontalAlignment = 'center';
    stack.verticalAlignment = 'center';
    //stack.isPassThroughParentEnabled = true;
    let lbl: any = new Label();
    lbl.text = messagetext;
    lbl.textAlignment = 'center'
    // lbl.textWrap = true;
    lbl.className = 'popuplabel';
    //lbl.backgroundColor = '#f6f6f6';
    //lbl.marginTop = 5;
    //lbl.height = 40;
    //stack.addChild(lbl);
    let dismissBtn = new Button();
    dismissBtn.className = 'btn-info';
    dismissBtn.text = 'Got it';
 stack.addChild(dismissBtn);
    //dismissBtn.bindingContext = this;
    dismissBtn.on(Button.tapEvent, args => {
      console.log('closing popup');
      this.hidePopup();
    }, this);
   
    this._showPopup(this.page.getViewById(targetid), stack);
  }

  // show a popup
  _showPopup(source, view) {
    let popup = new Popup({
      backgroundColor: '#f6f6f6',
      width: 300,
      height: 100,
      unit: 'px',
      //elevation: 10,
      borderRadius: 5,

    });
    this.popups.push(popup);

    popup.showPopup(source, view).then(data => {
      console.log(data);
    });
  }

  hidePopup(index?) {
    this.popups.forEach(element => {
      element.hidePopup();
    });
  }


}
