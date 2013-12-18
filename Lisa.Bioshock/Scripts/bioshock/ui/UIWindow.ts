/// <reference path="../../typings/jquery/jquery.d.ts" />
class UIWindow {

    constructor(selector: any) {        
        this.$element = $(selector);
        this.initialize();
    }  

    public initialize() {        
    } 

    public open(onOpen?: Function) {
        if (onOpen) {
            this.openEvents.push(onOpen);
        } else {
            this.$element.fadeIn(250);
            this.$overlay.fadeIn(250);

            for (var i = 0; i < this.openEvents.length; i++) {
                this.openEvents[i]();
            }
        }
        return this;
    }

    public close(onClose?: Function) {
        if (onClose) {
            this.closeEvents.push(onClose);
        } else {
            this.$element.fadeOut(250);
            this.$overlay.fadeOut(250);

            for (var i = 0; i < this.closeEvents.length; i++) {
                this.closeEvents[i]();
            }
        }
        return this;
    }

    private openEvents = [];
    private closeEvents = [];
    private $overlay = $('#overlay');
    public $element: JQuery;
};