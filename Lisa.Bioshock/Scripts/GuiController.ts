/// <reference path="typings/jquery/jquery.d.ts" />
class GuiController {
    
    /**
     * Creates a new GuiController
     *
     * @constructor
     * @param {string} id - The id of the editor.
     * @param {string} handleId - The id of the HTMLElement that should be used to drag the editor around.
     * @param {string} editorContainerId - The id of the HTMLElement that should be used to resize the editor.
     * @param {string} overlayId - The overlay of the id that will be shown when dragging starts.
     */
    constructor(id: string, handleId: string, editorContainerId: string, overlayId: string) {

        this.editorId = id;
        this.overlayId = overlayId;

        $(window).keydown(this.editorKeyDown);
        $(window).keyup(this.editorKeyUp);

        var iframe: HTMLFrameElement = <HTMLFrameElement> document.getElementById('preview');
        $(iframe.contentWindow).keydown(this.editorKeyDown);
        $(iframe.contentWindow).keyup(this.editorKeyUp);

        $(this.editorId).draggable({ iframeFix: true, handle: handleId });
        $(editorContainerId).resizable({
            start: () => { $(this.overlayId).toggle(); },
            stop: () => { $(this.overlayId).toggle(); },
            handles: "all"
        });
    }

    private editorId: string;
    private lastKeyDown: number;
    private overlayId: string;
    private editor: any;

    /**
     * Registers the editor on which the change event should be handled
     * 
     * @param {*} editor The editor (CodeMirror)
     */
    public registerEditor = (editor: any) => {
        this.editor = editor;
        this.editor.on('change', function (codeMirror) {

            // TODO: Send update to preview
            
        });
    }

    public editorKeyDown = (event) => {
        this.lastKeyDown = event.keyCode;
    }

    public editorKeyUp = (event) => {

        if (event.keyCode == 17 && this.lastKeyDown == 17) {

            $(this.editorId).toggle();
        }
    }
}