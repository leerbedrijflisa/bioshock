//100/ <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="BaseGuiController.ts" />
class FullScreenGuiController extends BaseGuiController {

    constructor(editor: any, options = {}) {
        super(editor, options, false);

        localStorage.setItem("fullscreen", "true");
    }

    public registerSynchronizeHandlers() {

        this.synchronizer = new Synchronizer(this.previewSelector);
        this.synchronizer.connectionID = localStorage.getItem("signalR_PreviewID");
        this.synchronizer.start(() => {


            this.synchronizer.update({
                message: "update",
                fileID: this.currentGuid,
                content: this.editor.getValue()
            });
        });
    }
}