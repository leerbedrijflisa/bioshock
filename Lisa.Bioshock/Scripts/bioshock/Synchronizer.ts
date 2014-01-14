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
interface ISynchronizeMessage {
    message: SynchronizeMessages;
    fileID: string;
    contents: string;
}

enum SynchronizeMessages {
    REFRESH = 1,
    UPDATE = 2
}

class Synchronizer {

    /**
     * Creates a new Synchronizer.
     * 
     * @param {string} preview - The selector of the element that should be updated when a message arrives.
     */
    constructor(preview: string);
    constructor(preview: JQuery);
    constructor(preview: any) {

        this.$preview = $(preview);
        this.hub.client.addMessage = this.onRead;
    }


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
        }).fail(() => {
            alert("SingalR Connection Failed.");
        });
    }

    /**
     * Sends an update with the given message
     *
     * @param {*} message - The message to send as an update
     */ 
    public update(message: ISynchronizeMessage) {

        if (this.isConnected) {
            this.hub.server.send(message, this.overridenConnectionID || $.connection.hub.id);
        }
    }

    private onRead = (message: ISynchronizeMessage) => {

        if (message.contents != null) {
            var title = message.contents.match(/<title>(.*?)(<\/|$)/);
            if (title) {

                document.title = title[1];
            }
        }

        var contents = this.$preview.contents();
        var html = contents.find('html');

        if (html[0] != null) {
            switch (message.message) {

                case SynchronizeMessages.REFRESH:
                    html[0].innerHTML = html[0].innerHTML;
                    break;

                case SynchronizeMessages.UPDATE:
                    html[0].innerHTML = message.contents;
                    break;
            }
        }
    }


    /**
     */
    public get connectionID(): string {
        if (this.isConnected) {
            return this.overridenConnectionID || $.connection.hub.id;
        }
        return "";
    }

    /**
     */
    public set connectionID(connectionID: string) {
        this.overridenConnectionID = connectionID;
    }


    /**
     * Sets the preview
     *
     * @param {string} selector - The selector of the element that should be updated when a message arrives.
     */
    public setPreview(selector: string);
    public setPreview(selector: JQuery);
    public setPreview(selector: any) {
        this.$preview = selector;
    }

    // fields
    private $preview: JQuery;
    private isConnected = false;
    private hub = $.connection.synchronizeHub;
    private overridenConnectionID;
}