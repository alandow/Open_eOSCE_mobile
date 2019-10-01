"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var config_model_1 = require("~/app/models/config.model");
var nativescript_couchbase_plugin_1 = require("nativescript-couchbase-plugin");
var nativescript_barcodescanner_1 = require("nativescript-barcodescanner");
var network_service_service_1 = require("~/app/services/network-service.service");
var router_1 = require("@angular/router");
var ConfigComponent = /** @class */ (function () {
    function ConfigComponent(barcodeScanner, networkService, route) {
        this.barcodeScanner = barcodeScanner;
        this.networkService = networkService;
        this.route = route;
        this.config = new config_model_1.Config();
        this.errormessage = '';
        this.observableresult = {};
        this.storageDatabase = new nativescript_couchbase_plugin_1.Couchbase('storage');
        if (this.storageDatabase.getDocument("config")) {
            console.log('current config:' + JSON.stringify(this.storageDatabase.getDocument("config")));
            this.config = this.storageDatabase.getDocument("config");
        }
    }
    ConfigComponent.prototype.ngOnInit = function () {
    };
    ConfigComponent.prototype.update = function () {
        if (this.storageDatabase.getDocument("config")) {
            this.storageDatabase.updateDocument("config", this.config);
        }
        else {
            this.storageDatabase.createDocument(this.config, 'config');
        }
    };
    ConfigComponent.prototype.scanBarcode = function () {
        var _this = this;
        console.log('config.component.ts scanBarcode called');
        this.barcodeScanner.requestCameraPermission().then(function () {
            console.log("Camera permission requested");
            _this.barcodeScanner.scan({
                formats: "QR_CODE, EAN_13",
                cancelLabel: "EXIT. Also, try the volume buttons!",
                cancelLabelBackgroundColor: "#333333",
                message: "Use the volume buttons for extra light",
                showFlipCameraButton: true,
                preferFrontCamera: false,
                showTorchButton: true,
                beepOnScan: false,
                torchOn: false,
                closeCallback: function () { console.log("Scanner closed"); },
                resultDisplayDuration: 500,
                // orientation: orientation,     // Android only, default undefined (sensor-driven orientation), other options: portrait|landscape
                openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
            }).then(function (result) {
                // Note that this Promise is never invoked when a 'continuousScanCallback' function is provided
                console.log("Format: " + result.format + ",\nValue: " + result.text);
                try {
                    var resultObj = JSON.parse(result.text);
                    console.log("Result object: " + resultObj);
                    if ((!!resultObj.service_url) && (!!resultObj.name) && (!!resultObj.client_id) && (!!resultObj.client_secret)) {
                        _this.config.name = resultObj.name;
                        _this.config.service_url = resultObj.service_url;
                        _this.config.client_id = resultObj.client_id;
                        _this.config.client_secret = resultObj.client_secret;
                        _this.update();
                    }
                    else {
                        console.log('Not an eosce config code');
                        _this.errormessage = 'Not a valid Open eOSCE config code';
                    }
                }
                catch (e) {
                    console.log(e);
                }
                // this.config = 
                alert({
                    title: "Scan result",
                    message: "Format: " + result.format + ",\nValue: " + result.text,
                    okButtonText: "OK"
                });
            }, function (errorMessage) {
                console.log("No scan. " + errorMessage);
            });
        });
        this.config.name = 'Open eOSCE demo';
        this.config.service_url = 'http://192.168.1.52/eosce_laravel2';
        this.config.client_id = '3';
        this.config.client_secret = 'AhQjIqv7TzuYoTNTFe36tZNPaQLEfHKbzeBLhyEK';
        this.update();
    };
    ConfigComponent.prototype.checkConfig = function () {
        var _this = this;
        this.networkService.checkConfig()
            .subscribe(function (observableresult) {
            //console.log('config.component.ts.checkConfig() subscription result:' + observableresult['access_token']);
            _this.observableresult = observableresult;
            for (var key in observableresult) {
                console.log(key);
            }
            ;
        }),
            function (error) { return console.log(error); },
            function () { return console.log('config.component.ts.checkConfig() subscription complete result:complete'); };
    };
    ConfigComponent = __decorate([
        core_1.Component({
            selector: 'ns-config',
            templateUrl: './config.component.html',
            styleUrls: ['./config.component.css'],
            moduleId: module.id,
        }),
        __metadata("design:paramtypes", [nativescript_barcodescanner_1.BarcodeScanner, network_service_service_1.NetworkServiceService,
            router_1.ActivatedRoute])
    ], ConfigComponent);
    return ConfigComponent;
}());
exports.ConfigComponent = ConfigComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmZpZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsMERBQW1EO0FBQ25ELCtFQUEwRDtBQUMxRCwyRUFBNkQ7QUFDN0Qsa0ZBQStFO0FBQy9FLDBDQUFpRDtBQVVqRDtJQU1FLHlCQUFvQixjQUE4QixFQUFVLGNBQW9DLEVBQ3RGLEtBQXFCO1FBRFgsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQXNCO1FBQ3RGLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBTi9CLFdBQU0sR0FBVSxJQUFJLHFCQUFNLEVBQUUsQ0FBQztRQUU3QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUMxQixxQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFJMUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHlDQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDMUQ7SUFDRixDQUFDO0lBRUosa0NBQVEsR0FBUjtJQUNBLENBQUM7SUFFTSxnQ0FBTSxHQUFiO1FBQ0UsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUM5QyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVE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cnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnfi9hcHAvbW9kZWxzL2NvbmZpZy5tb2RlbCc7XG5pbXBvcnQgeyBDb3VjaGJhc2UgfSBmcm9tICduYXRpdmVzY3JpcHQtY291Y2hiYXNlLXBsdWdpbic7XG5pbXBvcnQgeyBCYXJjb2RlU2Nhbm5lciB9IGZyb20gJ25hdGl2ZXNjcmlwdC1iYXJjb2Rlc2Nhbm5lcic7XG5pbXBvcnQgeyBOZXR3b3JrU2VydmljZVNlcnZpY2UgfSBmcm9tICd+L2FwcC9zZXJ2aWNlcy9uZXR3b3JrLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnMtY29uZmlnJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbmZpZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvbmZpZy5jb21wb25lbnQuY3NzJ10sXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG59KVxuXG5leHBvcnQgY2xhc3MgQ29uZmlnQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY29uZmlnOiBDb25maWcgPW5ldyBDb25maWcoKTtcbiAgc3RvcmFnZURhdGFiYXNlOiBDb3VjaGJhc2U7XG4gIGVycm9ybWVzc2FnZTogc3RyaW5nID0gJyc7XG4gIG9ic2VydmFibGVyZXN1bHQ6IG9iamVjdCA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYmFyY29kZVNjYW5uZXI6IEJhcmNvZGVTY2FubmVyLCBwcml2YXRlIG5ldHdvcmtTZXJ2aWNlOk5ldHdvcmtTZXJ2aWNlU2VydmljZSxcbiAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgICAgdGhpcy5zdG9yYWdlRGF0YWJhc2UgPSBuZXcgQ291Y2hiYXNlKCdzdG9yYWdlJyk7XG4gICAgICBpZiAodGhpcy5zdG9yYWdlRGF0YWJhc2UuZ2V0RG9jdW1lbnQoXCJjb25maWdcIikpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2N1cnJlbnQgY29uZmlnOicrSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlRGF0YWJhc2UuZ2V0RG9jdW1lbnQoXCJjb25maWdcIikpKTtcbiAgICAgICAgdGhpcy5jb25maWcgPSB0aGlzLnN0b3JhZ2VEYXRhYmFzZS5nZXREb2N1bWVudChcImNvbmZpZ1wiKTtcbiAgICAgIH1cbiAgICAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5zdG9yYWdlRGF0YWJhc2UuZ2V0RG9jdW1lbnQoXCJjb25maWdcIikpIHtcbiAgICAgIHRoaXMuc3RvcmFnZURhdGFiYXNlLnVwZGF0ZURvY3VtZW50KFwiY29uZmlnXCIsIHRoaXMuY29uZmlnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9yYWdlRGF0YWJhc2UuY3JlYXRlRG9jdW1lbnQodGhpcy5jb25maWcsICdjb25maWcnKTtcbiAgICB9XG4gIH1cblxuICBzY2FuQmFyY29kZSgpIHtcbiAgICBjb25zb2xlLmxvZygnY29uZmlnLmNvbXBvbmVudC50cyBzY2FuQmFyY29kZSBjYWxsZWQnKTtcbiAgICB0aGlzLmJhcmNvZGVTY2FubmVyLnJlcXVlc3RDYW1lcmFQZXJtaXNzaW9uKCkudGhlbihcbiAgICAgICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDYW1lcmEgcGVybWlzc2lvbiByZXF1ZXN0ZWRcIik7XG4gICAgICAgIHRoaXMuYmFyY29kZVNjYW5uZXIuc2Nhbih7XG4gICAgICAgICAgZm9ybWF0czogXCJRUl9DT0RFLCBFQU5fMTNcIixcbiAgICAgICAgICBjYW5jZWxMYWJlbDogXCJFWElULiBBbHNvLCB0cnkgdGhlIHZvbHVtZSBidXR0b25zIVwiLCAvLyBpT1Mgb25seSwgZGVmYXVsdCAnQ2xvc2UnXG4gICAgICAgICAgY2FuY2VsTGFiZWxCYWNrZ3JvdW5kQ29sb3I6IFwiIzMzMzMzM1wiLCAvLyBpT1Mgb25seSwgZGVmYXVsdCAnIzAwMDAwMCcgKGJsYWNrKVxuICAgICAgICAgIG1lc3NhZ2U6IFwiVXNlIHRoZSB2b2x1bWUgYnV0dG9ucyBmb3IgZXh0cmEgbGlnaHRcIiwgLy8gQW5kcm9pZCBvbmx5LCBkZWZhdWx0IGlzICdQbGFjZSBhIGJhcmNvZGUgaW5zaWRlIHRoZSB2aWV3ZmluZGVyIHJlY3RhbmdsZSB0byBzY2FuIGl0LidcbiAgICAgICAgICBzaG93RmxpcENhbWVyYUJ1dHRvbjogdHJ1ZSwgICAvLyBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAgcHJlZmVyRnJvbnRDYW1lcmE6IGZhbHNlLCAgICAgLy8gZGVmYXVsdCBmYWxzZVxuICAgICAgICAgIHNob3dUb3JjaEJ1dHRvbjogdHJ1ZSwgICAgICAgIC8vIGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICBiZWVwT25TY2FuOiBmYWxzZSwgICAgICAgICAgICAgLy8gUGxheSBvciBTdXBwcmVzcyBiZWVwIG9uIHNjYW4gKGRlZmF1bHQgdHJ1ZSlcbiAgICAgICAgICB0b3JjaE9uOiBmYWxzZSwgICAgICAgICAgICAgICAvLyBsYXVuY2ggd2l0aCB0aGUgZmxhc2hsaWdodCBvbiAoZGVmYXVsdCBmYWxzZSlcbiAgICAgICAgICBjbG9zZUNhbGxiYWNrOiAoKSA9PiB7IGNvbnNvbGUubG9nKFwiU2Nhbm5lciBjbG9zZWRcIikgfSwgLy8gaW52b2tlZCB3aGVuIHRoZSBzY2FubmVyIHdhcyBjbG9zZWQgKHN1Y2Nlc3Mgb3IgYWJvcnQpXG4gICAgICAgICAgcmVzdWx0RGlzcGxheUR1cmF0aW9uOiA1MDAsICAgLy8gQW5kcm9pZCBvbmx5LCBkZWZhdWx0IDE1MDAgKG1zKSwgc2V0IHRvIDAgdG8gZGlzYWJsZSBlY2hvaW5nIHRoZSBzY2FubmVkIHRleHRcbiAgICAgICAgICAvLyBvcmllbnRhdGlvbjogb3JpZW50YXRpb24sICAgICAvLyBBbmRyb2lkIG9ubHksIGRlZmF1bHQgdW5kZWZpbmVkIChzZW5zb3ItZHJpdmVuIG9yaWVudGF0aW9uKSwgb3RoZXIgb3B0aW9uczogcG9ydHJhaXR8bGFuZHNjYXBlXG4gICAgICAgICAgb3BlblNldHRpbmdzSWZQZXJtaXNzaW9uV2FzUHJldmlvdXNseURlbmllZDogdHJ1ZSAvLyBPbiBpT1MgeW91IGNhbiBzZW5kIHRoZSB1c2VyIHRvIHRoZSBzZXR0aW5ncyBhcHAgaWYgYWNjZXNzIHdhcyBwcmV2aW91c2x5IGRlbmllZFxuICAgICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAvLyBOb3RlIHRoYXQgdGhpcyBQcm9taXNlIGlzIG5ldmVyIGludm9rZWQgd2hlbiBhICdjb250aW51b3VzU2NhbkNhbGxiYWNrJyBmdW5jdGlvbiBpcyBwcm92aWRlZFxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRm9ybWF0OiBcIiArIHJlc3VsdC5mb3JtYXQgKyBcIixcXG5WYWx1ZTogXCIgKyByZXN1bHQudGV4dCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCByZXN1bHRPYmogPSBKU09OLnBhcnNlKHJlc3VsdC50ZXh0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzdWx0IG9iamVjdDogXCIgKyByZXN1bHRPYmopO1xuICAgICAgICAgICAgaWYgKCghIXJlc3VsdE9iai5zZXJ2aWNlX3VybCkgJiYgKCEhcmVzdWx0T2JqLm5hbWUpICYmICghIXJlc3VsdE9iai5jbGllbnRfaWQpICYmICghIXJlc3VsdE9iai5jbGllbnRfc2VjcmV0KSkge1xuICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5uYW1lID0gcmVzdWx0T2JqLm5hbWU7XG4gICAgICAgICAgICAgIHRoaXMuY29uZmlnLnNlcnZpY2VfdXJsID0gcmVzdWx0T2JqLnNlcnZpY2VfdXJsO1xuICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5jbGllbnRfaWQgPSByZXN1bHRPYmouY2xpZW50X2lkO1xuICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5jbGllbnRfc2VjcmV0ID0gcmVzdWx0T2JqLmNsaWVudF9zZWNyZXQ7XG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTm90IGFuIGVvc2NlIGNvbmZpZyBjb2RlJyk7XG4gICAgICAgICAgICAgIHRoaXMuZXJyb3JtZXNzYWdlID0gJ05vdCBhIHZhbGlkIE9wZW4gZU9TQ0UgY29uZmlnIGNvZGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyB0aGlzLmNvbmZpZyA9IFxuICAgICAgICAgIGFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcIlNjYW4gcmVzdWx0XCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBcIkZvcm1hdDogXCIgKyByZXN1bHQuZm9ybWF0ICsgXCIsXFxuVmFsdWU6IFwiICsgcmVzdWx0LnRleHQsXG4gICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9LCAoZXJyb3JNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJObyBzY2FuLiBcIiArIGVycm9yTWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7IFxuICAgIHRoaXMuY29uZmlnLm5hbWUgPSAnT3BlbiBlT1NDRSBkZW1vJztcbiAgICB0aGlzLmNvbmZpZy5zZXJ2aWNlX3VybCA9ICdodHRwOi8vMTkyLjE2OC4xLjUyL2Vvc2NlX2xhcmF2ZWwyJztcbiAgICB0aGlzLmNvbmZpZy5jbGllbnRfaWQgPSAnMyc7XG4gICAgdGhpcy5jb25maWcuY2xpZW50X3NlY3JldCA9ICdBaFFqSXF2N1R6dVlvVE5URmUzNnRaTlBhUUxFZkhLYnplQkxoeUVLJztcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgY2hlY2tDb25maWcoKSB7XG4gICAgdGhpcy5uZXR3b3JrU2VydmljZS5jaGVja0NvbmZpZygpXG4gICAgICAgLnN1YnNjcmliZShvYnNlcnZhYmxlcmVzdWx0ID0+IHtcbiAgICAgICAgIC8vY29uc29sZS5sb2coJ2NvbmZpZy5jb21wb25lbnQudHMuY2hlY2tDb25maWcoKSBzdWJzY3JpcHRpb24gcmVzdWx0OicgKyBvYnNlcnZhYmxlcmVzdWx0WydhY2Nlc3NfdG9rZW4nXSk7XG4gICAgICAgICB0aGlzLm9ic2VydmFibGVyZXN1bHQgPSBvYnNlcnZhYmxlcmVzdWx0O1xuICAgICAgICAgZm9yIChsZXQga2V5IGluIG9ic2VydmFibGVyZXN1bHQpIHtcbiAgICAgICAgICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgICAgIH07XG4gICAgICAgfSksXG4gICAgICAgZXJyb3IgPT4gY29uc29sZS5sb2coZXJyb3IpLFxuICAgICAgICgpID0+IGNvbnNvbGUubG9nKCdjb25maWcuY29tcG9uZW50LnRzLmNoZWNrQ29uZmlnKCkgc3Vic2NyaXB0aW9uIGNvbXBsZXRlIHJlc3VsdDpjb21wbGV0ZScpO1xuICB9XG5cblxufVxuIl19