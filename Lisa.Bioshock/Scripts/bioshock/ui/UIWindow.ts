class UIWindow {

    /**
     * Creates a new instance of the UIWindow - it is recommended to create a derived class.
     *
     * @param {any} selector - The (jQuery) selector to find the window in the DOM.
     */
    constructor(selector: any) {        
        this.$element = $(selector);
        this.initialize();
    }

    /**
    * Initializes the window.
    */
    public initialize() {
        this._isVisible = this.$element.is(":visible");
        return this;
    }

    /**
    * Opens the window or, when onOpen is given, adds an event handler.
    *
    * @param {Function} onOpen? - When given, adds an event handler that will be called after the window opens.
    */
    public open(onOpen?: Function) {
        if (onOpen) {
            this._openEvents.push(onOpen);
        } else {

            if (!this._isVisible) {
                this.$element.fadeIn(this._fadeOptions);
                this._isVisible = true;

                if (this.triggerOverlay) {
                    this.$overlay.fadeIn(this._fadeOptions);
                }

                for (var i = 0; i < this._openEvents.length; i++) {
                    this._openEvents[i]();
                }
            }
        }
        return this;
    }

    /**
    * Opens the window or, when onClose is given, adds an event handler.
    *
    * @param {Function} onClose? - When given, adds an event handler that will be called after the window close.
    */
    public close(onClose?: Function) {
        if (onClose) {
            this._closeEvents.push(onClose);
        } else {

            if (this._isVisible) {
                this.$element.fadeOut(this._fadeOptions);
                this._isVisible = false;

                if (this.triggerOverlay) {
                    this.$overlay.fadeOut(this._fadeOptions);
                }

                for (var i = 0; i < this._closeEvents.length; i++) {
                    this._closeEvents[i]();
                }
            }
        }
        return this;
    }

    // properties

    // fields
    public triggerOverlay: boolean = true;
    public $element: JQuery;

    private $overlay = $('#overlay');
    private _openEvents = [];
    private _closeEvents = [];
    private _fadeOptions = {
        queue: false,
        duration: 100
    };
    private _isVisible = false;
};