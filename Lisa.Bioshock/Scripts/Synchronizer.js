var Synchronizer = (function () {
    /**
    * Creates a new Synchronizer.
    *
    * @param {string} previewId - The id of the iframe that should be updated when a message arrives.
    */
    function Synchronizer(previewId) {
        var _this = this;
        this.onRead = function (message) {
            var title = message.match(/<title>(.+)<\//im);
            if (title) {
                document.title = title[1];
            }

            $(_this.previewId).contents().find('html').html(message);
        };
        this.hub = $.connection.synchronizeHub;
        this.previewId = previewId;
        this.hub.client.addMessage = this.onRead;
    }
    Synchronizer.prototype.start = function (done) {
        if (done) {
            $.connection.hub.start().done(function () {
                done();
            });
        } else {
            $.connection.hub.start();
        }
    };

    Synchronizer.prototype.write = function (message) {
        this.hub.server.send(message);
    };

    Synchronizer.prototype.setPreview = function (id) {
        this.previewId = id;
    };
    return Synchronizer;
})();
//# sourceMappingURL=Synchronizer.js.map
