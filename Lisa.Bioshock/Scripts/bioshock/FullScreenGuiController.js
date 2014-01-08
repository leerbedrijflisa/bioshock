var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="BaseGuiController.ts" />
var FullScreenGuiController = (function (_super) {
    __extends(FullScreenGuiController, _super);
    function FullScreenGuiController(editor, options) {
        if (typeof options === "undefined") { options = {}; }
        _super.call(this, editor, options, false);

        localStorage.setItem("fullscreen", "true");
    }
    FullScreenGuiController.prototype.registerSynchronizeHandlers = function () {
        var _this = this;
        this.synchronizer = new Synchronizer(this.previewSelector);
        this.synchronizer.connectionID = localStorage.getItem("signalR_PreviewID");
        this.synchronizer.start(function () {
            _this.synchronizer.update({
                message: "update",
                fileID: _this.currentGuid,
                content: _this.editor.getValue()
            });
        });
    };
    return FullScreenGuiController;
})(BaseGuiController);
//# sourceMappingURL=FullScreenGuiController.js.map
