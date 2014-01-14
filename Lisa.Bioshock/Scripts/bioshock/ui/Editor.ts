interface EditorEventObject {
    contents: string;
}

class Editor {
    constructor(selector: string) {
        this.editor = CodeMirror.fromTextArea(<HTMLTextAreaElement> $(selector)[0]);
        this.editor.on('change', this.onChange);
    }

    public addChangeHandler(eventHandler: (EditorEventObject) => void) {
        this.changeEventHandlers.push(eventHandler);
    }

    public removeChangeEventHandler(eventHandler: (EditorEventObject) => void) {
        var index = this.changeEventHandlers.indexOf(eventHandler);
        this.changeEventHandlers.splice(index);
    }

    public get contents() {
        return this.editor.getDoc().getValue();
    }

    public set contents(value: string) {
        this.editor.getDoc().setValue(value);
    }

    private onChange() {
        var eventArgs = {
            contents: this.contents
        };

        for (var i = 0; i < this.changeEventHandlers.length; i++) {
            this.changeEventHandlers[i](eventArgs);
        }
    }

    private editor: CodeMirror.Editor;
    private changeEventHandlers: { (EditorEventObject): void }[];
} 