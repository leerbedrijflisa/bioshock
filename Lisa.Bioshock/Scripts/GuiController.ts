/// <reference path="typings/jquery/jquery.d.ts" />
class GuiController {
    
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
            stop: () => { $(this.overlayId).toggle(); }
        });
    }

    private editorId: string;
    private lastKeyDown: number;
    private overlayId: string;

    public editorKeyDown = (event) => {
        this.lastKeyDown = event.keyCode;
    }

    public editorKeyUp = (event) => {

        if (event.keyCode == 17 && this.lastKeyDown == 17) {

            $(this.editorId).toggle();
        }
    }
}