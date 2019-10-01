"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var student_model_1 = require("~/app/models/student.model");
var SelectstudententryComponent = /** @class */ (function () {
    function SelectstudententryComponent() {
        this.student = new student_model_1.Student();
        // Event emitter: https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
        this.studentSelectEvent = new core_1.EventEmitter();
    }
    SelectstudententryComponent.prototype.ngOnInit = function () {
    };
    SelectstudententryComponent.prototype.onTap = function () {
        console.log('SelectstudententryComponent onTap');
        this.studentSelectEvent.emit(this.student);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", student_model_1.Student)
    ], SelectstudententryComponent.prototype, "student", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SelectstudententryComponent.prototype, "studentSelectEvent", void 0);
    SelectstudententryComponent = __decorate([
        core_1.Component({
            selector: 'ns-selectstudententry',
            templateUrl: './selectstudententry.component.html',
            styleUrls: ['./selectstudententry.component.css'],
            moduleId: module.id,
        })
    ], SelectstudententryComponent);
    return SelectstudententryComponent;
}());
exports.SelectstudententryComponent = SelectstudententryComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0c3R1ZGVudGVudHJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlbGVjdHN0dWRlbnRlbnRyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBK0U7QUFDL0UsNERBQXFEO0FBU3JEO0lBTkE7UUFRVyxZQUFPLEdBQVksSUFBSSx1QkFBTyxFQUFFLENBQUM7UUFFMUMsMkdBQTJHO1FBQ2pHLHVCQUFrQixHQUFHLElBQUksbUJBQVksRUFBVyxDQUFDO0lBYTdELENBQUM7SUFUQyw4Q0FBUSxHQUFSO0lBRUEsQ0FBQztJQUVELDJDQUFLLEdBQUw7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQWRRO1FBQVIsWUFBSyxFQUFFO2tDQUFVLHVCQUFPO2dFQUFpQjtJQUdoQztRQUFULGFBQU0sRUFBRTs7MkVBQWtEO0lBTGhELDJCQUEyQjtRQU52QyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxXQUFXLEVBQUUscUNBQXFDO1lBQ2xELFNBQVMsRUFBRSxDQUFDLG9DQUFvQyxDQUFDO1lBQ2pELFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtTQUNwQixDQUFDO09BQ1csMkJBQTJCLENBa0J2QztJQUFELGtDQUFDO0NBQUEsQUFsQkQsSUFrQkM7QUFsQlksa0VBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3R1ZGVudCB9IGZyb20gJ34vYXBwL21vZGVscy9zdHVkZW50Lm1vZGVsJztcbmltcG9ydCB7IEV2ZW50RGF0YSwgT2JzZXJ2YWJsZSwgVmlld0Jhc2UgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL3BhZ2UvcGFnZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25zLXNlbGVjdHN0dWRlbnRlbnRyeScsXG4gIHRlbXBsYXRlVXJsOiAnLi9zZWxlY3RzdHVkZW50ZW50cnkuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zZWxlY3RzdHVkZW50ZW50cnkuY29tcG9uZW50LmNzcyddLFxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RzdHVkZW50ZW50cnlDb21wb25lbnQgIGltcGxlbWVudHMgIE9uSW5pdCB7XG5cbiAgQElucHV0KCkgc3R1ZGVudDogU3R1ZGVudCA9IG5ldyBTdHVkZW50KCk7XG5cbiAgLy8gRXZlbnQgZW1pdHRlcjogaHR0cHM6Ly9hbmd1bGFyZmlyZWJhc2UuY29tL2xlc3NvbnMvc2hhcmluZy1kYXRhLWJldHdlZW4tYW5ndWxhci1jb21wb25lbnRzLWZvdXItbWV0aG9kcy9cbiAgQE91dHB1dCgpIHN0dWRlbnRTZWxlY3RFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8U3R1ZGVudD4oKTtcblxuXG4gIFxuICBuZ09uSW5pdCgpIHtcblxuICB9XG5cbiAgb25UYXAoKSB7XG4gICAgY29uc29sZS5sb2coJ1NlbGVjdHN0dWRlbnRlbnRyeUNvbXBvbmVudCBvblRhcCcpXG4gICAgdGhpcy5zdHVkZW50U2VsZWN0RXZlbnQuZW1pdCh0aGlzLnN0dWRlbnQpO1xuICB9XG5cbn1cbiJdfQ==