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
    send(message: any);
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
    private isConnected = false;
    private onRead = (message: string) => {

        
        //var title = message.match(/<title>(.+)<\//im);
        var title = message.match(/<title>(.+?)(<\/|$)/);
        if (title) {

            document.title = title[1];
        }

        $(this.previewId).contents().find('html').html(message);

    }

    private hub = $.connection.synchronizeHub;

    /**
     * Start a connection with the hub
     *
     * @param {function} done (optional) - The callback function to be called when the start of the connection finishes. This parameter can be undefined.
     */
    public start(done?: Function) {

        $.connection.hub.start().done(() => {

            this.isConnected = true;

            if (done) {
                done();
            }
        });
    }

    /**
     * Sends an update with the given message
     *
     * @param {*} message - The message to send as an update
     */ 
    public update(message: any) {

        if (this.isConnected) {
            this.hub.server.send(message);
        }
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