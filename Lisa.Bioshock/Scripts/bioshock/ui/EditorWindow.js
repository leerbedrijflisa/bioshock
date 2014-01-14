var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/codemirror/codemirror.d.ts" />
/// <reference path="../../typings/jqueryui/jqueryui.d.ts" />
var EditorWindow = (function (_super) {
    __extends(EditorWindow, _super);
    function EditorWindow(selector) {
        _super.call(this, selector);

        this.triggerOverlay = false;
        this.initialize();
    }
    EditorWindow.prototype.open = function (onOpen) {
        _super.prototype.open.call(this, onOpen);

        this.editor.refresh();
        this.editor.focus();

        return this;
    };

    EditorWindow.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);

        if (this.$element === undefined) {
            return;
        }

        this.$editor = $("#editor");
        this.$editorResizeOverlay = $('#editor-resize-overlay');
        this.$fileName = this.$element.find("#filename");

        this._currentFile = this.$editor.data('FileData');

        if (this.$element.data('CodeMirror_instance') === undefined) {
            this.editor = CodeMirror.fromTextArea(this.$editor[0], {
                value: "abcde",
                lineNumbers: true,
                mode: "htmlmixed",
                smartIndent: false,
                tabSize: 2,
                theme: "default",
                gutters: ["Errors", "CodeMirror-linenumbers"],
                extraKeys: {
                    "Shift-Tab": "indentLess"
                }
            });
            this.editor.on('change', this.editorChange);
            this.editor.on('focus', this.editorFocus);

            this.$element.data('CodeMirror_instance', this.editor).resizable({
                minHeight: 52,
                minWidth: 200,
                containment: this.$editorResizeOverlay,
                handles: 'all',
                resize: function (event, ui) {
                    _this.$element.width(ui.size.width).height(ui.size.height);

                    _this.editor.refresh();
                },
                start: function () {
                    _this.$editorResizeOverlay.show();
                },
                stop: function () {
                    _this.$editorResizeOverlay.hide();
                    _this.editor.refresh();
                }
            }).draggable({
                iframeFix: true,
                containment: 'window',
                handle: 'h1'
            });
        } else {
            this.editor = this.$element.data('CodeMirror_instance');
        }

        return this;
    };

    Object.defineProperty(EditorWindow.prototype, "contents", {
        get: function () {
            return this.editor.getDoc().getValue();
        },
        set: function (value) {
            this.editor.getDoc().setValue(value);
            this.editor.focus();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(EditorWindow.prototype, "cursor", {
        get: function () {
            return this.editor.getDoc().getCursor();
        },
        set: function (pos) {
            this.editor.getDoc().setCursor(pos);
        },
        enumerable: true,
        configurable: true
    });


    EditorWindow.prototype.openFile = function (file) {
        if (file.type == 1 /* FOLDER */) {
            throw new Error("Could not open a folder.");
        }

        this.$element.data("file-id", file.id);

        var doc = new CodeMirror.Doc('', file.fileProps.contentType);
        this.editor.swapDoc(doc);
        this.contents = file.fileProps.contents;

        this._currentFile = file;
    };

    EditorWindow.prototype.editorChange = function () {
        Workspace.ajax.writeFile({
            fileID: this.fileID,
            contents: this.editor.getDoc().getValue()
        });

        if (this.fileName.indexOf(".css") > -1) {
            Workspace.synchronizer.update({
                message: 1 /* REFRESH */,
                fileID: this.fileID,
                contents: this.editor.getDoc().getValue()
            });
        } else {
            Workspace.synchronizer.update({
                message: 2 /* UPDATE */,
                fileID: this.fileID,
                contents: this.editor.getDoc().getValue()
            });
        }

        if (this.$errors.is(':visible')) {
            this.$errors.hide();
        }
    };

    EditorWindow.prototype.editorFocus = function () {
        Workspace.synchronizer.update({
            message: 2 /* UPDATE */,
            fileID: this.fileID,
            contents: this.editor.getDoc().getValue()
        });
    };

    EditorWindow.prototype.keyUp = function () {
    };

    Object.defineProperty(EditorWindow.prototype, "fileID", {
        get: function () {
            return this._currentFile.id;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(EditorWindow.prototype, "fileName", {
        get: function () {
            return this._currentFile.name;
        },
        set: function (name) {
            this._currentFile.name = name;
            this.$fileName.text(name);
        },
        enumerable: true,
        configurable: true
    });
    return EditorWindow;
})(UIWindow);
//# sourceMappingURL=EditorWindow.js.map
