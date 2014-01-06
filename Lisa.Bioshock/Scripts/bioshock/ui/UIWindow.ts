/// <reference path="../../typings/jquery/jquery.d.ts" />
class UIWindow {

    constructor(selector: any) {        
        this.$element = $(selector);
        this.initialize();
    }

    public initialize() {        
        return this;
    }

    public open(onOpen?: Function) {
        if (onOpen) {
            this.openEvents.push(onOpen);
        } else {
            this.$element.fadeIn(250);

            if (this.triggerOverlay) {
                this.$overlay.fadeIn(250);
            }

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

            if (this.triggerOverlay) {
                this.$overlay.fadeOut(250);
            }

            for (var i = 0; i < this.closeEvents.length; i++) {
                this.closeEvents[i]();
            }
        }
        return this;
    }

    public triggerOverlay: boolean = true;
    public $element: JQuery;

    private openEvents = [];
    private closeEvents = [];
    private $overlay = $('#overlay');
};