/// <reference path="typings/jquery/jquery.d.ts" />
var GuiController = (function () {
    function GuiController(id, handleId, editorContainerId, overlayId) {
        var _this = this;
        this.editorKeyDown = function (event) {
            _this.lastKeyDown = event.keyCode;
        };
        this.editorKeyUp = function (event) {
            if (event.keyCode == 17 && _this.lastKeyDown == 17) {
                $(_this.editorId).toggle();
            }
        };
        this.editorId = id;
        this.overlayId = overlayId;

        $(window).keydown(this.editorKeyDown);
        $(window).keyup(this.editorKeyUp);

        var iframe = document.getElementById('preview');
        $(iframe.contentWindow).keydown(this.editorKeyDown);
        $(iframe.contentWindow).keyup(this.editorKeyUp);

        $(this.editorId).draggable({ iframeFix: true, handle: handleId });
        $(editorContainerId).resizable({
            start: function () {
                $(_this.overlayId).toggle();
            },
            stop: function () {
                $(_this.overlayId).toggle();
            },
            handles: "all"
        });
    }
    return GuiController;
})();
//# sourceMappingURL=GuiController.js.map
