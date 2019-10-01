import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssessmentItem } from '~/app/models/assessmentitem.model';
import { FormGroup } from '@angular/forms';
import { RadioOption } from './radio-option';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ns-examitem',
  templateUrl: './examitem.component.html',
  styleUrls: ['./examitem.component.css'],
  moduleId: module.id,
  animations: [
    
    trigger('animationOption2', [      
      transition(':enter', [
        style({ backgroundColor: 'yellow' }),
        animate(300)
      ]),
      transition(':leave', [
        animate(300, style({ backgroundColor: 'yellow' }))
      ]),
      state('*', style({ backgroundColor: 'green' })),
    ])
  ]
})
export class ExamitemComponent implements OnInit {
  formGroup: FormGroup;
  checkTest: boolean;

  show: boolean = true;

  assessmentitem: AssessmentItem = new AssessmentItem();


  // is this a heading?
  isheading: Boolean = false;

  // formative?
  formative: Boolean = false;

  //hide comments?
  hidecomments: Boolean = false;

  // Internal values 
  selectedvalue: string = '';
  selectedid: number;
  comment: string = '';

  // does this 
  needscomment: boolean = false;


  @Input()
  get item() {
    return this.assessmentitem;
  }

  @Input() enabled: boolean = false;

  @Output() itemChange = new EventEmitter();
  set item(value) {
    this.assessmentitem = value;
  }

  // tell the world something's changed, trigger validation
  @Output() changeEvent = new EventEmitter();

  @Output() commentEvent = new EventEmitter();

  radioOptions?: Array<RadioOption> = [];
  constructor() { }

  ngOnInit() {
  //  console.log('ExamitemComponent.ngOnInit called');
    this.hidecomments = (this.assessmentitem.no_comment == '1');
    this.assessmentitem.items.forEach(item => {
      this.radioOptions.push(new RadioOption(item.id, item.label, item.value, item.needscomment == 'true'));
    });
   // console.log('show?' + this.assessmentitem.show_if_id);
    if ((this.assessmentitem.show_if_id === null) || (this.assessmentitem.show_if_id < 0)) {
      this.assessmentitem.visible = true;
    } else {
      this.assessmentitem.visible = false;
    }
    this.assessmentitem.valid = false;
  }

  // handle a radio button change
  changeCheckedRadio(radioOption: RadioOption): void {
    // uncheck all other options
  //  console.log('Radio change: ')
    this.radioOptions.forEach(option => {
      if (option.value !== radioOption.value) {
        option.selected = false;
      } else {
        option.selected = true;
        // internal value
        this.selectedvalue = option.value;
        // external (bindable) value
        this.assessmentitem.selectedvalue = option.value;
        //console.log('selectedvalue is now: ' + this.selectedvalue)
        //this.selectedid = option.id;
        this.assessmentitem.selected_id = option.id;
        //    console.log('selectedid is now: ' + this.assessmentitem.selected_id);
        //   console.log('needs comment: ' + option.needscomment);
        if (option.needscomment) {
          //     console.log('Needs a comment');
          this.needscomment = true;
        } else {
          this.needscomment = false;
        }
      }
    });
    this.assessmentitem.valid = this.validate();
    this.changeEvent.emit({ id: this.assessmentitem.id, selectedvalue: this.assessmentitem.selectedvalue, selectedid: this.assessmentitem.selected_id, comment: this.assessmentitem.comment });

  }

  // notify that a comment box has been clicked
  notifyCommentClick() {
    // console.log('Comment tapped: id:' + this.assessmentitem.id);
    this.commentEvent.emit({ id: this.assessmentitem.id, comment: this.assessmentitem.comment });
  }

  // handle the change of comment
  ontextChange() {
    // little delay. It crashes if this isn't here
    setTimeout(() => 
{
  this.assessmentitem.valid = this.validate();
  this.changeEvent.emit({ id: this.assessmentitem.id, selectedvalue: this.assessmentitem.selectedvalue, selectedid: this.assessmentitem.selected_id, comment: this.assessmentitem.comment });
},
1000);
  //  console.log('ExamitemComponent.Text changed to:' + this.comment)
    //
   
  }

  // need to fix this- it's clunky as hell.
  validate() {
  //  console.log('validate called');
    //console.log('assessmentitem.selectedid = ' + this.assessmentitem.selected_id);
    //console.log('needscomment = ' + this.needscomment);
    //console.log('assessmentitem.assessmentitem.comment = ' + this.assessmentitem.comment);
    if (this.assessmentitem.selected_id) {
      if (this.needscomment) {
        if (this.assessmentitem.comment && this.assessmentitem.comment.length > 0) {
      //    console.log('validate returning TRUE');
          return true;
        } else {
       //   console.log('validate returning FALSE');
          return false;
        }
      }else{
        return true;
      }
    } else {
    //  console.log('validate returning FALSE');
      return false;
    }
  }


}
