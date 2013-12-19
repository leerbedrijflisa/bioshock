var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/codemirror/codemirror.d.ts" />
var EditorWindow = (function (_super) {
    __extends(EditorWindow, _super);
    function EditorWindow(selector) {
        _super.call(this, selector);
    }
    EditorWindow.prototype.open = function (onOpen) {
        _super.prototype.open.call(this, onOpen);

        this.editor.focus();
        this.editor.getDoc().setCursor(this.cursor);

        return this;
    };

    EditorWindow.prototype.initialize = function () {
        this.editor = CodeMirror.fromTextArea($("#editor")[0], {
            value: "",
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

        return _super.prototype.initialize.call(this);
    };

    Object.defineProperty(EditorWindow.prototype, "editorValue", {
        get: function () {
            return this.editor.getDoc().getValue();
        },
        set: function (value) {
            this.editor.getDoc().setValue(value);
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

    return EditorWindow;
})(UIWindow);
//# sourceMappingURL=EditorWindow.js.map
