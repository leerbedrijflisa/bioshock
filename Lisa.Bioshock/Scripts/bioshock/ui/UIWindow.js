/// <reference path="../../typings/jquery/jquery.d.ts" />
var UIWindow = (function () {
    function UIWindow(selector) {
        // properties
        // fields
        this.triggerOverlay = true;
        this._openEvents = [];
        this._closeEvents = [];
        this._exitEvents = [];
        this._$overlay = $('#overlay');
        this._fadeOptions = {
            queue: false,
            duration: 100
        };
        this.$element = $(selector);
        this.initialize();
    }
    UIWindow.prototype.initialize = function () {
        return this;
    };

    UIWindow.prototype.open = function (onOpen) {
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
    };

    UIWindow.prototype.close = function (onClose) {
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
    };

    UIWindow.prototype.exit = function (onExit) {
        if (onExit) {
            this._exitEvents.push(onExit);
        } else {
            for (var i = 0; i < this._exitEvents.length; i++) {
                this._exitEvents[i]();
            }
        }

        return this;
    };
    return UIWindow;
})();
;
//# sourceMappingURL=UIWindow.js.map
