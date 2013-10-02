/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/signalr/signalr.d.ts" />
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
     * @param {string} previewId - The id of the iframe that should be updated when a message arrives.
     */
    constructor(previewId: string) {

        this.previewId = previewId;
        this.hub.client.addMessage = this.onRead;
    }

    private previewId: string;
    private onRead = (message: string) => {

        var title = message.match(/<title>(.+)<\//im);
        if (title) {

            document.title = title[1];
        }

        $(this.previewId).contents().find('html').html(message);
    }

    private hub = $.connection.synchronizeHub;
    public start(done: Function) {

        if (done) {

            $.connection.hub.start().done(done);
        } else {

            $.connection.hub.start();
        }
    }

    public update(message: any) {

        this.hub.server.send(message);
    }

    public setPreview(id: string) {

        this.previewId = id;
    }
}