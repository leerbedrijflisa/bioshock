class Workspace {

    /**
     * Creates a new BioshockWorkspace.
     * @param {string} projectID - This ID is being used by UIWindows and ajax requests.
     */
    constructor(projectID: number) {
        this.projectID = projectID;
        this.preview = new Preview('#preview');
        this.editor = new Editor('#editor');

        this.initializeSignalR();
        this._ajax = new AjaxHelper(projectID);
        this.stateMachine = new StateMachine();
    }

    private initializeSignalR() {
        this.signalR = $.connection;

        // SignalR subscribes to the hubs you have event handlers for when the hubConnection starts.
        // If you are not subscribed to your hub, adding any events to that hub after start() won't work.
        // (http://stackoverflow.com/questions/16064651/the-on-event-on-the-signalr-client-hub-does-not-get-called)
        this.signalR.synchronizeHub.client.update = function () { };

        this.signalR.hub.start().fail(this.onSignalRFailure);
    }

    private onSignalRFailure() {
        alert('WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!');
    }


    /**
     * Gets the AjaxHelper instance.
     */
    public get ajax(): AjaxHelper {
        return this._ajax;
    }

    /**
     * Gets the Synchronizer instance.
     */
    public get synchronizer(): Synchronizer {
        return this._synchronizer;
    }


    // fields
    public projectID: number;
    public stateMachine: StateMachine;
    public preview: Preview;
    public editor: Editor;
    public signalR: SignalR;

    private _ajax: AjaxHelper;
    private _synchronizer: Synchronizer;
}

var workspace: Workspace;