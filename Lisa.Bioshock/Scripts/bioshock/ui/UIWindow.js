/// <reference path="../../typings/jquery/jquery.d.ts" />
var UIWindow = (function () {
    function UIWindow(selector) {
        this.openEvents = [];
        this.closeEvents = [];
        this.$overlay = $('#overlay');
        this.$element = $(selector);
        this.initialize();
    }
    UIWindow.prototype.initialize = function () {
        return this;
    };

    UIWindow.prototype.open = function (onOpen) {
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
    };

    UIWindow.prototype.close = function (onClose) {
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
    };
    return UIWindow;
})();
;
//# sourceMappingURL=UIWindow.js.map
