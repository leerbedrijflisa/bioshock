var UIWindow = (function () {
    /**
    * Creates a new instance of the UIWindow - it is recommended to create a derived class.
    *
    * @param {any} selector - The (jQuery) selector to find the window in the DOM.
    */
    function UIWindow(selector) {
        // properties
        // fields
        this.triggerOverlay = true;
        this._openEvents = [];
        this._closeEvents = [];
        this._$overlay = $('#overlay');
        this._fadeOptions = {
            queue: false,
            duration: 100
        };
        this._isVisible = false;
        this.$element = $(selector);
        this.initialize();
    }
    /**
    * Initializes the window.
    */
    UIWindow.prototype.initialize = function () {
        this._isVisible = this.$element.is(":visible");
        return this;
    };

    /**
    * Opens the window or, when onOpen is given, adds an event handler.
    *
    * @param {Function} onOpen? - When given, adds an event handler that will be called after the window opens.
    */
    UIWindow.prototype.open = function (onOpen) {
        if (onOpen) {
            this._openEvents.push(onOpen);
        } else {
            if (!this._isVisible) {
                this.$element.fadeIn(this._fadeOptions);
                this._isVisible = true;

                if (this.triggerOverlay) {
                    this._$overlay.fadeIn(this._fadeOptions);
                }

                for (var i = 0; i < this._openEvents.length; i++) {
                    this._openEvents[i]();
                }
            }
        }
        return this;
    };

    /**
    * Opens the window or, when onClose is given, adds an event handler.
    *
    * @param {Function} onClose? - When given, adds an event handler that will be called after the window close.
    */
    UIWindow.prototype.close = function (onClose) {
        if (onClose) {
            this._closeEvents.push(onClose);
        } else {
            if (this._isVisible) {
                this.$element.fadeOut(this._fadeOptions);
                this._isVisible = false;

                if (this.triggerOverlay) {
                    this._$overlay.fadeOut(this._fadeOptions);
                }

                for (var i = 0; i < this._closeEvents.length; i++) {
                    this._closeEvents[i]();
                }
            }
        }
        return this;
    };
    return UIWindow;
})();
;
//# sourceMappingURL=UIWindow.js.map
