var Synchronizer = (function () {
    /**
    * Creates a new Synchronizer.
    *
    * @param {string} preview - The selector of the element that should be updated when a message arrives.
    */
    function Synchronizer(preview) {
        var _this = this;
        this.onRead = function (message) {
            var title = message.match(/<title>(.+)<\//im);
            if (title) {
                document.title = title[1];
            }

            $(_this.previewId).contents().find('html').html(message);
        };
        this.hub = $.connection.synchronizeHub;
        this.previewId = preview;
        this.hub.client.addMessage = this.onRead;
    }
    /**
    * Start a connection with the hub
    *
    * @param {function} done (optional) - The callback function to be called when the start of the connection finishes. This parameter can be undefined.
    */
    Synchronizer.prototype.start = function (done) {
        if (done) {
            $.connection.hub.start().done(done);
        } else {
            $.connection.hub.start();
        }
    };

    /**
    * Sends an update with the given message
    *
    * @param {*} message - The message to send as an update
    */
    Synchronizer.prototype.update = function (message) {
        this.hub.server.send(message);
    };

    /**
    * Sets the preview
    *
    * @param {string} selector - The selector of the element that should be updated when a message arrives.
    */
    Synchronizer.prototype.setPreview = function (selector) {
        this.previewId = selector;
    };
    return Synchronizer;
})();
//# sourceMappingURL=Synchronizer.js.map
