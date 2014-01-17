/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />
interface SignalR {
    synchronizeHub: HubProxy;
}
interface HubProxy {
    client: ISynchronizeClient;
    server: ISynchronizeServer;
}
interface ISynchronizeClient {
    addMessage(message: any);
}
interface ISynchronizeServer {
    send(message: any, connID: string);
}

class Synchronizer {

    /**
     * Creates a new Synchronizer.
     * 
     * @param {string} preview - The selector of the element that should be updated when a message arrives.
     */
    constructor(preview: string) {

        this.previewId = preview;
        this.hub.client.addMessage = this.onRead;
    }

    private previewId: string;
    private isConnected;

    private onRead = (message: any) => {

        
        //var title = message.match(/<title>(.+)<\//im);
        if (message.content != null)
        {
            var title = message.content.match(/<title>(.+?)(<\/|$)/);
            if (title) {

                document.title = title[1];
            }
        }
        var preview = $(this.previewId);

        var scrolltop = preview.scrollTop();
        var contents = preview.contents();
        var html = contents.find('html');
        if (html[0] != null) {
            if (message.message == "refresh")
                html[0].innerHTML = html[0].innerHTML;
            else if (message.message == "update") {
                html[0].innerHTML = message.content;
            }
        }

        //preview.scrollTop(scrolltop);
    }

    private hub = $.connection.synchronizeHub;
    private overridenConnectionID;

    /**
     * Start a connection with the hub
     *
     * @param {function} done (optional) - The callback function to be called when the start of the connection finishes. This parameter can be undefined.
     */
    public start(done?: Function) {

        $.connection.hub.start().done(() => {

            if (done) {
                done();
            }

            this.isConnected = true;
        }).fail(function () {

            alert('Connection failed!');
        });
    }

    /**
     * Sends an update with the given message
     *
     * @param {*} message - The message to send as an update
     */ 
    public update(message: any) {

        if (this.isConnected) {
            this.hub.server.send(message, this.overridenConnectionID || $.connection.hub.id);
        }
    }

    public get connectionID(): string {
        if (this.isConnected) {
            return this.overridenConnectionID || $.connection.hub.id;
        }
        return "";
    }
    public set connectionID(connectionID: string) {
        this.overridenConnectionID = connectionID;
    }

    /**
     * Sets the preview
     *
     * @param {string} selector - The selector of the element that should be updated when a message arrives.
     */
    public setPreview(selector: string) {

        this.previewId = selector;
    }
}