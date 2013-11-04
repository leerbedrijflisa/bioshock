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
        this.ready = true;
        this.widgets = [];
        this.registerEditor = function (editor) {
            _this.editor = editor;
            _this.editor.on('change', function (codeMirror) {
                _this.synchronizer.update(codeMirror.getValue());
            });
            _this.editor.on('gutterClick', function (codeMirror) {
                _this.editor.setGutterMarker(3, "Errors", _this.makeMarker());
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

            if (!_this.isMenuActive) {
                if (event.ctrlKey && event.keyCode == 13) {
                    var lineNumber = _this.editor.getCursor().line;
                    var lineText = _this.editor.getLineHandle(lineNumber).text;

                    _this.editor.setLine(lineNumber, "\n" + lineText);
                    _this.editor.setCursor(lineNumber);
                }

                if (event.altKey && event.keyCode == 79) {
                    _this.isMenuActive = true;
                    _this.toggleOverlay();
                    $(_this.openFileWindowSelector).toggle();
                    _this.isMenuAvailable = false;
                }
            } else {
                if (event.altKey && event.keyCode == 79) {
                    _this.isMenuActive = false;
                    $(_this.openFileWindowSelector).toggle();
                    _this.toggleOverlay();
                    _this.isMenuAvailable = true;
                }
            }
        };
        this.editorKeyUp = function (event) {
            if (!_this.isMenuActive) {
                if (event.keyCode == 17 && _this.lastKeyDown == 17) {
                    $(_this.editorWindowSelector).toggle();
                    _this.editor.refresh();
                }

                if (event.keyCode == 144 && _this.lastKeyDown == 144) {
                    if (_this.ready) {
                        _this.ready = false;
                        $.get("/validate/validate", { source: _this.editor.getValue() }, function (data) {
                            for (var i = 0; i < _this.widgets.length; ++i) {
                                _this.editor.removeLineWidget(_this.widgets[i]);
                                _this.editor.clearGutter("Errors");
                            }
                            _this.widgets.length = 0;
                            for (var i in data) {
                                if (data[i].Type == 2) {
                                    var msg = document.createElement("div");
                                    msg.appendChild(document.createTextNode(data[i].Message));
                                    msg.className = "lint-error";
                                    _this.widgets.push(_this.editor.addLineWidget(data[i].Line - 1, msg, { coverGutter: false, noHScroll: true }));
                                    _this.editor.setGutterMarker(data[i].Line - 1, "Errors", _this.makeMarker());
                                }
                            }
                            _this.ready = true;
                        }, "json");
                    }
                }
            }

            if (event.keyCode === 27) {
                if (_this.isMenuAvailable) {
                    if (_this.isMenuActive) {
                        _this.isMenuActive = false;
                        _this.toggleOverlay();
                        _this.editor.focus();
                    } else {
                        _this.isMenuActive = true;
                        _this.toggleOverlay();
                    }

                    $(_this.menuWindowSelector).toggle().focus();
                }
            }
        };
        this.editorWindowSelector = '#editorWindow';
        this.previewSelector = '#preview';
        this.overlaySelector = '#overlay';
        this.menuWindowSelector = '#editorMenuWindow';
        this.openFileWindowSelector = '#openFileWindow';
        this.isMenuActive = false;
        this.isMenuAvailable = true;
        this.isEditorDragging = false;
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
            minHeight: 52,
            minWidth: 200,
            containment: "#overlay",
            resize: function (event, ui) {
                if (_this.isMenuActive) {
                    $(_this.editorWindowSelector).width(_this.editorWidth);
                    $(_this.editorWindowSelector).height(_this.editorHeight);
                } else {
                    _this.editorWidth = ui.size.width;
                    _this.editorHeight = ui.size.height;
                }
                _this.editor.refresh();
            },
            start: function () {
                _this.isEditorDragging = true;
                _this.toggleOverlay();
            },
            stop: function () {
                _this.isEditorDragging = false;
                _this.toggleOverlay();
                _this.editor.refresh();
            },
            handles: 'all'
        });

        $(this.editorWindowSelector).draggable({
            iframeFix: true,
            containment: "window"
        });
        if (options.hasOwnProperty('handle')) {
            $(this.editorWindowSelector).draggable('option', 'handle', options['handle']);
        } else {
            this.registerDragHandle('h1');
        }
    };

    GuiController.prototype.makeMarker = function () {
        var errorMarker = document.createElement("div");
        errorMarker.innerHTML = "<img style='width:10px; margin-left:15px; margin-bottom:1px;' src='/Content/Images/ErrorIcon.png'/>";
        return errorMarker;
    };

    GuiController.prototype.toggleOverlay = function () {
        if (this.isMenuActive) {
            $(this.overlaySelector).css({
                'background-color': 'black',
                'opacity': '0.65',
                'z-index': '499'
            });
        } else {
            $(this.overlaySelector).css({
                'background-color': '',
                'opacity': '1',
                'z-index': '0'
            });
        }

        if (this.isMenuActive || this.isEditorDragging) {
            $('#overlay').show();
        } else {
            $('#overlay').hide();
        }
    };
    return GuiController;
})();
//# sourceMappingURL=GuiController.js.map
