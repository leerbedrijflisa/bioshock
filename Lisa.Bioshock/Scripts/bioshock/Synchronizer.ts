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
    update(file: FileDescriptor, contents: string): void;
}
interface ISynchronizeServer {
    processChanges(file: FileDescriptor, contents: string);
}
interface SynchronizeMessage {
    fileID: string;
    fileName: string;
    contents: string;
}

interface FileDescriptor {
    projectID: number;
    id: string;
    name: string;
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
    constructor(signalR: SignalR, projectID: number) {
        this.hub = signalR.synchronizeHub;
        this.projectID = projectID;
    }

    /**
     * Sends an update with the given message
     *
     * @param {*} message - The message to send as an update
     */ 
    public processChanges(message: SynchronizeMessage) {
        var file = {
            id: message.fileID,
            name: message.fileName,
            projectID: this.projectID
        };

        this.hub.server.processChanges(file, message.contents);
    }

    // fields
    private hub: HubProxy;
    private projectID: number;
}