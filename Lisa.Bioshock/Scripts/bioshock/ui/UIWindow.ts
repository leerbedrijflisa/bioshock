class UIWindow {

    /**
     * Creates a new instance of the UIWindow - it is recommended to create a derived class.
     *
     * @param {any} selector - The (jQuery) selector to find the window in the DOM.
     */
    constructor(selector: any) {
        this.$element = $(selector);
        this.isVisible = this.$element.is(":visible");
    }


    /**
    * Opens the window.
    */
    public open(): UIWindow {
        if (!this.isVisible) {
            this.isVisible = true;

            this.reset();
            this.opening.raise();
            this.$element.fadeIn(this.fadeOptions, this.opened.raise);

            if (this.triggerOverlay) {
                this.$overlay.fadeIn(this.fadeOptions);
            }
        }
        return this;
    }

    /**
    * Closes the window.
    */
    public close(): UIWindow {
        if (this.isVisible) {
            this.isVisible = false;

            this.closing.raise();
            this.$element.fadeOut(this.fadeOptions, this.closed.raise);

            if (this.triggerOverlay) {
                this.$overlay.fadeOut(this.fadeOptions);
            }
        }
        return this;
    }

    /**
    * Clears out all the event listeners for this window.
    */
    public clearEventListeners(): UIWindow {
        this.opening.clear();
        this.opened.clear();
        this.closing.clear();
        this.closed.clear();

        return this;
    }

    /**
    * Resets the window (gets called after the window is being closed).
    *
    * Example: Resets the value of a textbox inside the window.
    */
    public reset() {
    }


    // events
    public opening: EventDispatcher = new EventDispatcher(this);
    public opened: EventDispatcher = new EventDispatcher(this);
    public closing: EventDispatcher = new EventDispatcher(this);
    public closed: EventDispatcher = new EventDispatcher(this);

    // properties

    // fields
    public triggerOverlay: boolean = true;
    public $element: JQuery;

    private $overlay = $('#overlay');
    private fadeOptions = {
        queue: false,
        duration: 100
    };
    private isVisible = false;
};