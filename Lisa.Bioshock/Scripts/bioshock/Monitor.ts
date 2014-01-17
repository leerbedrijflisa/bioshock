class Monitor {

    constructor(signalR: SignalR, preview: Preview, editor: Editor) {
        this.hub = signalR.synchronizeHub;
        this.hub.on('update', (...msg: any[]) => {

            this.update(msg[0], msg[1]);
        });

        this.preview = preview;
        this.editor = editor;
    }

    private update(file: FileDescriptor, contents: string) {
        this.preview.update(file, contents);
        console.log('update preview...');
    }

    private hub: HubProxy;
    private preview: Preview;
    private editor: Editor;
} 