/// <reference path="typings/jquery/jquery.d.ts" />
var GuiController = (function () {
    /**
    * Creates a new GuiController
    *
    * @constructor
    * @param {string} id - The id of the editor.
    * @param {string} handleId - The id of the HTMLElement that should be used to drag the editor around.
    * @param {string} editorContainerId - The id of the HTMLElement that should be used to resize the editor.
    * @param {string} overlayId - The overlay of the id that will be shown when dragging starts.
    * @param {string} previewId - The id of the iframe to update
    */
    function GuiController(id, handleId, editorContainerId, overlayId, previewId) {
        var _this = this;
        /**
        * Registers the editor on which the change event should be handled
        *
        * @param {*} editor The editor (CodeMirror)
        */
        this.registerEditor = function (editor) {
            _this.editor = editor;
            _this.editor.on('change', function (codeMirror) {
                _this.synchronizer.write(codeMirror.getValue());
            });
        };
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

        this.synchronizer = new Synchronizer(previewId);
        this.synchronizer.start(function () {
            _this.synchronizer.write($(_this.editorId).val());
        });
    }
    return GuiController;
})();
//# sourceMappingURL=GuiController.js.map
