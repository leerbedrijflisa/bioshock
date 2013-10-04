/// <reference path="typings/jquery/jquery.d.ts" />
var GuiController = (function () {
    /**
    * Creates a new GuiController
    *
    * @constructor
    * @param {object} options - Options used for initializing the GuiController.
    */
    function GuiController(editor, options) {
        if (typeof options === "undefined") { options = {}; }
        var _this = this;
        /**
        * Registers the editor on which the change event should be handled
        *
        * @param {*} editor - The editor (CodeMirror).
        */
        this.registerEditor = function (editor) {
            _this.editor = editor;
            _this.editor.on('change', function (codeMirror) {
                _this.synchronizer.update(codeMirror.getValue());
            });
        };
        /**
        * Registers the drag handle
        *
        * @param {string} handle - The selector to get the drag handle.
        */
        this.registerDragHandle = function (handle) {
            _this.registerEditorHandlers({ handle: handle });
        };
        /**
        * Registers the element that will be used to identify the editors window
        *
        * @param {string} window - The selector used to get the window.
        */
        this.registerWindow = function (window) {
            _this.registerEditorHandlers({ window: window });
        };
        /**
        * Registers the element that will be used to identify the preview
        *
        * @param {string} preview - The selector used to get the preview.
        */
        this.registerPreview = function (preview) {
            _this.registerEditorHandlers({ preview: preview });
        };
        /**
        * Registers the element that will be used to identify the overlay
        *
        * @param {string} overlay - The selector used to get the overlay.
        */
        this.registerOverlay = function (overlay) {
            _this.registerEditorHandlers({ overlay: overlay });
        };
        this.editorKeyDown = function (event) {
            _this.lastKeyDown = event.keyCode;
        };
        this.editorKeyUp = function (event) {
            if (event.keyCode == 17 && _this.lastKeyDown == 17) {
                $(_this.editorWindowSelector).toggle();
                _this.editor.refresh();
            }
        };
        this.editorWindowSelector = '#editorWindow';
        this.previewSelector = '#preview';
        this.overlaySelector = '#overlay';
        this.editor = undefined;
        this.registerEditorHandlers(options);
        this.registerKeyHandlers();
        this.registerSynchronizeHandlers();
    }
    GuiController.prototype.registerKeyHandlers = function () {
        $(window).keydown(this.editorKeyDown);
        $(window).keyup(this.editorKeyUp);

        var iframe = $(this.previewSelector)[0];
        $(iframe.contentWindow).keydown(this.editorKeyDown);
        $(iframe.contentWindow).keyup(this.editorKeyUp);
    };

    GuiController.prototype.registerSynchronizeHandlers = function () {
        var _this = this;
        this.synchronizer = new Synchronizer(this.previewSelector);
        this.synchronizer.start(function () {
            _this.synchronizer.update(_this.editor.getValue());
        });
    };

    GuiController.prototype.registerEditorHandlers = function (options) {
        var _this = this;
        if (options.hasOwnProperty('preview')) {
            this.previewSelector = options['preview'];
        }

        if (options.hasOwnProperty('overlay')) {
            this.overlaySelector = options['overlay'];
        }

        if (options.hasOwnProperty('editor')) {
            this.registerEditor(options['editor']);
        }

        if (options.hasOwnProperty('window')) {
            this.editorWindowSelector = options['window'];
        }

        $(this.editorWindowSelector).resizable({
            start: function () {
                $(_this.overlaySelector).toggle();
            },
            stop: function () {
                $(_this.overlaySelector).toggle();
                _this.editor.refresh();
            },
            handles: 'all'
        });

        $(this.editorWindowSelector).draggable({ iframeFix: true });
        if (options.hasOwnProperty('handle')) {
            $(this.editorWindowSelector).draggable('option', 'handle', options['handle']);
        } else {
            this.registerDragHandle('h1');
        }
    };
    return GuiController;
})();
//# sourceMappingURL=GuiController.js.map
