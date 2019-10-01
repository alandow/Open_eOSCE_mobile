"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var observable_array_1 = require("tns-core-modules/data/observable-array/observable-array");
var StudentlistComponent = /** @class */ (function () {
    function StudentlistComponent(params) {
        this.params = params;
        this.studentlist = [];
        this.displayedStudentList = new observable_array_1.ObservableArray(this.studentlist);
        this.studentlist = params.context.studentlist;
        this.displayedStudentList = new observable_array_1.ObservableArray(this.studentlist);
    }
    StudentlistComponent.prototype.ngOnInit = function () {
    };
    StudentlistComponent.prototype.close = function (result) {
        this.params.closeCallback(result);
    };
    // pick and load a student from the list, reset the assessment
    StudentlistComponent.prototype.selectStudent = function (student) {
        console.log('examdetail.component.ts.selectStudent:' + JSON.stringify(student));
        //this.selectedStudent = student;
        // reset the assessment a new answer
        //this.currentAssessment = _.cloneDeep(this.assessmentTemplate);
        this.close(student);
    };
    // filter student list based on the text input
    StudentlistComponent.prototype.onStudentSearchTextChanged = function (event) {
        var searchBar = event.object;
        var searchValue = searchBar.text.toLowerCase();
        console.log("SearchBar text changed! New value: " + searchBar.text);
        this.displayedStudentList = new observable_array_1.ObservableArray();
        if (searchValue !== "") {
            for (var i = 0; i < this.studentlist.length; i++) {
                if (((this.studentlist[i].fname.toLowerCase() + ' ' + this.studentlist[i].lname.toLowerCase()).indexOf(searchValue) !== -1) || (this.studentlist[i].studentid.toLowerCase().indexOf(searchValue) !== -1)) {
                    this.displayedStudentList.push(this.studentlist[i]);
                }
            }
        }
        else {
            this.displayedStudentList = new observable_array_1.ObservableArray(this.studentlist);
        }
    };
    StudentlistComponent = __decorate([
        core_1.Component({
            selector: 'ns-studentlist',
            templateUrl: './studentlist.component.html',
            styleUrls: ['./studentlist.component.css'],
            moduleId: module.id,
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams])
    ], StudentlistComponent);
    return StudentlistComponent;
}());
exports.StudentlistComponent = StudentlistComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudGxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3R1ZGVudGxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW9FO0FBSXBFLGtFQUE4RztBQUU5Ryw0RkFBMEY7QUFVMUY7SUFHRSw4QkFBb0IsTUFBeUI7UUFBekIsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFRdEMsZ0JBQVcsR0FBYyxFQUFFLENBQUM7UUFFNUIseUJBQW9CLEdBQUcsSUFBSSxrQ0FBZSxDQUFVLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQVQzRSxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzlDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLGtDQUFlLENBQVUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCx1Q0FBUSxHQUFSO0lBQ0EsQ0FBQztJQU9NLG9DQUFLLEdBQVosVUFBYSxNQUFlO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFQyw4REFBOEQ7SUFDOUQsNENBQWEsR0FBYixVQUFjLE9BQU87UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDL0UsaUNBQWlDO1FBQ2pDLG9DQUFvQztRQUNwQyxnRUFBZ0U7UUFDaEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUgsOENBQThDO0lBQzlDLHlEQUEwQixHQUExQixVQUEyQixLQUFLO1FBQzlCLElBQUksU0FBUyxHQUFjLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxrQ0FBZSxFQUFXLENBQUM7UUFDM0QsSUFBSSxXQUFXLEtBQUssRUFBRSxFQUFFO1lBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDeE0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3JEO2FBQ0Y7U0FDRjthQUFJO1lBQ0gsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksa0NBQWUsQ0FBVSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDNUU7SUFDSCxDQUFDO0lBNUNVLG9CQUFvQjtRQVBoQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixXQUFXLEVBQUUsOEJBQThCO1lBQzNDLFNBQVMsRUFBRSxDQUFDLDZCQUE2QixDQUFDO1lBQzFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtTQUNwQixDQUFDO3lDQUs0QixnQ0FBaUI7T0FIbEMsb0JBQW9CLENBZ0RoQztJQUFELDJCQUFDO0NBQUEsQUFoREQsSUFnREM7QUFoRFksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb21PYmplY3QgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGVcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9wYWdlXCI7XG5pbXBvcnQgeyBTZWFyY2hCYXIgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9zZWFyY2gtYmFyXCI7XG5pbXBvcnQgeyBNb2RhbERpYWxvZ1NlcnZpY2UsIE1vZGFsRGlhbG9nT3B0aW9ucywgTW9kYWxEaWFsb2dQYXJhbXMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nXCI7XG5pbXBvcnQgeyBTdHVkZW50IH0gZnJvbSAnfi9hcHAvbW9kZWxzL3N0dWRlbnQubW9kZWwnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUFycmF5IH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9kYXRhL29ic2VydmFibGUtYXJyYXkvb2JzZXJ2YWJsZS1hcnJheSc7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnMtc3R1ZGVudGxpc3QnLFxuICB0ZW1wbGF0ZVVybDogJy4vc3R1ZGVudGxpc3QuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zdHVkZW50bGlzdC5jb21wb25lbnQuY3NzJ10sXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG59KVxuXG5leHBvcnQgY2xhc3MgU3R1ZGVudGxpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBwdWJsaWMgcmVzdWx0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJhbXM6IE1vZGFsRGlhbG9nUGFyYW1zKSB7XG4gICAgdGhpcy5zdHVkZW50bGlzdCA9IHBhcmFtcy5jb250ZXh0LnN0dWRlbnRsaXN0O1xuICAgIHRoaXMuZGlzcGxheWVkU3R1ZGVudExpc3QgPSBuZXcgT2JzZXJ2YWJsZUFycmF5PFN0dWRlbnQ+KHRoaXMuc3R1ZGVudGxpc3QpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxuICBwdWJsaWMgc3R1ZGVudGxpc3Q6IFN0dWRlbnRbXSA9IFtdO1xuXG4gIHB1YmxpYyBkaXNwbGF5ZWRTdHVkZW50TGlzdCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8U3R1ZGVudD4odGhpcy5zdHVkZW50bGlzdCk7XG5cblxuICBwdWJsaWMgY2xvc2UocmVzdWx0OiBTdHVkZW50KSB7XG4gICAgdGhpcy5wYXJhbXMuY2xvc2VDYWxsYmFjayhyZXN1bHQpO1xuICB9XG5cbiAgICAvLyBwaWNrIGFuZCBsb2FkIGEgc3R1ZGVudCBmcm9tIHRoZSBsaXN0LCByZXNldCB0aGUgYXNzZXNzbWVudFxuICAgIHNlbGVjdFN0dWRlbnQoc3R1ZGVudCkge1xuICAgICAgY29uc29sZS5sb2coJ2V4YW1kZXRhaWwuY29tcG9uZW50LnRzLnNlbGVjdFN0dWRlbnQ6JyArIEpTT04uc3RyaW5naWZ5KHN0dWRlbnQpKVxuICAgICAgLy90aGlzLnNlbGVjdGVkU3R1ZGVudCA9IHN0dWRlbnQ7XG4gICAgICAvLyByZXNldCB0aGUgYXNzZXNzbWVudCBhIG5ldyBhbnN3ZXJcbiAgICAgIC8vdGhpcy5jdXJyZW50QXNzZXNzbWVudCA9IF8uY2xvbmVEZWVwKHRoaXMuYXNzZXNzbWVudFRlbXBsYXRlKTtcbiAgICAgIHRoaXMuY2xvc2Uoc3R1ZGVudCk7XG4gICAgfVxuXG4gIC8vIGZpbHRlciBzdHVkZW50IGxpc3QgYmFzZWQgb24gdGhlIHRleHQgaW5wdXRcbiAgb25TdHVkZW50U2VhcmNoVGV4dENoYW5nZWQoZXZlbnQpIHtcbiAgICBsZXQgc2VhcmNoQmFyID0gPFNlYXJjaEJhcj5ldmVudC5vYmplY3Q7XG4gICAgbGV0IHNlYXJjaFZhbHVlID0gc2VhcmNoQmFyLnRleHQudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zb2xlLmxvZyhcIlNlYXJjaEJhciB0ZXh0IGNoYW5nZWQhIE5ldyB2YWx1ZTogXCIgKyBzZWFyY2hCYXIudGV4dCk7XG4gICAgdGhpcy5kaXNwbGF5ZWRTdHVkZW50TGlzdCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8U3R1ZGVudD4oKTtcbiAgICBpZiAoc2VhcmNoVmFsdWUgIT09IFwiXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdHVkZW50bGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoKCh0aGlzLnN0dWRlbnRsaXN0W2ldLmZuYW1lLnRvTG93ZXJDYXNlKCkgKyAnICcgKyB0aGlzLnN0dWRlbnRsaXN0W2ldLmxuYW1lLnRvTG93ZXJDYXNlKCkpLmluZGV4T2Yoc2VhcmNoVmFsdWUpICE9PSAtMSkgfHwgKHRoaXMuc3R1ZGVudGxpc3RbaV0uc3R1ZGVudGlkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2hWYWx1ZSkgIT09IC0xKSkge1xuICAgICAgICAgIHRoaXMuZGlzcGxheWVkU3R1ZGVudExpc3QucHVzaCh0aGlzLnN0dWRlbnRsaXN0W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgdGhpcy5kaXNwbGF5ZWRTdHVkZW50TGlzdCA9IG5ldyBPYnNlcnZhYmxlQXJyYXk8U3R1ZGVudD4odGhpcy5zdHVkZW50bGlzdCk7XG4gICAgfVxuICB9XG5cblxuXG59XG4iXX0=