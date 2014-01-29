class MenuState implements State {

    public enter() {
        this.window = <MenuWindow> new MenuWindow('#menu-window').open();
        this.window.closed.addListener(this.onWindowClosed);
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
    }

    private onWindowClosed = () => {
        this.pop();
    }

    // fields
    public stateMachine: StateMachine;

    private window: MenuWindow;
}