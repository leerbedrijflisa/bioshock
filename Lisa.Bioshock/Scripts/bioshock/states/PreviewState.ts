class PreviewState implements State {

    public enter(): void {        
    }

    public leave(): void {
    }

    public resume(): void {
        $(window).on('keyup', this.onKeyUp);
        workspace.preview.keyReleased.addListener(this.onKeyUp);
    }

    public suspend(): void {
        $(window).off('keyup', this.onKeyUp);
        workspace.preview.keyReleased.removeListener(this.onKeyUp);
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {

        if (event.keyCode == Keys.CTRL) {
            this.stateMachine.pushState(new EditorState());
        }
        else if (event.altKey) {
            if (event.keyCode == Keys.O) {
                var openFileState = new OpenFileState();
                openFileState.fileOpened.addListener(this.onFileOpened);
                
                this.stateMachine.pushState(openFileState);
            }
            else if (event.keyCode == Keys.N) {
                var newFileState = new NewFileState();
                newFileState.fileCreated.addListener(this.onFileOpened);

                this.stateMachine.pushState(newFileState);
            }
            else if (event.keyCode == Keys.H) {
                var cheatSheetState = new CheatSheetState();
                cheatSheetState.enter();
                
                this.stateMachine.pushState(cheatSheetState);
            }
        }
        else if (event.keyCode == Keys.ESC) {
            this.stateMachine.pushState(new MenuState());
        }
    }

    private onFileOpened = () => {
        setTimeout(() => {
            this.stateMachine.pushState(new EditorState());
        }, 50);
    }

    // properties

    // fields
    public stateMachine: StateMachine;
} 