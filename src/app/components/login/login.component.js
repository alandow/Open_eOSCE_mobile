"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("~/app/services/user.service");
var dialogs_1 = require("tns-core-modules/ui/dialogs");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var network_service_service_1 = require("~/app/services/network-service.service");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(userService, networkService, 
    // public loginService:LoginService,
    router, 
    //private modalService: ModalDialogService,
    viewContainerRef, routerExtensions) {
        this.userService = userService;
        this.networkService = networkService;
        this.router = router;
        this.viewContainerRef = viewContainerRef;
        this.routerExtensions = routerExtensions;
        this.username = 'user1';
        this.password = 'password';
        this.loginResult = {};
        this.userResult = {};
        this.processing = false;
        this.haserror = false;
        this.errormessage = '';
        // is there a config?
        if (this.networkService.config) {
            console.log(networkService.config);
        }
        else {
            console.log('goto config');
            this.routerExtensions.navigate(['config']);
        }
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.processing = false;
        this.login();
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        // turn on the waiting thing
        this.processing = true;
        this.haserror = false;
        this.networkService.login(this.username, this.password)
            .subscribe(function (observableresult) {
            console.log(JSON.stringify(observableresult['status']));
            // is there a status? If so, it's probably an error
            if (typeof (observableresult['status']) !== 'undefined') {
                if (observableresult['status'] == '401') {
                    // 401 is a bad authentication
                    _this.handleError('Login failed');
                    return;
                }
                else {
                    // anything else is something wrong with the network or the backend service
                    _this.handleError('Network error: ' + observableresult['message']);
                    return;
                }
            }
            // no status; we're in, boys!
            // Question... do we really need to test further?
            _this.networkService.access_token = observableresult['access_token'];
            _this.networkService.getUserDetails()
                .subscribe(function (result) {
                console.log(JSON.stringify(result));
                if (typeof (result['status']) !== 'undefined') {
                    // of there's a status at all, there's a problem
                    _this.handleError('Network error: ' + result['message']);
                    return;
                }
                // store the user details
                _this.userService.user.id = result['id'];
                _this.userService.user.name = result['name'];
                _this.userService.user.type = result['type'];
                _this.userService.user.currentToken = _this.networkService.access_token;
                // turn off the waiting dialog
                _this.processing = false;
                // go to the examlist page
                _this.routerExtensions.navigate(['examlist']);
            }),
                function (error) { return _this.handleError(error); };
        }),
            function (error) { return _this.handleError(error); };
    };
    LoginComponent.prototype.handleError = function (message) {
        console.log('handleError called');
        this.haserror = true;
        this.processing = false;
        this.errormessage = message;
    };
    LoginComponent.prototype.alert = function (message) {
        return dialogs_1.alert({
            title: "Error",
            okButtonText: "OK",
            message: message
        });
    };
    __decorate([
        core_1.ViewChild("passwordControl", { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "passwordControl", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'ns-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css'],
            moduleId: module.id,
        }),
        __metadata("design:paramtypes", [user_service_1.UserService,
            network_service_service_1.NetworkServiceService,
            router_1.Router,
            core_1.ViewContainerRef,
            router_2.RouterExtensions])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJGO0FBRzNGLDREQUEwRDtBQUMxRCx1REFBNEQ7QUFDNUQsMENBQXlDO0FBQ3pDLHNEQUErRDtBQUMvRCxrRkFBK0U7QUFVL0U7SUFhRSx3QkFDUyxXQUF3QixFQUN4QixjQUFxQztJQUM1QyxvQ0FBb0M7SUFDNUIsTUFBYztJQUN0QiwyQ0FBMkM7SUFDbkMsZ0JBQWtDLEVBQ2xDLGdCQUFrQztRQU5uQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBdUI7UUFFcEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUVkLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQW5CNUMsYUFBUSxHQUFXLE9BQU8sQ0FBQztRQUMzQixhQUFRLEdBQVcsVUFBVSxDQUFDO1FBQzlCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFFeEIsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBY2hCLHFCQUFxQjtRQUNyQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO2FBQU07WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVELGlDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUss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QTtRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztJQUM5QixDQUFDO0lBRUQsOEJBQUssR0FBTCxVQUFNLE9BQWU7UUFDbkIsT0FBTyxlQUFLLENBQUM7WUFDWCxLQUFLLEVBQUUsT0FBTztZQUNkLFlBQVksRUFBRSxJQUFJO1lBQ2xCLE9BQU8sRUFBRSxPQUFPO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFyRitDO1FBQS9DLGdCQUFTLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7a0NBQWtCLGlCQUFVOzJEQUFDO0lBWGpFLGNBQWM7UUFQMUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUM7WUFDcEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1NBQ3BCLENBQUM7eUNBZ0JzQiwwQkFBVztZQUNSLCtDQUFxQjtZQUU1QixlQUFNO1lBRUksdUJBQWdCO1lBQ2hCLHlCQUFnQjtPQXBCakMsY0FBYyxDQWtHMUI7SUFBRCxxQkFBQztDQUFBLEFBbEdELElBa0dDO0FBbEdZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDb250YWluZXJSZWYsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnfi9hcHAvbW9kZWxzL2NvbmZpZy5tb2RlbCc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnfi9hcHAvbW9kZWxzL3VzZXIubW9kZWwnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICd+L2FwcC9zZXJ2aWNlcy91c2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgYWxlcnQsIHByb21wdCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2RpYWxvZ3NcIjtcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBSb3V0ZXJFeHRlbnNpb25zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE5ldHdvcmtTZXJ2aWNlU2VydmljZSB9IGZyb20gJ34vYXBwL3NlcnZpY2VzL25ldHdvcmstc2VydmljZS5zZXJ2aWNlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICducy1sb2dpbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9sb2dpbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2xvZ2luLmNvbXBvbmVudC5jc3MnXSxcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbn0pXG5cbmV4cG9ydCBjbGFzcyBMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHVzZXJuYW1lOiBzdHJpbmcgPSAndXNlcjEnO1xuICBwYXNzd29yZDogc3RyaW5nID0gJ3Bhc3N3b3JkJztcbiAgbG9naW5SZXN1bHQ6IG9iamVjdCA9IHt9O1xuICB1c2VyUmVzdWx0OiBvYmplY3QgPSB7fTtcbiAgY29uZmlnOiBDb25maWc7XG4gIHByb2Nlc3Npbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaGFzZXJyb3IgPSBmYWxzZTtcbiAgZXJyb3JtZXNzYWdlID0gJyc7XG4gIFxuXG4gIEBWaWV3Q2hpbGQoXCJwYXNzd29yZENvbnRyb2xcIiwgeyBzdGF0aWM6IHRydWUgfSkgcGFzc3dvcmRDb250cm9sOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB1c2VyU2VydmljZTogVXNlclNlcnZpY2UsXG4gICAgcHVibGljIG5ldHdvcmtTZXJ2aWNlOiBOZXR3b3JrU2VydmljZVNlcnZpY2UsXG4gICAgLy8gcHVibGljIGxvZ2luU2VydmljZTpMb2dpblNlcnZpY2UsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAvL3ByaXZhdGUgbW9kYWxTZXJ2aWNlOiBNb2RhbERpYWxvZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgcm91dGVyRXh0ZW5zaW9uczogUm91dGVyRXh0ZW5zaW9uc1xuICApIHtcbiAgICAvLyBpcyB0aGVyZSBhIGNvbmZpZz9cbiAgICBpZiAodGhpcy5uZXR3b3JrU2VydmljZS5jb25maWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ldHdvcmtTZXJ2aWNlLmNvbmZpZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdnb3RvIGNvbmZpZycpO1xuICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFsnY29uZmlnJ10pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgIHRoaXMubG9naW4oKTtcbiAgfVxuXG4gIGxvZ2luKCkge1xuICAgIC8vIHR1cm4gb24gdGhlIHdhaXRpbmcgdGhpbmdcbiAgICB0aGlzLnByb2Nlc3NpbmcgPSB0cnVlO1xuICAgIHRoaXMuaGFzZXJyb3IgPSBmYWxzZTtcblxuICAgIHRoaXMubmV0d29ya1NlcnZpY2UubG9naW4odGhpcy51c2VybmFtZSwgdGhpcy5wYXNzd29yZClcbiAgICAgIC5zdWJzY3JpYmUob2JzZXJ2YWJsZXJlc3VsdCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KG9ic2VydmFibGVyZXN1bHRbJ3N0YXR1cyddKSk7XG4gICAgICAgIC8vIGlzIHRoZXJlIGEgc3RhdHVzPyBJZiBzbywgaXQncyBwcm9iYWJseSBhbiBlcnJvclxuICAgICAgICBpZiAodHlwZW9mIChvYnNlcnZhYmxlcmVzdWx0WydzdGF0dXMnXSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgaWYgKG9ic2VydmFibGVyZXN1bHRbJ3N0YXR1cyddID09ICc0MDEnKSB7XG4gICAgICAgICAgICAvLyA0MDEgaXMgYSBiYWQgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ0xvZ2luIGZhaWxlZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhbnl0aGluZyBlbHNlIGlzIHNvbWV0aGluZyB3cm9uZyB3aXRoIHRoZSBuZXR3b3JrIG9yIHRoZSBiYWNrZW5kIHNlcnZpY2VcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoJ05ldHdvcmsgZXJyb3I6ICcgKyBvYnNlcnZhYmxlcmVzdWx0WydtZXNzYWdlJ10pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBubyBzdGF0dXM7IHdlJ3JlIGluLCBib3lzIVxuICAgICAgICAvLyBRdWVzdGlvbi4uLiBkbyB3ZSByZWFsbHkgbmVlZCB0byB0ZXN0IGZ1cnRoZXI/XG4gICAgICAgIHRoaXMubmV0d29ya1NlcnZpY2UuYWNjZXNzX3Rva2VuID0gb2JzZXJ2YWJsZXJlc3VsdFsnYWNjZXNzX3Rva2VuJ107XG4gICAgICAgIHRoaXMubmV0d29ya1NlcnZpY2UuZ2V0VXNlckRldGFpbHMoKVxuICAgICAgICAgIC5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAocmVzdWx0WydzdGF0dXMnXSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIC8vIG9mIHRoZXJlJ3MgYSBzdGF0dXMgYXQgYWxsLCB0aGVyZSdzIGEgcHJvYmxlbVxuICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKCdOZXR3b3JrIGVycm9yOiAnICsgcmVzdWx0WydtZXNzYWdlJ10pO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzdG9yZSB0aGUgdXNlciBkZXRhaWxzXG4gICAgICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLnVzZXIuaWQgPSByZXN1bHRbJ2lkJ107XG4gICAgICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLnVzZXIubmFtZSA9IHJlc3VsdFsnbmFtZSddO1xuICAgICAgICAgICAgdGhpcy51c2VyU2VydmljZS51c2VyLnR5cGUgPSByZXN1bHRbJ3R5cGUnXTtcbiAgICAgICAgICAgIHRoaXMudXNlclNlcnZpY2UudXNlci5jdXJyZW50VG9rZW4gPSB0aGlzLm5ldHdvcmtTZXJ2aWNlLmFjY2Vzc190b2tlbjtcbiAgICAgICAgICAgIC8vIHR1cm4gb2ZmIHRoZSB3YWl0aW5nIGRpYWxvZ1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgZXhhbWxpc3QgcGFnZVxuICAgICAgICAgICAgdGhpcy5yb3V0ZXJFeHRlbnNpb25zLm5hdmlnYXRlKFsnZXhhbWxpc3QnXSk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgZXJyb3IgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvcilcblxuICAgICAgfSksXG4gICAgICBlcnJvciA9PiB0aGlzLmhhbmRsZUVycm9yKGVycm9yKVxuICB9XG5cbiAgaGFuZGxlRXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY29uc29sZS5sb2coJ2hhbmRsZUVycm9yIGNhbGxlZCcpO1xuICAgIHRoaXMuaGFzZXJyb3IgPSB0cnVlO1xuICAgIHRoaXMucHJvY2Vzc2luZyA9IGZhbHNlXG4gICAgdGhpcy5lcnJvcm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG5cbiAgYWxlcnQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGFsZXJ0KHtcbiAgICAgIHRpdGxlOiBcIkVycm9yXCIsXG4gICAgICBva0J1dHRvblRleHQ6IFwiT0tcIixcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=