import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";
import { EventData, Page } from 'tns-core-modules/ui/page/page';
import { TextView } from 'nativescript-angular/forms/value-accessors';

@Component({
  selector: 'ns-comment-entry',
  templateUrl: './comment-entry.component.html',
  styleUrls: ['./comment-entry.component.css'],
  moduleId: module.id,
})



export class CommentEntryComponent implements OnInit {

  @ViewChild('#comment_entry', {static: true}) comment_entry: ElementRef;

  private comment: string = "";


  constructor(private params: ModalDialogParams, private page:Page) {
    console.log('Incoming Comment is:' + this.comment);
  }

  public close(result: string) {
    console.log('outgoing Comment is:' + result);
    this.params.closeCallback(result);
  }

  public onload(args:EventData){
   // var commententry = <TextView>args.view.getViewById("comment_entry");

    console.log('comment onload called');

  }

  public onTextfieldLoad(args){
    console.log('comment onTextfieldLoad called');

    let tf:TextView = args.object;
    tf.focus()
    if(isAndroid){
        setTimeout(() => {
          // not targeting 'droid at this point
           // utils.ad.showSoftInput(tf.android);   
        }, 1);
    }
  }

  public onIsLoaded(args:EventData){
    console.log('comment onIsLoaded called');

  }

public doneTap(args){
  console.log(JSON.stringify(args));
}

  ngOnInit() {
    console.log('ngOnInit');
    this.comment = this.params.context.comment;
    if (isAndroid) {
      let inputInstance = this.comment_entry;
     // inputInstance.nativeElement.android.setSelection(this.comment, this.comment.length);
    } else if (isIOS) {
      setTimeout(() => {
     //   let focusTextField = this.page.getViewById("comment_entry").nativeElement;
      //  this.comment_entry.focus();
      },
        500);
   
    }

  }

  ngViewAfterInit(){
    console.log('ngViewAfterInit');

  }

}
