class MenuWindow extends UIWindow {
    constructor(selector: any) {
        super(selector);
    }

    public initialize() {

        this.open(function () {
            
        }).close(function () {

        });

        this.$element
            .find('#editorMenuWindow-close a')
            .click(() => {

                this.close();
            });

        return super.initialize();
    }
} 