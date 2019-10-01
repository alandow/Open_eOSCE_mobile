"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var modal_dialog_1 = require("nativescript-angular/modal-dialog");
var platform_1 = require("tns-core-modules/platform");
var CommentEntryComponent = /** @class */ (function () {
    function CommentEntryComponent(params) {
        this.params = params;
        this.comment = "";
        console.log('Incoming Comment is:' + this.comment);
    }
    CommentEntryComponent.prototype.close = function (result) {
        console.log('outgoing Comment is:' + result);
        this.params.closeCallback(result);
    };
    CommentEntryComponent.prototype.onload = function (args) {
        console.log('comment onload called');
    };
    CommentEntryComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.comment = this.params.context.comment;
        if (platform_1.isAndroid) {
            var inputInstance = this.comment_entry;
            // inputInstance.nativeElement.android.setSelection(this.comment, this.comment.length);
        }
        else if (platform_1.isIOS) {
        }
    };
    __decorate([
        core_1.ViewChild('#comment_entry', { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], CommentEntryComponent.prototype, "comment_entry", void 0);
    CommentEntryComponent = __decorate([
        core_1.Component({
            selector: 'ns-comment-entry',
            templateUrl: './comment-entry.component.html',
            styleUrls: ['./comment-entry.component.css'],
            moduleId: module.id,
        }),
        __metadata("design:paramtypes", [modal_dialog_1.ModalDialogParams])
    ], CommentEntryComponent);
    return CommentEntryComponent;
}());
exports.CommentEntryComponent = CommentEntryComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudC1lbnRyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tZW50LWVudHJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RTtBQUN6RSxrRUFBc0U7QUFDdEUsc0RBQTZFO0FBWTdFO0lBT0UsK0JBQW9CLE1BQXlCO1FBQXpCLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBSHJDLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFJM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVNLHFDQUFLLEdBQVosVUFBYSxNQUFjO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLHNDQUFNLEdBQWIsVUFBYyxJQUFjO1FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsd0NBQVEsR0FBUjtRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDM0MsSUFBSSxvQkFBUyxFQUFFO1lBQ2IsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUN4Qyx1RkFBdUY7U0FDdkY7YUFBTSxJQUFJLGdCQUFLLEVBQUU7U0FFakI7SUFFSCxDQUFDO0lBNUI2QztRQUE3QyxnQkFBUyxDQUFDLGdCQUFnQixFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO2tDQUFnQixpQkFBVTtnRUFBQztJQUY3RCxxQkFBcUI7UUFUakMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsV0FBVyxFQUFFLGdDQUFnQztZQUM3QyxTQUFTLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztZQUM1QyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7U0FDcEIsQ0FBQzt5Q0FXNEIsZ0NBQWlCO09BUGxDLHFCQUFxQixDQWdDakM7SUFBRCw0QkFBQztDQUFBLEFBaENELElBZ0NDO0FBaENZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1vZGFsRGlhbG9nUGFyYW1zIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvbW9kYWwtZGlhbG9nJztcbmltcG9ydCB7IGlzQW5kcm9pZCwgaXNJT1MsIGRldmljZSwgc2NyZWVuIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvcGxhdGZvcm1cIjtcbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvcGFnZS9wYWdlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnMtY29tbWVudC1lbnRyeScsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb21tZW50LWVudHJ5LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY29tbWVudC1lbnRyeS5jb21wb25lbnQuY3NzJ10sXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG59KVxuXG5cblxuZXhwb3J0IGNsYXNzIENvbW1lbnRFbnRyeUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQFZpZXdDaGlsZCgnI2NvbW1lbnRfZW50cnknLCB7c3RhdGljOiBmYWxzZX0pIGNvbW1lbnRfZW50cnk6IEVsZW1lbnRSZWY7XG5cbiAgcHJpdmF0ZSBjb21tZW50OiBzdHJpbmcgPSBcIlwiO1xuXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJhbXM6IE1vZGFsRGlhbG9nUGFyYW1zKSB7XG4gICAgY29uc29sZS5sb2coJ0luY29taW5nIENvbW1lbnQgaXM6JyArIHRoaXMuY29tbWVudCk7XG4gIH1cblxuICBwdWJsaWMgY2xvc2UocmVzdWx0OiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZygnb3V0Z29pbmcgQ29tbWVudCBpczonICsgcmVzdWx0KTtcbiAgICB0aGlzLnBhcmFtcy5jbG9zZUNhbGxiYWNrKHJlc3VsdCk7XG4gIH1cblxuICBwdWJsaWMgb25sb2FkKGFyZ3M6RXZlbnREYXRhKXtcbiAgICBjb25zb2xlLmxvZygnY29tbWVudCBvbmxvYWQgY2FsbGVkJyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZygnbmdPbkluaXQnKTtcbiAgICB0aGlzLmNvbW1lbnQgPSB0aGlzLnBhcmFtcy5jb250ZXh0LmNvbW1lbnQ7XG4gICAgaWYgKGlzQW5kcm9pZCkge1xuICAgICAgbGV0IGlucHV0SW5zdGFuY2UgPSB0aGlzLmNvbW1lbnRfZW50cnk7XG4gICAgIC8vIGlucHV0SW5zdGFuY2UubmF0aXZlRWxlbWVudC5hbmRyb2lkLnNldFNlbGVjdGlvbih0aGlzLmNvbW1lbnQsIHRoaXMuY29tbWVudC5sZW5ndGgpO1xuICAgIH0gZWxzZSBpZiAoaXNJT1MpIHtcblxuICAgIH1cblxuICB9XG5cbn1cbiJdfQ==