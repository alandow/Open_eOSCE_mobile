"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var config_model_1 = require("../models/config.model");
var nativescript_couchbase_plugin_1 = require("nativescript-couchbase-plugin");
var http_1 = require("@angular/common/http");
var router_1 = require("nativescript-angular/router");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var connectivity_1 = require("tns-core-modules/connectivity");
var NetworkServiceService = /** @class */ (function () {
    function NetworkServiceService(http, routerExtensions) {
        var _this = this;
        this.http = http;
        this.routerExtensions = routerExtensions;
        this.config = new config_model_1.Config();
        // are we connected to the Internet?
        this.connected = true;
        this.headers = new http_1.HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });
        this.storageDatabase = new nativescript_couchbase_plugin_1.Couchbase('storage');
        // get initial network state
        var myConnectionType = connectivity_1.getConnectionType();
        if (myConnectionType == connectivity_1.connectionType.none) {
            this.connected = false;
        }
        // start monitoring for network changes
        connectivity_1.startMonitoring(function (newConnectionType) {
            // console.log(newConnectionType)
            switch (newConnectionType) {
                case connectivity_1.connectionType.none:
                    _this.connected = false;
                    console.log("Connection type changed to none.");
                    break;
                case connectivity_1.connectionType.wifi:
                    _this.connected = true;
                    console.log("Connection type changed to WiFi.");
                    _this.submitDelayedAssessment();
                    break;
                case connectivity_1.connectionType.mobile:
                    _this.connected = true;
                    console.log("Connection type changed to mobile.");
                    break;
                default:
                    break;
            }
        });
    }
    // login, get token
    NetworkServiceService.prototype.login = function (username, password) {
        console.log('network-service.service.ts says: login() called');
        var formData = JSON.stringify({
            username: username,
            password: password,
            grant_type: 'password',
            client_id: this.config.client_id,
            client_secret: this.config.client_secret
        });
        // console.log(formData);
        return this.http.post(this.config.service_url + '/oauth/token', formData, { headers: this.headers }).pipe(
        // this catches an error, returns the error. 
        operators_1.catchError(function (err) { return rxjs_1.of(err); }));
    };
    // check that the configured service is correct
    NetworkServiceService.prototype.checkConfig = function () {
        if (this.storageDatabase.getDocument("config")) {
            this.config = this.storageDatabase.getDocument("config");
        }
        else {
            this.routerExtensions.navigate(['config']);
        }
        console.log('network-service.service.ts says: checkConfig() called');
        var formData = JSON.stringify(this.config);
        return this.http.post(this.config.service_url + '/api/check', formData, { headers: this.headers }).pipe(
        // this catches an error, returns the error. 
        operators_1.catchError(function (err) { return rxjs_1.of(err); }));
    };
    // get the logged on user details from the backend
    // @TODO offline capability- store then 
    NetworkServiceService.prototype.getUserDetails = function () {
        console.log('network-service.service.ts says: getUserDetails() called');
        var formData = JSON.stringify(this.config);
        this.headers.append('Authorization', 'Bearer ' + this.access_token);
        console.log('getUserDetails:');
        var theheaders = new http_1.HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.access_token
        });
        return this.http.post(this.config.service_url + '/api/user', formData, { headers: theheaders }).pipe(
        // this catches an error, returns the error. 
        operators_1.catchError(function (err) { return rxjs_1.of(err); }));
    };
    // get the exams assigned to this user
    // @TODO offline capability- store then get from database if not connected
    NetworkServiceService.prototype.getUserAssessments = function () {
        console.log('network-service.service.ts says: getUserAssessments() called');
        // this.headers.append('Authorization', 'Bearer ' + this.access_token)
        //console.log('Token:' + this.access_token);
        var theheaders = new http_1.HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.access_token
        });
        return this.http.post(this.config.service_url + '/api/getassessments', null, { headers: theheaders }).pipe(
        // this catches an error, returns the error. 
        operators_1.catchError(function (err) { return rxjs_1.of(err); }));
    };
    // get a specific exam
    // @TODO offline capability- store then get from database if not connected
    NetworkServiceService.prototype.getAssessment = function (id) {
        if (this.connected) {
            console.log('network-service.service.ts says: getAssessment() called');
            this.headers.append('Authorization', 'Bearer ' + this.access_token);
            // console.log('Token:' + this.access_token);
            var theheaders = new http_1.HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.access_token
            });
            return this.http.post(this.config.service_url + '/api/getassessmentdetails/' + id, null, { headers: theheaders }).pipe(
            // this catches an error, returns the error. 
            operators_1.catchError(function (err) { return rxjs_1.of(err); }));
        }
        else {
            //@TODO return stored assessment here
        }
    };
    // get the students assigned to this assessment
    // @TODO offline capability- get from database if not connected
    NetworkServiceService.prototype.getstudentsForAssessment = function (id) {
        if (this.connected) {
            console.log('network-service.service.ts says: getstudentsForAssessment() called');
            this.headers.append('Authorization', 'Bearer ' + this.access_token);
            console.log('Token:' + this.access_token);
            var theheaders = new http_1.HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.access_token
            });
            return this.http.post(this.config.service_url + '/api/getassessmentstudents/' + id, null, { headers: theheaders }).pipe(
            // this catches an error, returns the error. 
            operators_1.catchError(function (err) { return rxjs_1.of(err); }));
        }
        else {
            //@TODO return stored user details here
        }
        ;
    };
    NetworkServiceService.prototype.handleError = function (error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error("Backend returned code " + error.status + ", " +
                ("body was: " + error.error));
        }
        // return an observable with a user-facing error message
        return rxjs_1.throwError('Something bad happened; please try again later.');
    };
    ;
    // Submit an assignment
    // @TODO offline capability- set to database if not connected, upload when connection detected
    NetworkServiceService.prototype.submitAssessment = function (student_id, assessment) {
        console.log('network-service.service.ts says: submitAssessment() called');
        // build the answer object
        var submitdata = {
            student_id: student_id,
            exam_instances_id: assessment.id,
            comments: assessment.comment,
            answerdata: []
        };
        // answers
        assessment.exam_instance_items.forEach(function (element) {
            submitdata.answerdata.push({
                id: element.id,
                value: element.selectedvalue,
                selected_id: element.selected_id,
                comment: element.comment
            });
        });
        var formData = JSON.stringify(submitdata);
        console.log('Assessment data is:' + formData);
        console.log(this.connected);
        if (this.connected) {
            // headers
            var theheaders = new http_1.HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.access_token
            });
            // submit
            console.log('about to post');
            return this.http.post(this.config.service_url + '/api/submitassessment', formData, { headers: theheaders }).pipe(
            // this catches an error, returns the error. 
            operators_1.catchError(function (err) { return rxjs_1.of(err); }));
        }
        else {
            //@TODO store submission here for later transmission
        }
        ;
    };
    // submit delayed assessment. @TODO work out some way of telling the world there's things ready to go
    NetworkServiceService.prototype.submitDelayedAssessment = function () {
        return;
    };
    NetworkServiceService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, router_1.RouterExtensions])
    ], NetworkServiceService);
    return NetworkServiceService;
}());
exports.NetworkServiceService = NetworkServiceService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXR3b3JrLXNlcnZpY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyx1REFBZ0Q7QUFDaEQsK0VBQTBEO0FBQzFELDZDQUFrRjtBQUNsRixzREFBK0Q7QUFDL0QsNkJBQWtEO0FBQ2xELDRDQUFtRDtBQUNuRCw4REFBbUg7QUFPbkg7SUFhRSwrQkFBb0IsSUFBZ0IsRUFBVSxnQkFBa0M7UUFBaEYsaUJBNkJDO1FBN0JtQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVpoRixXQUFNLEdBQVcsSUFBSSxxQkFBTSxFQUFFLENBQUM7UUFHOUIsb0NBQW9DO1FBRXBDLGNBQVMsR0FBVyxJQUFJLENBQUM7UUFFekIsWUFBTyxHQUFHLElBQUksa0JBQVcsQ0FBQztZQUN4QixRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLGNBQWMsRUFBRSxrQkFBa0I7U0FDbkMsQ0FBQyxDQUFDO1FBR0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlDQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsNEJBQTRCO1FBQzVCLElBQU0sZ0JBQWdCLEdBQUcsZ0NBQWlCLEVBQUUsQ0FBQztRQUM3QyxJQUFJLGdCQUFnQixJQUFJLDZCQUFjLENBQUMsSUFBSSxFQUFFO1lBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO1FBQ0QsdUNBQXVDO1FBQ3ZDLDhCQUFlLENBQUMsVUFBQyxpQkFBaUI7WUFDaEMsaUNBQWlDO1lBQ2pDLFFBQVEsaUJBQWlCLEVBQUU7Z0JBQ3pCLEtBQUssNkJBQWMsQ0FBQyxJQUFJO29CQUN0QixLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO29CQUNoRCxN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QUFJLE9BQUEsU0FBRSxDQUFDLEdBQUcsQ0FBQyxFQUFQLENBQU8sQ0FBQyxDQUMzQixDQUNFO1NBQ0o7YUFBTTtZQUNMLG9EQUFvRDtTQUNyRDtRQUNELENBQUM7SUFDSCxDQUFDO0lBRUQscUdBQXFHO0lBQ3JHLHVEQUF1QixHQUF2QjtRQUNFLE9BQU87SUFDVCxDQUFDO0lBOU5VLHFCQUFxQjtRQUhqQyxpQkFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQzt5Q0FjMEIsaUJBQVUsRUFBNEIseUJBQWdCO09BYnJFLHFCQUFxQixDQStOakM7SUFBRCw0QkFBQztDQUFBLEFBL05ELElBK05DO0FBL05ZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL21vZGVscy9jb25maWcubW9kZWwnO1xuaW1wb3J0IHsgQ291Y2hiYXNlIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWNvdWNoYmFzZS1wbHVnaW4nO1xuaW1wb3J0IHsgSHR0cEhlYWRlcnMsIEh0dHBDbGllbnQsIEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgUm91dGVyRXh0ZW5zaW9ucyB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciwgcmV0cnkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBjb25uZWN0aW9uVHlwZSwgZ2V0Q29ubmVjdGlvblR5cGUsIHN0YXJ0TW9uaXRvcmluZywgc3RvcE1vbml0b3JpbmcgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9jb25uZWN0aXZpdHlcIjtcbmltcG9ydCB7IEFzc2Vzc21lbnQgfSBmcm9tICcuLi9tb2RlbHMvYXNzZXNzbWVudC5tb2RlbCc7XG5cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmV0d29ya1NlcnZpY2VTZXJ2aWNlIHtcbiAgY29uZmlnOiBDb25maWcgPSBuZXcgQ29uZmlnKCk7XG4gIHN0b3JhZ2VEYXRhYmFzZTogQ291Y2hiYXNlO1xuICBhY2Nlc3NfdG9rZW46IHN0cmluZztcbiAgLy8gYXJlIHdlIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQ/XG5cbiAgY29ubmVjdGVkOmJvb2xlYW4gPSB0cnVlO1xuXG4gIGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgfSk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHJvdXRlckV4dGVuc2lvbnM6IFJvdXRlckV4dGVuc2lvbnMpIHtcbiAgICB0aGlzLnN0b3JhZ2VEYXRhYmFzZSA9IG5ldyBDb3VjaGJhc2UoJ3N0b3JhZ2UnKTtcbiAgICAvLyBnZXQgaW5pdGlhbCBuZXR3b3JrIHN0YXRlXG4gICAgY29uc3QgbXlDb25uZWN0aW9uVHlwZSA9IGdldENvbm5lY3Rpb25UeXBlKCk7XG4gICAgaWYgKG15Q29ubmVjdGlvblR5cGUgPT0gY29ubmVjdGlvblR5cGUubm9uZSkge1xuICAgICAgdGhpcy5jb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gc3RhcnQgbW9uaXRvcmluZyBmb3IgbmV0d29yayBjaGFuZ2VzXG4gICAgc3RhcnRNb25pdG9yaW5nKChuZXdDb25uZWN0aW9uVHlwZSkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2cobmV3Q29ubmVjdGlvblR5cGUpXG4gICAgICBzd2l0Y2ggKG5ld0Nvbm5lY3Rpb25UeXBlKSB7XG4gICAgICAgIGNhc2UgY29ubmVjdGlvblR5cGUubm9uZTpcbiAgICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGlvbiB0eXBlIGNoYW5nZWQgdG8gbm9uZS5cIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgY29ubmVjdGlvblR5cGUud2lmaTpcbiAgICAgICAgICB0aGlzLmNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJDb25uZWN0aW9uIHR5cGUgY2hhbmdlZCB0byBXaUZpLlwiKTtcbiAgICAgICAgICB0aGlzLnN1Ym1pdERlbGF5ZWRBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgY29ubmVjdGlvblR5cGUubW9iaWxlOlxuICAgICAgICAgIHRoaXMuY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gdHlwZSBjaGFuZ2VkIHRvIG1vYmlsZS5cIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuICAvLyBsb2dpbiwgZ2V0IHRva2VuXG4gIGxvZ2luKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPG9iamVjdD4ge1xuICAgIGNvbnNvbGUubG9nKCduZXR3b3JrLXNlcnZpY2Uuc2VydmljZS50cyBzYXlzOiBsb2dpbigpIGNhbGxlZCcpXG4gICAgbGV0IGZvcm1EYXRhID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgZ3JhbnRfdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgIGNsaWVudF9pZDogdGhpcy5jb25maWcuY2xpZW50X2lkLFxuICAgICAgY2xpZW50X3NlY3JldDogdGhpcy5jb25maWcuY2xpZW50X3NlY3JldFxuICAgIH0pXG4gICAgLy8gY29uc29sZS5sb2coZm9ybURhdGEpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLmNvbmZpZy5zZXJ2aWNlX3VybCArICcvb2F1dGgvdG9rZW4nLCBmb3JtRGF0YSwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSkucGlwZShcbiAgICAgIC8vIHRoaXMgY2F0Y2hlcyBhbiBlcnJvciwgcmV0dXJucyB0aGUgZXJyb3IuIFxuICAgICAgY2F0Y2hFcnJvcihlcnIgPT4gb2YoZXJyKSlcbiAgICApO1xuICB9XG5cbiAgLy8gY2hlY2sgdGhhdCB0aGUgY29uZmlndXJlZCBzZXJ2aWNlIGlzIGNvcnJlY3RcbiAgY2hlY2tDb25maWcoKTogT2JzZXJ2YWJsZTxvYmplY3Q+IHtcbiAgICBpZiAodGhpcy5zdG9yYWdlRGF0YWJhc2UuZ2V0RG9jdW1lbnQoXCJjb25maWdcIikpIHtcbiAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5zdG9yYWdlRGF0YWJhc2UuZ2V0RG9jdW1lbnQoXCJjb25maWdcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm91dGVyRXh0ZW5zaW9ucy5uYXZpZ2F0ZShbJ2NvbmZpZyddKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ25ldHdvcmstc2VydmljZS5zZXJ2aWNlLnRzIHNheXM6IGNoZWNrQ29uZmlnKCkgY2FsbGVkJylcbiAgICBsZXQgZm9ybURhdGEgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbmZpZyk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMuY29uZmlnLnNlcnZpY2VfdXJsICsgJy9hcGkvY2hlY2snLCBmb3JtRGF0YSwgeyBoZWFkZXJzOiB0aGlzLmhlYWRlcnMgfSkucGlwZShcbiAgICAgIC8vIHRoaXMgY2F0Y2hlcyBhbiBlcnJvciwgcmV0dXJucyB0aGUgZXJyb3IuIFxuICAgICAgY2F0Y2hFcnJvcihlcnIgPT4gb2YoZXJyKSlcbiAgICApO1xuICB9XG5cbiAgLy8gZ2V0IHRoZSBsb2dnZWQgb24gdXNlciBkZXRhaWxzIGZyb20gdGhlIGJhY2tlbmRcbiAgLy8gQFRPRE8gb2ZmbGluZSBjYXBhYmlsaXR5LSBzdG9yZSB0aGVuIFxuICBnZXRVc2VyRGV0YWlscygpOiBPYnNlcnZhYmxlPG9iamVjdD4ge1xuICAgIGNvbnNvbGUubG9nKCduZXR3b3JrLXNlcnZpY2Uuc2VydmljZS50cyBzYXlzOiBnZXRVc2VyRGV0YWlscygpIGNhbGxlZCcpXG4gICAgbGV0IGZvcm1EYXRhID0gSlNPTi5zdHJpbmdpZnkodGhpcy5jb25maWcpO1xuICAgIHRoaXMuaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyB0aGlzLmFjY2Vzc190b2tlbilcbiAgICBjb25zb2xlLmxvZygnZ2V0VXNlckRldGFpbHM6Jyk7XG4gICAgbGV0IHRoZWhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIHRoaXMuYWNjZXNzX3Rva2VuXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMuY29uZmlnLnNlcnZpY2VfdXJsICsgJy9hcGkvdXNlcicsIGZvcm1EYXRhLCB7IGhlYWRlcnM6IHRoZWhlYWRlcnMgfSkucGlwZShcbiAgICAgIC8vIHRoaXMgY2F0Y2hlcyBhbiBlcnJvciwgcmV0dXJucyB0aGUgZXJyb3IuIFxuICAgICAgY2F0Y2hFcnJvcihlcnIgPT4gb2YoZXJyKSlcbiAgICApO1xuICB9XG5cbiAgLy8gZ2V0IHRoZSBleGFtcyBhc3NpZ25lZCB0byB0aGlzIHVzZXJcbiAgLy8gQFRPRE8gb2ZmbGluZSBjYXBhYmlsaXR5LSBzdG9yZSB0aGVuIGdldCBmcm9tIGRhdGFiYXNlIGlmIG5vdCBjb25uZWN0ZWRcbiAgZ2V0VXNlckFzc2Vzc21lbnRzKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc29sZS5sb2coJ25ldHdvcmstc2VydmljZS5zZXJ2aWNlLnRzIHNheXM6IGdldFVzZXJBc3Nlc3NtZW50cygpIGNhbGxlZCcpXG4gICAvLyB0aGlzLmhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdGhpcy5hY2Nlc3NfdG9rZW4pXG4gICAgLy9jb25zb2xlLmxvZygnVG9rZW46JyArIHRoaXMuYWNjZXNzX3Rva2VuKTtcbiAgICBsZXQgdGhlaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgdGhpcy5hY2Nlc3NfdG9rZW5cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5jb25maWcuc2VydmljZV91cmwgKyAnL2FwaS9nZXRhc3Nlc3NtZW50cycsIG51bGwsIHsgaGVhZGVyczogdGhlaGVhZGVycyB9KS5waXBlKFxuICAgICAgLy8gdGhpcyBjYXRjaGVzIGFuIGVycm9yLCByZXR1cm5zIHRoZSBlcnJvci4gXG4gICAgICBjYXRjaEVycm9yKGVyciA9PiBvZihlcnIpKVxuICAgICk7XG4gIH1cblxuXG4gIC8vIGdldCBhIHNwZWNpZmljIGV4YW1cbiAgLy8gQFRPRE8gb2ZmbGluZSBjYXBhYmlsaXR5LSBzdG9yZSB0aGVuIGdldCBmcm9tIGRhdGFiYXNlIGlmIG5vdCBjb25uZWN0ZWRcbiAgZ2V0QXNzZXNzbWVudChpZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0ZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCduZXR3b3JrLXNlcnZpY2Uuc2VydmljZS50cyBzYXlzOiBnZXRBc3Nlc3NtZW50KCkgY2FsbGVkJylcbiAgICAgIHRoaXMuaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyB0aGlzLmFjY2Vzc190b2tlbilcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdUb2tlbjonICsgdGhpcy5hY2Nlc3NfdG9rZW4pO1xuICAgICAgbGV0IHRoZWhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIHRoaXMuYWNjZXNzX3Rva2VuXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLmNvbmZpZy5zZXJ2aWNlX3VybCArICcvYXBpL2dldGFzc2Vzc21lbnRkZXRhaWxzLycgKyBpZCwgbnVsbCwgeyBoZWFkZXJzOiB0aGVoZWFkZXJzIH0pLnBpcGUoXG4gICAgICAgIC8vIHRoaXMgY2F0Y2hlcyBhbiBlcnJvciwgcmV0dXJucyB0aGUgZXJyb3IuIFxuICAgICAgICBjYXRjaEVycm9yKGVyciA9PiBvZihlcnIpKVxuICAgICAgKVxuICAgICAgICA7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vQFRPRE8gcmV0dXJuIHN0b3JlZCBhc3Nlc3NtZW50IGhlcmVcbiAgICB9XG4gIH1cblxuICAvLyBnZXQgdGhlIHN0dWRlbnRzIGFzc2lnbmVkIHRvIHRoaXMgYXNzZXNzbWVudFxuICAvLyBAVE9ETyBvZmZsaW5lIGNhcGFiaWxpdHktIGdldCBmcm9tIGRhdGFiYXNlIGlmIG5vdCBjb25uZWN0ZWRcbiAgZ2V0c3R1ZGVudHNGb3JBc3Nlc3NtZW50KGlkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICh0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgY29uc29sZS5sb2coJ25ldHdvcmstc2VydmljZS5zZXJ2aWNlLnRzIHNheXM6IGdldHN0dWRlbnRzRm9yQXNzZXNzbWVudCgpIGNhbGxlZCcpXG4gICAgICB0aGlzLmhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdGhpcy5hY2Nlc3NfdG9rZW4pXG4gICAgICBjb25zb2xlLmxvZygnVG9rZW46JyArIHRoaXMuYWNjZXNzX3Rva2VuKTtcbiAgICAgIGxldCB0aGVoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyB0aGlzLmFjY2Vzc190b2tlblxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy5jb25maWcuc2VydmljZV91cmwgKyAnL2FwaS9nZXRhc3Nlc3NtZW50c3R1ZGVudHMvJyArIGlkLCBudWxsLCB7IGhlYWRlcnM6IHRoZWhlYWRlcnMgfSkucGlwZShcbiAgICAgICAgLy8gdGhpcyBjYXRjaGVzIGFuIGVycm9yLCByZXR1cm5zIHRoZSBlcnJvci4gXG4gICAgICAgIGNhdGNoRXJyb3IoZXJyID0+IG9mKGVycikpXG4gICAgICApO1xuICAgICAgICBcbiAgICB9IGVsc2Uge1xuICAgICAgLy9AVE9ETyByZXR1cm4gc3RvcmVkIHVzZXIgZGV0YWlscyBoZXJlXG4gICAgfVxuICAgIDtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlKSB7XG4gICAgaWYgKGVycm9yLmVycm9yIGluc3RhbmNlb2YgRXJyb3JFdmVudCkge1xuICAgICAgLy8gQSBjbGllbnQtc2lkZSBvciBuZXR3b3JrIGVycm9yIG9jY3VycmVkLiBIYW5kbGUgaXQgYWNjb3JkaW5nbHkuXG4gICAgICBjb25zb2xlLmVycm9yKCdBbiBlcnJvciBvY2N1cnJlZDonLCBlcnJvci5lcnJvci5tZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIGJhY2tlbmQgcmV0dXJuZWQgYW4gdW5zdWNjZXNzZnVsIHJlc3BvbnNlIGNvZGUuXG4gICAgICAvLyBUaGUgcmVzcG9uc2UgYm9keSBtYXkgY29udGFpbiBjbHVlcyBhcyB0byB3aGF0IHdlbnQgd3JvbmcsXG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBgQmFja2VuZCByZXR1cm5lZCBjb2RlICR7ZXJyb3Iuc3RhdHVzfSwgYCArXG4gICAgICAgIGBib2R5IHdhczogJHtlcnJvci5lcnJvcn1gKTtcbiAgICB9XG4gICAgLy8gcmV0dXJuIGFuIG9ic2VydmFibGUgd2l0aCBhIHVzZXItZmFjaW5nIGVycm9yIG1lc3NhZ2VcbiAgICByZXR1cm4gdGhyb3dFcnJvcihcbiAgICAgICdTb21ldGhpbmcgYmFkIGhhcHBlbmVkOyBwbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xuICB9O1xuXG4gIC8vIFN1Ym1pdCBhbiBhc3NpZ25tZW50XG4gIC8vIEBUT0RPIG9mZmxpbmUgY2FwYWJpbGl0eS0gc2V0IHRvIGRhdGFiYXNlIGlmIG5vdCBjb25uZWN0ZWQsIHVwbG9hZCB3aGVuIGNvbm5lY3Rpb24gZGV0ZWN0ZWRcbiAgc3VibWl0QXNzZXNzbWVudChzdHVkZW50X2lkOiBzdHJpbmcsIGFzc2Vzc21lbnQ6IEFzc2Vzc21lbnQpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnNvbGUubG9nKCduZXR3b3JrLXNlcnZpY2Uuc2VydmljZS50cyBzYXlzOiBzdWJtaXRBc3Nlc3NtZW50KCkgY2FsbGVkJylcbiAgICAvLyBidWlsZCB0aGUgYW5zd2VyIG9iamVjdFxuICAgIGxldCBzdWJtaXRkYXRhID0ge1xuICAgICAgc3R1ZGVudF9pZDogc3R1ZGVudF9pZCxcbiAgICAgIGV4YW1faW5zdGFuY2VzX2lkOiBhc3Nlc3NtZW50LmlkLFxuICAgICAgY29tbWVudHM6IGFzc2Vzc21lbnQuY29tbWVudCxcbiAgICAgIGFuc3dlcmRhdGE6IFtdXG5cbiAgICB9O1xuXG4gICAgLy8gYW5zd2Vyc1xuICAgIGFzc2Vzc21lbnQuZXhhbV9pbnN0YW5jZV9pdGVtcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgc3VibWl0ZGF0YS5hbnN3ZXJkYXRhLnB1c2goe1xuICAgICAgICBpZDogZWxlbWVudC5pZCxcbiAgICAgICAgdmFsdWU6IGVsZW1lbnQuc2VsZWN0ZWR2YWx1ZSxcbiAgICAgICAgc2VsZWN0ZWRfaWQ6IGVsZW1lbnQuc2VsZWN0ZWRfaWQsXG4gICAgICAgIGNvbW1lbnQ6IGVsZW1lbnQuY29tbWVudFxuICAgICAgfSlcbiAgICB9XG4gICAgKTtcbiAgICBsZXQgZm9ybURhdGEgPSBKU09OLnN0cmluZ2lmeShzdWJtaXRkYXRhKTtcblxuICAgIGNvbnNvbGUubG9nKCdBc3Nlc3NtZW50IGRhdGEgaXM6Jytmb3JtRGF0YSk7XG4gICAgY29uc29sZS5sb2codGhpcy5jb25uZWN0ZWQpO1xuICAgIGlmICh0aGlzLmNvbm5lY3RlZCkge1xuICAgICAgLy8gaGVhZGVyc1xuICAgICAgbGV0IHRoZWhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIHRoaXMuYWNjZXNzX3Rva2VuXG4gICAgICB9KTtcbiAgICAgIC8vIHN1Ym1pdFxuY29uc29sZS5sb2coJ2Fib3V0IHRvIHBvc3QnKVxuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMuY29uZmlnLnNlcnZpY2VfdXJsICsgJy9hcGkvc3VibWl0YXNzZXNzbWVudCcsIGZvcm1EYXRhLCB7IGhlYWRlcnM6IHRoZWhlYWRlcnMgfSkucGlwZShcbiAgICAgICAgLy8gdGhpcyBjYXRjaGVzIGFuIGVycm9yLCByZXR1cm5zIHRoZSBlcnJvci4gXG4gICAgICAgIGNhdGNoRXJyb3IoZXJyID0+IG9mKGVycikpXG4gICAgICApXG4gICAgICAgIDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9AVE9ETyBzdG9yZSBzdWJtaXNzaW9uIGhlcmUgZm9yIGxhdGVyIHRyYW5zbWlzc2lvblxuICAgIH1cbiAgICA7XG4gIH1cblxuICAvLyBzdWJtaXQgZGVsYXllZCBhc3Nlc3NtZW50LiBAVE9ETyB3b3JrIG91dCBzb21lIHdheSBvZiB0ZWxsaW5nIHRoZSB3b3JsZCB0aGVyZSdzIHRoaW5ncyByZWFkeSB0byBnb1xuICBzdWJtaXREZWxheWVkQXNzZXNzbWVudCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybjtcbiAgfVxufVxuIl19