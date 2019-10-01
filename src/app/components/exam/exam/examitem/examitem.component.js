"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var assessmentitem_model_1 = require("~/app/models/assessmentitem.model");
var radio_option_1 = require("./radio-option");
var animations_1 = require("@angular/animations");
var ExamitemComponent = /** @class */ (function () {
    function ExamitemComponent() {
        this.show = true;
        this.assessmentitem = new assessmentitem_model_1.AssessmentItem();
        // is this a heading?
        this.isheading = false;
        // formative?
        this.formative = false;
        //hide comments?
        this.hidecomments = false;
        // Internal values 
        this.selectedvalue = '';
        this.comment = '';
        // does this 
        this.needscomment = false;
        this.enabled = false;
        this.itemChange = new core_1.EventEmitter();
        // tell the world something's changed, trigger validation
        this.changeEvent = new core_1.EventEmitter();
        this.commentEvent = new core_1.EventEmitter();
        this.radioOptions = [];
    }
    Object.defineProperty(ExamitemComponent.prototype, "item", {
        get: function () {
            return this.assessmentitem;
        },
        set: function (value) {
            this.assessmentitem = value;
        },
        enumerable: true,
        configurable: true
    });
    ExamitemComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('ExamitemComponent.ngOnInit called');
        this.hidecomments = (this.assessmentitem.no_comment == '1');
        this.assessmentitem.items.forEach(function (item) {
            _this.radioOptions.push(new radio_option_1.RadioOption(item.id, item.label, item.value, item.needscomment == 'true'));
        });
        console.log('show?' + this.assessmentitem.show_if_id);
        if ((this.assessmentitem.show_if_id === null) || (this.assessmentitem.show_if_id < 0)) {
            this.assessmentitem.visible = true;
        }
        else {
            this.assessmentitem.visible = false;
        }
        this.assessmentitem.valid = false;
    };
    // handle a radio button change
    ExamitemComponent.prototype.changeCheckedRadio = function (radioOption) {
        var _this = this;
        // uncheck all other options
        console.log('Radio change: ');
        this.radioOptions.forEach(function (option) {
            if (option.value !== radioOption.value) {
                option.selected = false;
            }
            else {
                option.selected = true;
                // internal value
                _this.selectedvalue = option.value;
                // external (bindable) value
                _this.assessmentitem.selectedvalue = option.value;
                //console.log('selectedvalue is now: ' + this.selectedvalue)
                //this.selectedid = option.id;
                _this.assessmentitem.selected_id = option.id;
                //    console.log('selectedid is now: ' + this.assessmentitem.selected_id);
                //   console.log('needs comment: ' + option.needscomment);
                if (option.needscomment) {
                    //     console.log('Needs a comment');
                    _this.needscomment = true;
                }
                else {
                    _this.needscomment = false;
                }
            }
        });
        this.assessmentitem.valid = this.validate();
        this.changeEvent.emit({ id: this.assessmentitem.id, selectedvalue: this.assessmentitem.selectedvalue, selectedid: this.assessmentitem.selected_id, comment: this.assessmentitem.comment });
    };
    // notify that a comment box has been clicked
    ExamitemComponent.prototype.notifyCommentClick = function () {
        // console.log('Comment tapped: id:' + this.assessmentitem.id);
        this.commentEvent.emit({ id: this.assessmentitem.id, comment: this.assessmentitem.comment });
    };
    // handle the change of comment
    ExamitemComponent.prototype.ontextChange = function () {
        var _this = this;
        // little delay. It crashis if this isn't here
        setTimeout(function () {
            _this.assessmentitem.valid = _this.validate();
        }, 1000);
        console.log('ExamitemComponent.Text changed to:' + this.comment);
        //
        this.changeEvent.emit({ id: this.assessmentitem.id, selectedvalue: this.assessmentitem.selectedvalue, selectedid: this.assessmentitem.selected_id, comment: this.assessmentitem.comment });
    };
    // need to fix this- it's clunky as hell.
    ExamitemComponent.prototype.validate = function () {
        console.log('validate called');
        console.log('assessmentitem.selectedid = ' + this.assessmentitem.selected_id);
        console.log('needscomment = ' + this.needscomment);
        console.log('assessmentitem.assessmentitem.comment = ' + this.assessmentitem.comment);
        if (this.assessmentitem.selected_id) {
            if (this.needscomment) {
                if (this.assessmentitem.comment && this.assessmentitem.comment.length > 0) {
                    console.log('validate returning TRUE');
                    return true;
                }
                else {
                    console.log('validate returning FALSE');
                    return false;
                }
            }
            else {
                return true;
            }
        }
        else {
            console.log('validate returning FALSE');
            return false;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ExamitemComponent.prototype, "item", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ExamitemComponent.prototype, "enabled", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ExamitemComponent.prototype, "itemChange", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ExamitemComponent.prototype, "changeEvent", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ExamitemComponent.prototype, "commentEvent", void 0);
    ExamitemComponent = __decorate([
        core_1.Component({
            selector: 'ns-examitem',
            templateUrl: './examitem.component.html',
            styleUrls: ['./examitem.component.css'],
            moduleId: module.id,
            animations: [
                animations_1.trigger('animationOption2', [
                    animations_1.transition(':enter', [
                        animations_1.style({ backgroundColor: 'yellow' }),
                        animations_1.animate(300)
                    ]),
                    animations_1.transition(':leave', [
                        animations_1.animate(300, animations_1.style({ backgroundColor: 'yellow' }))
                    ]),
                    animations_1.state('*', animations_1.style({ backgroundColor: 'green' })),
                ])
            ]
        }),
        __metadata("design:paramtypes", [])
    ], ExamitemComponent);
    return ExamitemComponent;
}());
exports.ExamitemComponent = ExamitemComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbWl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQStFO0FBQy9FLDBFQUFtRTtBQUVuRSwrQ0FBNkM7QUFDN0Msa0RBQWlGO0FBcUJqRjtJQTZDRTtRQXpDQSxTQUFJLEdBQVksSUFBSSxDQUFDO1FBRXJCLG1CQUFjLEdBQW1CLElBQUkscUNBQWMsRUFBRSxDQUFDO1FBR3RELHFCQUFxQjtRQUNyQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBRTNCLGFBQWE7UUFDYixjQUFTLEdBQVksS0FBSyxDQUFDO1FBRTNCLGdCQUFnQjtRQUNoQixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUU5QixtQkFBbUI7UUFDbkIsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFFM0IsWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUVyQixhQUFhO1FBQ2IsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFRckIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV4QixlQUFVLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFLMUMseURBQXlEO1FBQy9DLGdCQUFXLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFFakMsaUJBQVksR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUU1QyxpQkFBWSxHQUF3QixFQUFFLENBQUM7SUFDdkIsQ0FBQztJQWpCakIsc0JBQUksbUNBQUk7YUFBUjtZQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUM3QixDQUFDO2FBS0QsVUFBUyxLQUFLO1lBQ1osSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDOUIsQ0FBQzs7O09BUEE7SUFpQkQsb0NBQVEsR0FBUjtRQUFBLGlCQWFDO1FBWkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLENB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QUNGLENBQUM7O09BQ1csaUJBQWlCLENBeUk3QjtJQUFELHdCQUFDO0NBQUEsQUF6SUQsSUF5SUM7QUF6SVksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXNzZXNzbWVudEl0ZW0gfSBmcm9tICd+L2FwcC9tb2RlbHMvYXNzZXNzbWVudGl0ZW0ubW9kZWwnO1xuaW1wb3J0IHsgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgUmFkaW9PcHRpb24gfSBmcm9tICcuL3JhZGlvLW9wdGlvbic7XG5pbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnMtZXhhbWl0ZW0nLFxuICB0ZW1wbGF0ZVVybDogJy4vZXhhbWl0ZW0uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9leGFtaXRlbS5jb21wb25lbnQuY3NzJ10sXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBcbiAgICB0cmlnZ2VyKCdhbmltYXRpb25PcHRpb24yJywgWyAgICAgIFxuICAgICAgdHJhbnNpdGlvbignOmVudGVyJywgW1xuICAgICAgICBzdHlsZSh7IGJhY2tncm91bmRDb2xvcjogJ3llbGxvdycgfSksXG4gICAgICAgIGFuaW1hdGUoMzAwKVxuICAgICAgXSksXG4gICAgICB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbXG4gICAgICAgIGFuaW1hdGUoMzAwLCBzdHlsZSh7IGJhY2tncm91bmRDb2xvcjogJ3llbGxvdycgfSkpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCcqJywgc3R5bGUoeyBiYWNrZ3JvdW5kQ29sb3I6ICdncmVlbicgfSkpLFxuICAgIF0pXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRXhhbWl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcbiAgY2hlY2tUZXN0OiBib29sZWFuO1xuXG4gIHNob3c6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGFzc2Vzc21lbnRpdGVtOiBBc3Nlc3NtZW50SXRlbSA9IG5ldyBBc3Nlc3NtZW50SXRlbSgpO1xuXG5cbiAgLy8gaXMgdGhpcyBhIGhlYWRpbmc/XG4gIGlzaGVhZGluZzogQm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIGZvcm1hdGl2ZT9cbiAgZm9ybWF0aXZlOiBCb29sZWFuID0gZmFsc2U7XG5cbiAgLy9oaWRlIGNvbW1lbnRzP1xuICBoaWRlY29tbWVudHM6IEJvb2xlYW4gPSBmYWxzZTtcblxuICAvLyBJbnRlcm5hbCB2YWx1ZXMgXG4gIHNlbGVjdGVkdmFsdWU6IHN0cmluZyA9ICcnO1xuICBzZWxlY3RlZGlkOiBudW1iZXI7XG4gIGNvbW1lbnQ6IHN0cmluZyA9ICcnO1xuXG4gIC8vIGRvZXMgdGhpcyBcbiAgbmVlZHNjb21tZW50OiBib29sZWFuID0gZmFsc2U7XG5cblxuICBASW5wdXQoKVxuICBnZXQgaXRlbSgpIHtcbiAgICByZXR1cm4gdGhpcy5hc3Nlc3NtZW50aXRlbTtcbiAgfVxuXG4gIEBJbnB1dCgpIGVuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgaXRlbUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgc2V0IGl0ZW0odmFsdWUpIHtcbiAgICB0aGlzLmFzc2Vzc21lbnRpdGVtID0gdmFsdWU7XG4gIH1cblxuICAvLyB0ZWxsIHRoZSB3b3JsZCBzb21ldGhpbmcncyBjaGFuZ2VkLCB0cmlnZ2VyIHZhbGlkYXRpb25cbiAgQE91dHB1dCgpIGNoYW5nZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBPdXRwdXQoKSBjb21tZW50RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcmFkaW9PcHRpb25zPzogQXJyYXk8UmFkaW9PcHRpb24+ID0gW107XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc29sZS5sb2coJ0V4YW1pdGVtQ29tcG9uZW50Lm5nT25Jbml0IGNhbGxlZCcpO1xuICAgIHRoaXMuaGlkZWNvbW1lbnRzID0gKHRoaXMuYXNzZXNzbWVudGl0ZW0ubm9fY29tbWVudCA9PSAnMScpO1xuICAgIHRoaXMuYXNzZXNzbWVudGl0ZW0uaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIHRoaXMucmFkaW9PcHRpb25zLnB1c2gobmV3IFJhZGlvT3B0aW9uKGl0ZW0uaWQsIGl0ZW0ubGFiZWwsIGl0ZW0udmFsdWUsIGl0ZW0ubmVlZHNjb21tZW50ID09ICd0cnVlJykpO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKCdzaG93PycgKyB0aGlzLmFzc2Vzc21lbnRpdGVtLnNob3dfaWZfaWQpO1xuICAgIGlmICgodGhpcy5hc3Nlc3NtZW50aXRlbS5zaG93X2lmX2lkID09PSBudWxsKSB8fCAodGhpcy5hc3Nlc3NtZW50aXRlbS5zaG93X2lmX2lkIDwgMCkpIHtcbiAgICAgIHRoaXMuYXNzZXNzbWVudGl0ZW0udmlzaWJsZSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXNzZXNzbWVudGl0ZW0udmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmFzc2Vzc21lbnRpdGVtLnZhbGlkID0gZmFsc2U7XG4gIH1cblxuICAvLyBoYW5kbGUgYSByYWRpbyBidXR0b24gY2hhbmdlXG4gIGNoYW5nZUNoZWNrZWRSYWRpbyhyYWRpb09wdGlvbjogUmFkaW9PcHRpb24pOiB2b2lkIHtcbiAgICAvLyB1bmNoZWNrIGFsbCBvdGhlciBvcHRpb25zXG4gICAgY29uc29sZS5sb2coJ1JhZGlvIGNoYW5nZTogJylcbiAgICB0aGlzLnJhZGlvT3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAob3B0aW9uLnZhbHVlICE9PSByYWRpb09wdGlvbi52YWx1ZSkge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIC8vIGludGVybmFsIHZhbHVlXG4gICAgICAgIHRoaXMuc2VsZWN0ZWR2YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgICAgICAgLy8gZXh0ZXJuYWwgKGJpbmRhYmxlKSB2YWx1ZVxuICAgICAgICB0aGlzLmFzc2Vzc21lbnRpdGVtLnNlbGVjdGVkdmFsdWUgPSBvcHRpb24udmFsdWU7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3NlbGVjdGVkdmFsdWUgaXMgbm93OiAnICsgdGhpcy5zZWxlY3RlZHZhbHVlKVxuICAgICAgICAvL3RoaXMuc2VsZWN0ZWRpZCA9IG9wdGlvbi5pZDtcbiAgICAgICAgdGhpcy5hc3Nlc3NtZW50aXRlbS5zZWxlY3RlZF9pZCA9IG9wdGlvbi5pZDtcbiAgICAgICAgLy8gICAgY29uc29sZS5sb2coJ3NlbGVjdGVkaWQgaXMgbm93OiAnICsgdGhpcy5hc3Nlc3NtZW50aXRlbS5zZWxlY3RlZF9pZCk7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ25lZWRzIGNvbW1lbnQ6ICcgKyBvcHRpb24ubmVlZHNjb21tZW50KTtcbiAgICAgICAgaWYgKG9wdGlvbi5uZWVkc2NvbW1lbnQpIHtcbiAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ05lZWRzIGEgY29tbWVudCcpO1xuICAgICAgICAgIHRoaXMubmVlZHNjb21tZW50ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5lZWRzY29tbWVudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5hc3Nlc3NtZW50aXRlbS52YWxpZCA9IHRoaXMudmFsaWRhdGUoKTtcbiAgICB0aGlzLmNoYW5nZUV2ZW50LmVtaXQoeyBpZDogdGhpcy5hc3Nlc3NtZW50aXRlbS5pZCwgc2VsZWN0ZWR2YWx1ZTogdGhpcy5hc3Nlc3NtZW50aXRlbS5zZWxlY3RlZHZhbHVlLCBzZWxlY3RlZGlkOiB0aGlzLmFzc2Vzc21lbnRpdGVtLnNlbGVjdGVkX2lkLCBjb21tZW50OiB0aGlzLmFzc2Vzc21lbnRpdGVtLmNvbW1lbnQgfSk7XG5cbiAgfVxuXG4gIC8vIG5vdGlmeSB0aGF0IGEgY29tbWVudCBib3ggaGFzIGJlZW4gY2xpY2tlZFxuICBub3RpZnlDb21tZW50Q2xpY2soKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ0NvbW1lbnQgdGFwcGVkOiBpZDonICsgdGhpcy5hc3Nlc3NtZW50aXRlbS5pZCk7XG4gICAgdGhpcy5jb21tZW50RXZlbnQuZW1pdCh7IGlkOiB0aGlzLmFzc2Vzc21lbnRpdGVtLmlkLCBjb21tZW50OiB0aGlzLmFzc2Vzc21lbnRpdGVtLmNvbW1lbnQgfSk7XG4gIH1cblxuICAvLyBoYW5kbGUgdGhlIGNoYW5nZSBvZiBjb21tZW50XG4gIG9udGV4dENoYW5nZSgpIHtcbiAgICAvLyBsaXR0bGUgZGVsYXkuIEl0IGNyYXNoaXMgaWYgdGhpcyBpc24ndCBoZXJlXG4gICAgc2V0VGltZW91dCgoKSA9PiBcbntcbiAgdGhpcy5hc3Nlc3NtZW50aXRlbS52YWxpZCA9IHRoaXMudmFsaWRhdGUoKTtcbn0sXG4xMDAwKTtcbiAgICBjb25zb2xlLmxvZygnRXhhbWl0ZW1Db21wb25lbnQuVGV4dCBjaGFuZ2VkIHRvOicgKyB0aGlzLmNvbW1lbnQpXG4gICAgLy9cbiAgICB0aGlzLmNoYW5nZUV2ZW50LmVtaXQoeyBpZDogdGhpcy5hc3Nlc3NtZW50aXRlbS5pZCwgc2VsZWN0ZWR2YWx1ZTogdGhpcy5hc3Nlc3NtZW50aXRlbS5zZWxlY3RlZHZhbHVlLCBzZWxlY3RlZGlkOiB0aGlzLmFzc2Vzc21lbnRpdGVtLnNlbGVjdGVkX2lkLCBjb21tZW50OiB0aGlzLmFzc2Vzc21lbnRpdGVtLmNvbW1lbnQgfSk7XG4gIH1cblxuICAvLyBuZWVkIHRvIGZpeCB0aGlzLSBpdCdzIGNsdW5reSBhcyBoZWxsLlxuICB2YWxpZGF0ZSgpIHtcbiAgICBjb25zb2xlLmxvZygndmFsaWRhdGUgY2FsbGVkJyk7XG4gICAgY29uc29sZS5sb2coJ2Fzc2Vzc21lbnRpdGVtLnNlbGVjdGVkaWQgPSAnICsgdGhpcy5hc3Nlc3NtZW50aXRlbS5zZWxlY3RlZF9pZCk7XG4gICAgY29uc29sZS5sb2coJ25lZWRzY29tbWVudCA9ICcgKyB0aGlzLm5lZWRzY29tbWVudCk7XG4gICAgY29uc29sZS5sb2coJ2Fzc2Vzc21lbnRpdGVtLmFzc2Vzc21lbnRpdGVtLmNvbW1lbnQgPSAnICsgdGhpcy5hc3Nlc3NtZW50aXRlbS5jb21tZW50KTtcbiAgICBpZiAodGhpcy5hc3Nlc3NtZW50aXRlbS5zZWxlY3RlZF9pZCkge1xuICAgICAgaWYgKHRoaXMubmVlZHNjb21tZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmFzc2Vzc21lbnRpdGVtLmNvbW1lbnQgJiYgdGhpcy5hc3Nlc3NtZW50aXRlbS5jb21tZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygndmFsaWRhdGUgcmV0dXJuaW5nIFRSVUUnKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygndmFsaWRhdGUgcmV0dXJuaW5nIEZBTFNFJyk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9ZWxzZXtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd2YWxpZGF0ZSByZXR1cm5pbmcgRkFMU0UnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuXG59XG4iXX0=