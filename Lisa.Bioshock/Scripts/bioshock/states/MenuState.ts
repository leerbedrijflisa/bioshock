class MenuState implements IState {

    public static name = 'MenuState';

    public getName() {
        return self.name;
    }

    public enter() {
        this._window = <MenuWindow> new MenuWindow('#menu-window')
            .open()
            .close(() => {
                if (this.stateMachine.currentState == this) {
                    this.stateMachine.popState();
                }
            });
    }

    public leave() {
        this._window.close();
    }

    public resume() {
        $(window).on('keyup', this.onKeyUp);
    }

    public suspend() {
        $(window).off('keyup', this.onKeyUp);
    }

    private onKeyUp = (event: JQueryKeyEventObject) => {
        if (event.keyCode == Keys.ESC) {

            console.log('popping MenuState');
            this.stateMachine.popState();
        }
    }

    // fields
    public stateMachine: StateMachine;

    private _window: MenuWindow;
}