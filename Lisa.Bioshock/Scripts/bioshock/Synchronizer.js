/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />

var SynchronizeMessages;
(function (SynchronizeMessages) {
    SynchronizeMessages[SynchronizeMessages["REFRESH"] = 1] = "REFRESH";
    SynchronizeMessages[SynchronizeMessages["UPDATE"] = 2] = "UPDATE";
})(SynchronizeMessages || (SynchronizeMessages = {}));

var Synchronizer = (function () {
    function Synchronizer(preview) {
        var _this = this;
        this.onRead = function (message) {
            if (message.contents != null) {
                var title = message.contents.match(/<title>(.*?)(<\/|$)/);
                if (title) {
                    document.title = title[1];
                }
            }

            var contents = _this.$preview.contents();
            var html = contents.find('html');

            if (html[0] != null) {
                switch (message.message) {
                    case 1 /* REFRESH */:
                        html[0].innerHTML = html[0].innerHTML;
                        break;

                    case 2 /* UPDATE */:
                        html[0].innerHTML = message.contents;
                        break;
                }
            }
        };
        this.isConnected = false;
        this.hub = $.connection.synchronizeHub;
        this.$preview = $(preview);
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
            alert("SingalR Connection Failed.");
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
        /**
        */
        get: function () {
            if (this.isConnected) {
                return this.overridenConnectionID || $.connection.hub.id;
            }
            return "";
        },
        /**
        */
        set: function (connectionID) {
            this.overridenConnectionID = connectionID;
        },
        enumerable: true,
        configurable: true
    });


    Synchronizer.prototype.setPreview = function (selector) {
        this.$preview = selector;
    };
    return Synchronizer;
})();
//# sourceMappingURL=Synchronizer.js.map
