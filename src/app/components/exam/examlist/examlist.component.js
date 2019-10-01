"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("~/app/services/user.service");
var network_service_service_1 = require("~/app/services/network-service.service");
var ExamlistComponent = /** @class */ (function () {
    function ExamlistComponent(userservice, networkService) {
        this.userservice = userservice;
        this.networkService = networkService;
        this.processing = false;
        this.haserror = false;
        this.errormessage = '';
        this.assessmentlist = [];
    }
    ExamlistComponent.prototype.ngOnInit = function () {
        console.log('examlist.component.ts ngOnInit called');
        this.getAssessments();
    };
    ExamlistComponent.prototype.getAssessments = function () {
        var _this = this;
        this.processing = true;
        this.haserror = false;
        console.log("examilst.component.ts says: getAssessments() called");
        this.networkService.getUserAssessments()
            .subscribe(function (result) {
            if (typeof (result['status']) !== 'undefined') {
                // of there's a status at all, there's a problem
                _this.handleError('Network error: ' + result['message']);
                return;
            }
            result.forEach(function (element) {
                // console.log('Element:'+JSON.stringify(element));
                _this.assessmentlist.push(element);
            });
            _this.processing = false;
            _this.haserror = false;
            //console.log('assessment list is:'+JSON.stringify(this.assessmentlist));
        }),
            function (error) { return console.log(error); },
            function () { return console.log('login.component.ts.login() subscription complete result:complete'); };
    };
    ExamlistComponent.prototype.handleError = function (message) {
        console.log('handleError called');
        this.haserror = true;
        this.processing = false;
        this.errormessage = message;
    };
    ExamlistComponent = __decorate([
        core_1.Component({
            selector: 'ns-examlist',
            templateUrl: './examlist.component.html',
            styleUrls: ['./examlist.component.css'],
            moduleId: module.id,
        }),
        __metadata("design:paramtypes", [user_service_1.UserService, network_service_service_1.NetworkServiceService])
    ], ExamlistComponent);
    return ExamlistComponent;
}());
exports.ExamlistComponent = ExamlistComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBRWxELDREQUEwRDtBQUMxRCxrRkFBK0U7QUFRL0U7SUFNRSwyQkFBbUIsV0FBd0IsRUFBVSxjQUFxQztRQUF2RSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQUoxRixlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzVCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsaUJBQVksR0FBRyxFQUFFLENBQUM7UUFJWCxtQkFBYyxHQUFpQixFQUFFLENBQUM7SUFGcUQsQ0FBQztJQUsvRixvQ0FBUSxHQUFSO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsMENBQWMsR0FBZDtRQUFBLGlCQXVCQztRQXRCQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRTthQUNyQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQ2YsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssV0FBVyxFQUFFO2dCQUM3QyxnREFBZ0Q7Z0JBQ2hELEtBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE9BQU87YUFDUjtZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO2dCQUNwQixtREFBbUQ7Z0JBQ25ELEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXBDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDeEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDOUIseUVBQXlFO1FBQ25FLENBQUMsQ0FBQztZQUNGLFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBbEIsQ0FBa0I7WUFDM0IsY0FBTSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0VBQWtFLENBQUMsRUFBL0UsQ0FBK0UsQ0FBQztJQUUxRixDQUFDO0lBRUQsdUNBQVcsR0FBWCxVQUFZLE9BQWU7UUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDO0lBQzlCLENBQUM7SUE5Q1UsaUJBQWlCO1FBTjdCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUsMkJBQTJCO1lBQ3hDLFNBQVMsRUFBRSxDQUFDLDBCQUEwQixDQUFDO1lBQ3ZDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtTQUNwQixDQUFDO3lDQU9nQywwQkFBVyxFQUEwQiwrQ0FBcUI7T0FOL0UsaUJBQWlCLENBZ0Q3QjtJQUFELHdCQUFDO0NBQUEsQUFoREQsSUFnREM7QUFoRFksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFzc2Vzc21lbnQgfSBmcm9tICd+L2FwcC9tb2RlbHMvYXNzZXNzbWVudC5tb2RlbCc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJ34vYXBwL3NlcnZpY2VzL3VzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBOZXR3b3JrU2VydmljZVNlcnZpY2UgfSBmcm9tICd+L2FwcC9zZXJ2aWNlcy9uZXR3b3JrLXNlcnZpY2Uuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25zLWV4YW1saXN0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2V4YW1saXN0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZXhhbWxpc3QuY29tcG9uZW50LmNzcyddLFxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxufSlcbmV4cG9ydCBjbGFzcyBFeGFtbGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJvY2Vzc2luZzogYm9vbGVhbiA9IGZhbHNlO1xuICBoYXNlcnJvciA9IGZhbHNlO1xuICBlcnJvcm1lc3NhZ2UgPSAnJztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdXNlcnNlcnZpY2U6IFVzZXJTZXJ2aWNlLCBwcml2YXRlIG5ldHdvcmtTZXJ2aWNlOiBOZXR3b3JrU2VydmljZVNlcnZpY2UpIHsgfVxuXG4gIHB1YmxpYyBhc3Nlc3NtZW50bGlzdDogQXNzZXNzbWVudFtdID0gW107XG5cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZygnZXhhbWxpc3QuY29tcG9uZW50LnRzIG5nT25Jbml0IGNhbGxlZCcpO1xuICAgIHRoaXMuZ2V0QXNzZXNzbWVudHMoKTtcbiAgfVxuXG4gIGdldEFzc2Vzc21lbnRzKCkge1xuICAgIHRoaXMucHJvY2Vzc2luZyA9IHRydWU7XG4gICAgdGhpcy5oYXNlcnJvciA9IGZhbHNlO1xuICAgIGNvbnNvbGUubG9nKFwiZXhhbWlsc3QuY29tcG9uZW50LnRzIHNheXM6IGdldEFzc2Vzc21lbnRzKCkgY2FsbGVkXCIpO1xuICAgIHRoaXMubmV0d29ya1NlcnZpY2UuZ2V0VXNlckFzc2Vzc21lbnRzKClcbiAgICAgIC5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiAocmVzdWx0WydzdGF0dXMnXSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gb2YgdGhlcmUncyBhIHN0YXR1cyBhdCBhbGwsIHRoZXJlJ3MgYSBwcm9ibGVtXG4gICAgICAgICAgdGhpcy5oYW5kbGVFcnJvcignTmV0d29yayBlcnJvcjogJyArIHJlc3VsdFsnbWVzc2FnZSddKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ0VsZW1lbnQ6JytKU09OLnN0cmluZ2lmeShlbGVtZW50KSk7XG4gICAgICAgICAgdGhpcy5hc3Nlc3NtZW50bGlzdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnByb2Nlc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNlcnJvciA9IGZhbHNlO1xuLy9jb25zb2xlLmxvZygnYXNzZXNzbWVudCBsaXN0IGlzOicrSlNPTi5zdHJpbmdpZnkodGhpcy5hc3Nlc3NtZW50bGlzdCkpO1xuICAgICAgfSksXG4gICAgICBlcnJvciA9PiBjb25zb2xlLmxvZyhlcnJvciksXG4gICAgICAoKSA9PiBjb25zb2xlLmxvZygnbG9naW4uY29tcG9uZW50LnRzLmxvZ2luKCkgc3Vic2NyaXB0aW9uIGNvbXBsZXRlIHJlc3VsdDpjb21wbGV0ZScpO1xuICAgICBcbiAgfVxuXG4gIGhhbmRsZUVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGNvbnNvbGUubG9nKCdoYW5kbGVFcnJvciBjYWxsZWQnKTtcbiAgICB0aGlzLmhhc2Vycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnByb2Nlc3NpbmcgPSBmYWxzZVxuICAgIHRoaXMuZXJyb3JtZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxuXG59XG4iXX0=