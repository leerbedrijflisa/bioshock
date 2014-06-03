class CheatSheetState implements State {

    public enter() {
        this.window = <CheatSheetWindow> new CheatSheetWindow('.helpBackground');        
        this.window.opening.addListener(this.onWindowOpening);
        this.window.closed.addListener(this.onWindowClosed);
        this.window.open();
    }

    public leave() {
        this.window.clearEventListeners().close();
    }

    public resume() {
        $(window).on('keyup', this.onKeyUp);
    }

    public suspend() {
        $(window).off('keyup', this.onKeyUp);
    }

    private pop() {
        this.window.closed.removeListener(this.onWindowClosed);
        this.window.close();
        this.stateMachine.popState();
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {
        if (event.keyCode == Keys.ESC) {
            this.pop();
        }
        else if (event.altKey) {
            if (event.keyCode == Keys.O) {
                this.pop();
                var openFileState = new OpenFileState();

                this.stateMachine.pushState(openFileState);
            }
            else if (event.keyCode == Keys.N) {
                this.pop();
                var newFileState = new NewFileState();

                this.stateMachine.pushState(newFileState);
            }
            else if (event.keyCode == Keys.H) {
                this.pop();
            }
        }
    }

    private onWindowOpening = () => {
        workspace.ajax.getShortKeys((data) => {
            this.window.setShortKeysData(data);
        });
    }

    private onWindowClosed = () => {
        this.pop();
    }

    // fields
    public stateMachine: StateMachine;

    private window: CheatSheetWindow;
   
} 