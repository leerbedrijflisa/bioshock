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
        /**
        * Registers the element that will be used to identify the (escape) menu
        *
        * @param {string} overlay - The selector used to get the menu.
        */
        this.registerMenu = function (menu) {
            _this.registerEditorHandlers({ menu: menu });
        };
        this.editorKeyDown = function (event) {
            _this.lastKeyDown = event.keyCode;
        };
        this.editorKeyUp = function (event) {
            if (!_this.isMenuActive) {
                if (event.keyCode == 17 && _this.lastKeyDown == 17) {
                    $(_this.editorWindowSelector).toggle();
                    _this.editor.refresh();
                }
            }

            if (event.keyCode === 27) {
                _this.toggleOverlay(true);
                $(_this.menuWindowSelector).toggle().focus();
                _this.isMenuActive = !_this.isMenuActive;

                if (!_this.isMenuActive) {
                    _this.editor.focus();
                }
            }
        };
        this.editorWindowSelector = '#editorWindow';
        this.previewSelector = '#preview';
        this.overlaySelector = '#overlay';
        this.menuWindowSelector = '#editorMenuWindow';
        this.isMenuActive = false;
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

        if (options.hasOwnProperty('menu')) {
            this.menuWindowSelector = options['menu'];
        }

        $(this.editorWindowSelector).resizable({
            start: function () {
                //$(this.overlaySelector).toggle();
                _this.toggleOverlay();
            },
            stop: function () {
                //$(this.overlaySelector).toggle();
                _this.toggleOverlay();
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

    GuiController.prototype.toggleOverlay = function (menu) {
        if (typeof menu === "undefined") { menu = false; }
        if (menu) {
            $(this.overlaySelector).css({
                'background-color': 'black',
                'opacity': '0.65',
                'z-index': '999'
            }).toggle();
        } else {
            $(this.overlaySelector).css({
                'background-color': '',
                'opacity': '1',
                'z-index': '0'
            }).toggle();
        }
    };
    return GuiController;
})();
//# sourceMappingURL=GuiController.js.map
