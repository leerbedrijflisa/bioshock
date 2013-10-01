/// <reference path="typings/jquery/jquery.d.ts" />
class GuiController {
    
    constructor(id: string, handleId: string) {

        this.editorId = id;

        $(window).keydown(this.editorKeyDown);
        $(window).keyup(this.editorKeyUp);

        var iframe: HTMLFrameElement = <HTMLFrameElement> document.getElementById('preview');
        $(iframe.contentWindow).keydown(this.editorKeyDown);
        $(iframe.contentWindow).keyup(this.editorKeyUp);

        $(this.editorId).draggable({ iframeFix: true, handle: handleId }).resizable();
    }

    private editorId: string;
    private lastKeyDown: number;

    public editorKeyDown = (event) => {
        this.lastKeyDown = event.keyCode;
    }

    public editorKeyUp = (event) => {

        if (event.keyCode == 17 && this.lastKeyDown == 17) {

            $(this.editorId).toggle();
        }
    }
}