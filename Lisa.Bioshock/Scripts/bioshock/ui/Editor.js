var Editor = (function () {
    function Editor(selector) {
        this.editor = CodeMirror.fromTextArea($(selector)[0]);
        this.editor.on('change', this.onChange);
    }
    Editor.prototype.addChangeHandler = function (eventHandler) {
        this.changeEventHandlers.push(eventHandler);
    };

    Editor.prototype.removeChangeEventHandler = function (eventHandler) {
        var index = this.changeEventHandlers.indexOf(eventHandler);
        this.changeEventHandlers.splice(index);
    };

    Object.defineProperty(Editor.prototype, "contents", {
        get: function () {
            return this.editor.getDoc().getValue();
        },
        set: function (value) {
            this.editor.getDoc().setValue(value);
        },
        enumerable: true,
        configurable: true
    });


    Editor.prototype.onChange = function () {
        var eventArgs = {
            contents: this.contents
        };

        for (var i = 0; i < this.changeEventHandlers.length; i++) {
            this.changeEventHandlers[i](eventArgs);
        }
    };
    return Editor;
})();
//# sourceMappingURL=Editor.js.map
