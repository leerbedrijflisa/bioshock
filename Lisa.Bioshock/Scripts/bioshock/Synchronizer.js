/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />

var Synchronizer = (function () {
    /**
    * Creates a new Synchronizer.
    *
    * @param {string} preview - The selector of the element that should be updated when a message arrives.
    */
    function Synchronizer(preview) {
        var _this = this;
        this.onRead = function (message) {
            //var title = message.match(/<title>(.+)<\//im);
            if (message.content != null) {
                var title = message.content.match(/<title>(.+?)(<\/|$)/);
                if (title) {
                    document.title = title[1];
                }
            }
            var preview = $(_this.previewId);

            var scrolltop = preview.scrollTop();
            var contents = preview.contents();
            var html = contents.find('html');
            if (html[0] != null) {
                if (message.message == "refresh")
                    html[0].innerHTML = html[0].innerHTML;
                else if (message.message == "update") {
                    html[0].innerHTML = message.content;
                }
            }
            preview.load(function () {
                preview.scrollTop(scrolltop);
            });
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
        var _this = this;
        $.connection.hub.start().done(function () {
            if (done) {
                done();
            }

            _this.isConnected = true;
        }).fail(function () {
            alert('Connection failed!');
        });
    };

    /**
    * Sends an update with the given message
    *
    * @param {*} message - The message to send as an update
    */
    Synchronizer.prototype.update = function (message) {
        if (this.isConnected) {
            this.hub.server.send(message, this.overridenConnectionID || $.connection.hub.id);
        }
    };

    Object.defineProperty(Synchronizer.prototype, "connectionID", {
        get: function () {
            if (this.isConnected) {
                return this.overridenConnectionID || $.connection.hub.id;
            }
            return "";
        },
        set: function (connectionID) {
            this.overridenConnectionID = connectionID;
        },
        enumerable: true,
        configurable: true
    });

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
