"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var observable_array_1 = require("tns-core-modules/data/observable-array/observable-array");
var network_service_service_1 = require("~/app/services/network-service.service");
var router_1 = require("@angular/router");
var user_service_1 = require("~/app/services/user.service");
var _ = require("lodash");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var studentlist_component_1 = require("./modals/studentlist/studentlist.component");
var nativescript_windowed_modal_1 = require("nativescript-windowed-modal");
var element_registry_1 = require("nativescript-angular/element-registry");
var comment_entry_component_1 = require("./modals/comment-entry/comment-entry.component");
nativescript_windowed_modal_1.overrideModalViewMethod();
element_registry_1.registerElement("ModalStack", function () { return nativescript_windowed_modal_1.ModalStack; });
var ExamComponent = /** @class */ (function () {
    function ExamComponent(route, userservice, networkService, modalService, viewContainerRef) {
        this.route = route;
        this.userservice = userservice;
        this.networkService = networkService;
        this.modalService = modalService;
        this.viewContainerRef = viewContainerRef;
        this.processing = true;
        this.haserror = false;
        this.answer = [];
        this.studentlist = [];
        this.displayedStudentList = new observable_array_1.ObservableArray(this.studentlist);
        this.finalcomment = '';
        this.examEnabled = false;
        this.examValid = false;
    }
    ExamComponent.prototype.ngOnInit = function () {
    };
    ExamComponent.prototype.ngAfterViewInit = function () {
        this.getAssessment();
    };
    ExamComponent.prototype.getAssessment = function () {
        var _this = this;
        this.processing = true;
        console.log("examilst.component.ts says: getAssessment() called");
        this.answer = [];
        var id = this.route.snapshot.paramMap.get('id');
        this.networkService.getAssessment(id)
            .subscribe(function (result) {
            _this.processing = false;
            console.log('Getting assesment complete!');
            // // get the template
            _this.assessmentTemplate = result;
            // clone the assessment 
            _this.currentAssessment = _.cloneDeep(_this.assessmentTemplate);
        }),
            function (error) { return console.log(error); },
            function () { return console.log('examdetail.component.ts.getAssessments() subscription complete result:complete'); };
    };
    // getting then showing the student list
    ExamComponent.prototype.getStudentList = function () {
        var _this = this;
        this.processing = true;
        var id = this.route.snapshot.paramMap.get('id');
        this.studentlist = [];
        //this.loader.show({ message: 'Getting students', });
        console.log("examilst.component.ts says: getStudentList() called");
        this.networkService.getstudentsForAssessment(id)
            .subscribe(function (result) {
            _this.processing = false;
            // this.assessment = result;
            console.log('get studentlist result is:' + JSON.stringify(result));
            // get student list  
            result.forEach(function (element) {
                console.log('Element:' + JSON.stringify(element));
                _this.studentlist.push(element);
            });
            // this.displayedStudentList = new ObservableArray<Student>(this.studentlist);
            //  this.loader.hide();
            _this.showStudentSelectDialog();
        }),
            function (error) { return console.log(error); },
            function () { return console.log('examdetail.component.ts.openUserSelect() subscription complete result:complete'); };
    };
    // show the student select dialog
    ExamComponent.prototype.showStudentSelectDialog = function () {
        var _this = this;
        var options = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false,
            animated: true,
            context: { studentlist: this.studentlist }
        };
        var parent = this;
        this.modalService.showModal(studentlist_component_1.StudentlistComponent, options)
            .then(function (dialogResult) { return _this.setStudent(dialogResult); });
    };
    // set the selected student
    ExamComponent.prototype.setStudent = function (student) {
        if (student) {
            this.selectedStudent = student;
            this.examEnabled = true;
        }
    };
    // 
    ExamComponent.prototype.showCommentEntry = function (event) {
        var _this = this;
        console.log('showcommententry');
        var itemid = event.id;
        var oldcomment = event.comment;
        var options = {
            viewContainerRef: this.viewContainerRef,
            animated: true,
            //fullscreen: true,
            context: { comment: oldcomment }
        };
        this.modalService.showModal(comment_entry_component_1.CommentEntryComponent, options)
            .then(function (dialogResult) { return _this.setComment(itemid, dialogResult); });
    };
    ExamComponent.prototype.setComment = function (id, newcomment) {
        console.log('setting comment ' + id + ' to ' + newcomment);
        this.currentAssessment.exam_instance_items[this.currentAssessment.exam_instance_items.findIndex(function (x) { return x.id == id; })].comment = newcomment;
    };
    // handle a value change
    ExamComponent.prototype.onChangeEvent = function (event) {
        var _this = this;
        console.log('examdetail.component.ts says: onChangeEvent()');
        // record the answer in the answers array
        // find any affected element index, set visibility accordingly
        this.currentAssessment.exam_instance_items.forEach(function (element) {
            if (element.show_if_id == event.id) {
                //console.log('Affected item:' + element.id)
                //console.log('Looking for value:' + element.show_if_answer_id)
                if (element.show_if_answer_id == event.selectedid) {
                    _this.currentAssessment.exam_instance_items[_this.currentAssessment.exam_instance_items.findIndex(function (x) { return x.id == element.id; })].visible = true;
                }
                else {
                    _this.currentAssessment.exam_instance_items[_this.currentAssessment.exam_instance_items.findIndex(function (x) { return x.id == element.id; })].visible = false;
                }
            }
        });
        this.validateExam();
    };
    // checking exam
    ExamComponent.prototype.validateExam = function () {
        console.log('examd.component.ts says: validateExam()');
        //  console.log('event.id is:' + event.id);
        // loop through and see if everything's valid
        var test = true;
        this.currentAssessment.exam_instance_items.forEach(function (element) {
            // console.log(element.valid ? 'Element is valid' : 'Element is n valid');
            if ((!element.heading) && (!element.valid)) {
                if (element.visible) {
                    test = false;
                }
            }
        });
        this.examValid = test;
        console.log(this.examValid ? 'Exam is valid' : 'Not valid');
    };
    // submit the assessment to the service
    ExamComponent.prototype.submit = function () {
        var _this = this;
        this.processing = true;
        //  this.currentAssessment.comment = this.finalcomment;
        this.networkService.submitAssessment(this.selectedStudent.id, this.currentAssessment)
            .subscribe(function (result) {
            console.log('submit result is:' + JSON.stringify(result));
            _this.processing = false;
            // reset here
            // disable exam
            _this.examEnabled = false;
            // invalidate exam
            _this.examValid = false;
            // reset exam container
            _this.currentAssessment = _.cloneDeep(_this.assessmentTemplate);
            // reset student
            _this.selectedStudent = null;
        }),
            function (error) { return console.log(error); },
            this.processing = false;
        (function () { return console.log('examdetail.component.ts.submit() submission complete result:complete'); });
    };
    __decorate([
        core_1.ViewChild("mainview", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ExamComponent.prototype, "viewContainer", void 0);
    ExamComponent = __decorate([
        core_1.Component({
            selector: 'ns-exam',
            templateUrl: './exam.component.html',
            styleUrls: ['./exam.component.css'],
            moduleId: module.id,
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            user_service_1.UserService,
            network_service_service_1.NetworkServiceService,
            modal_dialog_1.ModalDialogService,
            core_1.ViewContainerRef])
    ], ExamComponent);
    return ExamComponent;
}());
exports.ExamComponent = ExamComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleGFtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyRjtBQUczRiw0RkFBMEY7QUFHMUYsa0ZBQStFO0FBQy9FLDBDQUFpRDtBQUNqRCw0REFBMEQ7QUFDMUQsMEJBQTRCO0FBQzVCLGtFQUEyRjtBQUMzRixvRkFBa0Y7QUFDbEYsMkVBQWtGO0FBQ2xGLDBFQUF3RTtBQUN4RSwwRkFBdUY7QUFFdkYscURBQXVCLEVBQUUsQ0FBQTtBQUN6QixrQ0FBZSxDQUFDLFlBQVksRUFBRSxjQUFNLE9BQUEsd0NBQVUsRUFBVixDQUFVLENBQUMsQ0FBQztBQVNoRDtJQW9CRSx1QkFBb0IsS0FBcUIsRUFDaEMsV0FBd0IsRUFDdkIsY0FBcUMsRUFDckMsWUFBZ0MsRUFDaEMsZ0JBQWtDO1FBSnhCLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ2hDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3ZCLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQUNyQyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7UUFDaEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQXRCNUMsZUFBVSxHQUFHLElBQUksQ0FBQztRQUNsQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBSVYsV0FBTSxHQUFhLEVBQUUsQ0FBQztRQUN0QixnQkFBVyxHQUFjLEVBQUUsQ0FBQztRQUM1Qix5QkFBb0IsR0FBRyxJQUFJLGtDQUFlLENBQVUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdFLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBRWxCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRTdCLGNBQVMsR0FBWSxLQUFLLENBQUM7SUFZM0IsQ0FBQztJQUVELGdDQUFRLEdBQVI7SUFFQSxDQUFDO0lBRUQsdUNBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQs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QUcsS0FBSyxDQUFDO1lBQ3pCLGtCQUFrQjtZQUNsQixLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2Qix1QkFBdUI7WUFDdkIsS0FBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDOUQsZ0JBQWdCO1lBQ2hCLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzlCLENBQUMsQ0FFQTtZQUNELFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBbEIsQ0FBa0I7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQSxjQUFNLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzRUFBc0UsQ0FBQyxFQUFuRixDQUFtRixDQUFBLENBQUM7SUFDOUYsQ0FBQztJQTVLeUM7UUFBekMsZ0JBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7a0NBQWdCLGlCQUFVO3dEQUFDO0lBbEJ6RCxhQUFhO1FBTnpCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsU0FBUztZQUNuQixXQUFXLEVBQUUsdUJBQXVCO1lBQ3BDLFNBQVMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO1lBQ25DLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtTQUNwQixDQUFDO3lDQXFCMkIsdUJBQWM7WUFDbkIsMEJBQVc7WUFDUCwrQ0FBcUI7WUFDdkIsaUNBQWtCO1lBQ2QsdUJBQWdCO09BeEJqQyxhQUFhLENBaU16QjtJQUFELG9CQUFDO0NBQUEsQUFqTUQsSUFpTUM7QUFqTVksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTdHVkZW50IH0gZnJvbSAnfi9hcHAvbW9kZWxzL3N0dWRlbnQubW9kZWwnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUFycmF5IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUtYXJyYXkvb2JzZXJ2YWJsZS1hcnJheSc7XG5pbXBvcnQgeyBBc3Nlc3NtZW50IH0gZnJvbSAnfi9hcHAvbW9kZWxzL2Fzc2Vzc21lbnQubW9kZWwnO1xuaW1wb3J0IHsgQW5zd2VyIH0gZnJvbSAnfi9hcHAvbW9kZWxzL2Fuc3dlci5tb2RlbCc7XG5pbXBvcnQgeyBOZXR3b3JrU2VydmljZVNlcnZpY2UgfSBmcm9tICd+L2FwcC9zZXJ2aWNlcy9uZXR3b3JrLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJ34vYXBwL3NlcnZpY2VzL3VzZXIuc2VydmljZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IE1vZGFsRGlhbG9nT3B0aW9ucywgTW9kYWxEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nJztcbmltcG9ydCB7IFN0dWRlbnRsaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9tb2RhbHMvc3R1ZGVudGxpc3Qvc3R1ZGVudGxpc3QuY29tcG9uZW50JztcbmltcG9ydCB7IE1vZGFsU3RhY2ssIG92ZXJyaWRlTW9kYWxWaWV3TWV0aG9kIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC13aW5kb3dlZC1tb2RhbFwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnlcIjtcbmltcG9ydCB7IENvbW1lbnRFbnRyeUNvbXBvbmVudCB9IGZyb20gJy4vbW9kYWxzL2NvbW1lbnQtZW50cnkvY29tbWVudC1lbnRyeS5jb21wb25lbnQnO1xuXG5vdmVycmlkZU1vZGFsVmlld01ldGhvZCgpXG5yZWdpc3RlckVsZW1lbnQoXCJNb2RhbFN0YWNrXCIsICgpID0+IE1vZGFsU3RhY2spO1xuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25zLWV4YW0nLFxuICB0ZW1wbGF0ZVVybDogJy4vZXhhbS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2V4YW0uY29tcG9uZW50LmNzcyddLFxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxufSlcbmV4cG9ydCBjbGFzcyBFeGFtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwcm9jZXNzaW5nID0gdHJ1ZTtcbiAgaGFzZXJyb3IgPSBmYWxzZTtcblxuICBwdWJsaWMgYXNzZXNzbWVudFRlbXBsYXRlOiBBc3Nlc3NtZW50O1xuICBjdXJyZW50QXNzZXNzbWVudDogQXNzZXNzbWVudDtcbiAgcHVibGljIGFuc3dlcjogQW5zd2VyW10gPSBbXTtcbiAgcHVibGljIHN0dWRlbnRsaXN0OiBTdHVkZW50W10gPSBbXTtcbiAgcHVibGljIGRpc3BsYXllZFN0dWRlbnRMaXN0ID0gbmV3IE9ic2VydmFibGVBcnJheTxTdHVkZW50Pih0aGlzLnN0dWRlbnRsaXN0KTtcbiAgZmluYWxjb21tZW50ID0gJyc7XG5cbiAgZXhhbUVuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBleGFtVmFsaWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBzZWxlY3RlZFN0dWRlbnQ6IFN0dWRlbnQ7XG5cbiAgQFZpZXdDaGlsZChcIm1haW52aWV3XCIsIHsgc3RhdGljOiBmYWxzZSB9KSB2aWV3Q29udGFpbmVyOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHB1YmxpYyB1c2Vyc2VydmljZTogVXNlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBuZXR3b3JrU2VydmljZTogTmV0d29ya1NlcnZpY2VTZXJ2aWNlLFxuICAgIHByaXZhdGUgbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XG5cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5nZXRBc3Nlc3NtZW50KCk7XG4gIH1cblxuICBnZXRBc3Nlc3NtZW50KCkge1xuICAgIHRoaXMucHJvY2Vzc2luZyA9IHRydWU7XG4gICAgY29uc29sZS5sb2coXCJleGFtaWxzdC5jb21wb25lbnQudHMgc2F5czogZ2V0QXNzZXNzbWVudCgpIGNhbGxlZFwiKTtcbiAgICB0aGlzLmFuc3dlciA9IFtdO1xuICAgIGNvbnN0IGlkID0gdGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbU1hcC5nZXQoJ2lkJyk7XG5cbiAgICB0aGlzLm5ldHdvcmtTZXJ2aWNlLmdldEFzc2Vzc21lbnQoaWQpXG4gICAgICAuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZygnR2V0dGluZyBhc3Nlc21lbnQgY29tcGxldGUhJylcbiAgICAgICAgLy8gLy8gZ2V0IHRoZSB0ZW1wbGF0ZVxuICAgICAgICB0aGlzLmFzc2Vzc21lbnRUZW1wbGF0ZSA9IHJlc3VsdDtcbiAgICAgICAgLy8gY2xvbmUgdGhlIGFzc2Vzc21lbnQgXG4gICAgICAgIHRoaXMuY3VycmVudEFzc2Vzc21lbnQgPSBfLmNsb25lRGVlcCh0aGlzLmFzc2Vzc21lbnRUZW1wbGF0ZSk7XG4gICAgICB9XG4gICAgICApLFxuICAgICAgZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpLFxuICAgICAgKCkgPT4gY29uc29sZS5sb2coJ2V4YW1kZXRhaWwuY29tcG9uZW50LnRzLmdldEFzc2Vzc21lbnRzKCkgc3Vic2NyaXB0aW9uIGNvbXBsZXRlIHJlc3VsdDpjb21wbGV0ZScpO1xuICB9XG5cbiAgLy8gZ2V0dGluZyB0aGVuIHNob3dpbmcgdGhlIHN0dWRlbnQgbGlzdFxuICBnZXRTdHVkZW50TGlzdCgpIHtcbiAgICB0aGlzLnByb2Nlc3NpbmcgPSB0cnVlO1xuICAgIGNvbnN0IGlkID0gdGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbU1hcC5nZXQoJ2lkJyk7XG4gICAgdGhpcy5zdHVkZW50bGlzdCA9IFtdO1xuICAgIC8vdGhpcy5sb2FkZXIuc2hvdyh7IG1lc3NhZ2U6ICdHZXR0aW5nIHN0dWRlbnRzJywgfSk7XG4gICAgY29uc29sZS5sb2coXCJleGFtaWxzdC5jb21wb25lbnQudHMgc2F5czogZ2V0U3R1ZGVudExpc3QoKSBjYWxsZWRcIik7XG4gICAgdGhpcy5uZXR3b3JrU2VydmljZS5nZXRzdHVkZW50c0ZvckFzc2Vzc21lbnQoaWQpXG4gICAgICAuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgICAvLyB0aGlzLmFzc2Vzc21lbnQgPSByZXN1bHQ7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXQgc3R1ZGVudGxpc3QgcmVzdWx0IGlzOicgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICAgICAgLy8gZ2V0IHN0dWRlbnQgbGlzdCAgXG4gICAgICAgIHJlc3VsdC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdFbGVtZW50OicgKyBKU09OLnN0cmluZ2lmeShlbGVtZW50KSk7XG4gICAgICAgICAgdGhpcy5zdHVkZW50bGlzdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gdGhpcy5kaXNwbGF5ZWRTdHVkZW50TGlzdCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8U3R1ZGVudD4odGhpcy5zdHVkZW50bGlzdCk7XG4gICAgICAgIC8vICB0aGlzLmxvYWRlci5oaWRlKCk7XG4gICAgICAgIHRoaXMuc2hvd1N0dWRlbnRTZWxlY3REaWFsb2coKVxuICAgICAgfVxuXG4gICAgICApLFxuICAgICAgZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpLFxuICAgICAgKCkgPT4gY29uc29sZS5sb2coJ2V4YW1kZXRhaWwuY29tcG9uZW50LnRzLm9wZW5Vc2VyU2VsZWN0KCkgc3Vic2NyaXB0aW9uIGNvbXBsZXRlIHJlc3VsdDpjb21wbGV0ZScpO1xuXG4gIH1cblxuICAvLyBzaG93IHRoZSBzdHVkZW50IHNlbGVjdCBkaWFsb2dcbiAgcHVibGljIHNob3dTdHVkZW50U2VsZWN0RGlhbG9nKCkge1xuICAgIGxldCBvcHRpb25zOiBNb2RhbERpYWxvZ09wdGlvbnMgPSB7XG4gICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLnZpZXdDb250YWluZXJSZWYsXG4gICAgICBmdWxsc2NyZWVuOiBmYWxzZSxcbiAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgY29udGV4dDogeyBzdHVkZW50bGlzdDogdGhpcy5zdHVkZW50bGlzdCB9XG4gICAgfTtcbiAgICB2YXIgcGFyZW50ID0gdGhpcztcbiAgICB0aGlzLm1vZGFsU2VydmljZS5zaG93TW9kYWwoU3R1ZGVudGxpc3RDb21wb25lbnQsIG9wdGlvbnMpXG4gICAgICAudGhlbigoZGlhbG9nUmVzdWx0OiBTdHVkZW50KSA9PiB0aGlzLnNldFN0dWRlbnQoZGlhbG9nUmVzdWx0KVxuICAgICAgKTtcbiAgfVxuXG4gIC8vIHNldCB0aGUgc2VsZWN0ZWQgc3R1ZGVudFxuICBzZXRTdHVkZW50KHN0dWRlbnQpIHtcbiAgICBpZiAoc3R1ZGVudCkge1xuICAgICAgdGhpcy5zZWxlY3RlZFN0dWRlbnQgPSBzdHVkZW50O1xuICAgICAgdGhpcy5leGFtRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gXG4gIHB1YmxpYyBzaG93Q29tbWVudEVudHJ5KGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coJ3Nob3djb21tZW50ZW50cnknKVxuICAgIGxldCBpdGVtaWQgPSBldmVudC5pZDtcbiAgICBsZXQgb2xkY29tbWVudCA9IGV2ZW50LmNvbW1lbnQ7XG4gICAgbGV0IG9wdGlvbnM6IE1vZGFsRGlhbG9nT3B0aW9ucyA9IHtcbiAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMudmlld0NvbnRhaW5lclJlZixcbiAgICAgIGFuaW1hdGVkOiB0cnVlLFxuICAgICAgLy9mdWxsc2NyZWVuOiB0cnVlLFxuICAgICAgY29udGV4dDogeyBjb21tZW50OiBvbGRjb21tZW50IH1cbiAgICB9O1xuICAgIHRoaXMubW9kYWxTZXJ2aWNlLnNob3dNb2RhbChDb21tZW50RW50cnlDb21wb25lbnQsIG9wdGlvbnMpXG4gICAgICAudGhlbigoZGlhbG9nUmVzdWx0OiBzdHJpbmcpID0+IHRoaXMuc2V0Q29tbWVudChpdGVtaWQsIGRpYWxvZ1Jlc3VsdCkpO1xuICB9XG5cbiAgc2V0Q29tbWVudChpZCwgbmV3Y29tbWVudCkge1xuICAgIGNvbnNvbGUubG9nKCdzZXR0aW5nIGNvbW1lbnQgJyArIGlkICsgJyB0byAnICsgbmV3Y29tbWVudClcbiAgICB0aGlzLmN1cnJlbnRBc3Nlc3NtZW50LmV4YW1faW5zdGFuY2VfaXRlbXNbdGhpcy5jdXJyZW50QXNzZXNzbWVudC5leGFtX2luc3RhbmNlX2l0ZW1zLmZpbmRJbmRleCh4ID0+IHguaWQgPT0gaWQpXS5jb21tZW50ID0gbmV3Y29tbWVudDtcblxuICB9XG5cbiAgLy8gaGFuZGxlIGEgdmFsdWUgY2hhbmdlXG4gIG9uQ2hhbmdlRXZlbnQoZXZlbnQpIHtcbiAgICBjb25zb2xlLmxvZygnZXhhbWRldGFpbC5jb21wb25lbnQudHMgc2F5czogb25DaGFuZ2VFdmVudCgpJyk7XG4gICAgIC8vIHJlY29yZCB0aGUgYW5zd2VyIGluIHRoZSBhbnN3ZXJzIGFycmF5XG4gICAgLy8gZmluZCBhbnkgYWZmZWN0ZWQgZWxlbWVudCBpbmRleCwgc2V0IHZpc2liaWxpdHkgYWNjb3JkaW5nbHlcbiAgICB0aGlzLmN1cnJlbnRBc3Nlc3NtZW50LmV4YW1faW5zdGFuY2VfaXRlbXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGlmIChlbGVtZW50LnNob3dfaWZfaWQgPT0gZXZlbnQuaWQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnQWZmZWN0ZWQgaXRlbTonICsgZWxlbWVudC5pZClcbiAgICAgICAgLy9jb25zb2xlLmxvZygnTG9va2luZyBmb3IgdmFsdWU6JyArIGVsZW1lbnQuc2hvd19pZl9hbnN3ZXJfaWQpXG4gICAgICAgIGlmIChlbGVtZW50LnNob3dfaWZfYW5zd2VyX2lkID09IGV2ZW50LnNlbGVjdGVkaWQpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRBc3Nlc3NtZW50LmV4YW1faW5zdGFuY2VfaXRlbXNbdGhpcy5jdXJyZW50QXNzZXNzbWVudC5leGFtX2luc3RhbmNlX2l0ZW1zLmZpbmRJbmRleCh4ID0+IHguaWQgPT0gZWxlbWVudC5pZCldLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3VycmVudEFzc2Vzc21lbnQuZXhhbV9pbnN0YW5jZV9pdGVtc1t0aGlzLmN1cnJlbnRBc3Nlc3NtZW50LmV4YW1faW5zdGFuY2VfaXRlbXMuZmluZEluZGV4KHggPT4geC5pZCA9PSBlbGVtZW50LmlkKV0udmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy52YWxpZGF0ZUV4YW0oKTtcbiAgfVxuXG4gIC8vIGNoZWNraW5nIGV4YW1cbiAgdmFsaWRhdGVFeGFtKCkge1xuICAgIGNvbnNvbGUubG9nKCdleGFtZC5jb21wb25lbnQudHMgc2F5czogdmFsaWRhdGVFeGFtKCknKTtcbiAgICAvLyAgY29uc29sZS5sb2coJ2V2ZW50LmlkIGlzOicgKyBldmVudC5pZCk7XG4gICBcbiAgICAvLyBsb29wIHRocm91Z2ggYW5kIHNlZSBpZiBldmVyeXRoaW5nJ3MgdmFsaWRcbiAgICB2YXIgdGVzdCA9IHRydWU7XG4gICAgdGhpcy5jdXJyZW50QXNzZXNzbWVudC5leGFtX2luc3RhbmNlX2l0ZW1zLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50LnZhbGlkID8gJ0VsZW1lbnQgaXMgdmFsaWQnIDogJ0VsZW1lbnQgaXMgbiB2YWxpZCcpO1xuICAgICAgaWYgKCghZWxlbWVudC5oZWFkaW5nKSAmJiAoIWVsZW1lbnQudmFsaWQpKSB7XG4gICAgICAgIGlmKGVsZW1lbnQudmlzaWJsZSl7XG4gICAgICAgIHRlc3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuZXhhbVZhbGlkID0gdGVzdDtcbiAgICAgY29uc29sZS5sb2codGhpcy5leGFtVmFsaWQgPyAnRXhhbSBpcyB2YWxpZCcgOiAnTm90IHZhbGlkJyk7XG4gIH1cblxuXG4gIC8vIHN1Ym1pdCB0aGUgYXNzZXNzbWVudCB0byB0aGUgc2VydmljZVxuICBzdWJtaXQoKSB7XG4gICAgdGhpcy5wcm9jZXNzaW5nID0gdHJ1ZTtcbiAgLy8gIHRoaXMuY3VycmVudEFzc2Vzc21lbnQuY29tbWVudCA9IHRoaXMuZmluYWxjb21tZW50O1xuICAgIHRoaXMubmV0d29ya1NlcnZpY2Uuc3VibWl0QXNzZXNzbWVudCh0aGlzLnNlbGVjdGVkU3R1ZGVudC5pZCwgdGhpcy5jdXJyZW50QXNzZXNzbWVudClcbiAgICAgIC5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N1Ym1pdCByZXN1bHQgaXM6JyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgICAvLyByZXNldCBoZXJlXG4gICAgICAgIC8vIGRpc2FibGUgZXhhbVxuICAgICAgICB0aGlzLmV4YW1FbmFibGVkID0gZmFsc2U7XG4gICAgICAgIC8vIGludmFsaWRhdGUgZXhhbVxuICAgICAgICB0aGlzLmV4YW1WYWxpZCA9IGZhbHNlO1xuICAgICAgICAvLyByZXNldCBleGFtIGNvbnRhaW5lclxuICAgICAgICB0aGlzLmN1cnJlbnRBc3Nlc3NtZW50ID0gXy5jbG9uZURlZXAodGhpcy5hc3Nlc3NtZW50VGVtcGxhdGUpO1xuICAgICAgICAvLyByZXNldCBzdHVkZW50XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTdHVkZW50ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgKSxcbiAgICAgIGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSxcbiAgICAgIHRoaXMucHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgKCkgPT4gY29uc29sZS5sb2coJ2V4YW1kZXRhaWwuY29tcG9uZW50LnRzLnN1Ym1pdCgpIHN1Ym1pc3Npb24gY29tcGxldGUgcmVzdWx0OmNvbXBsZXRlJyk7XG4gIH1cblxuXG59XG4iXX0=