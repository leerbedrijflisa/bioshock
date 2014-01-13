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
            this._openEvents.push(onOpen);
        } else {
            this.$element.fadeIn(this._fadeOptions);

            if (this.triggerOverlay) {
                this._$overlay.fadeIn(this._fadeOptions);
            }

            for (var i = 0; i < this._openEvents.length; i++) {
                this._openEvents[i]();
            }
        }
        return this;
    }

    public close(onClose?: Function) {
        if (onClose) {
            this._closeEvents.push(onClose);
        } else {
            this.$element.fadeOut(this._fadeOptions);

            if (this.triggerOverlay) {
                this._$overlay.fadeOut(this._fadeOptions);
            }

            for (var i = 0; i < this._closeEvents.length; i++) {
                this._closeEvents[i]();
            }
        }
        return this;
    }


    // properties

    // fields
    public triggerOverlay: boolean = true;
    public $element: JQuery;

    private _openEvents = [];
    private _closeEvents = [];
    private _$overlay = $('#overlay');
    private _fadeOptions = {
        queue: false,
        duration: 100
    };
};