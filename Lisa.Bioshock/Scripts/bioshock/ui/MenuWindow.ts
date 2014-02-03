class MenuWindow extends UIWindow {
    constructor(selector: any) {
        super(selector);
        this.initialize();
    }

    private initialize() {
        this.$closeLink = this.$element.find('#menu-window-close a');
        this.$closeLink.on('click', this.close);
    }

    public clearEventListeners() {
        this.$closeLink.off('click', this.close);

        return super.clearEventListeners();
    }

    // fields
    private $closeLink: JQuery;
} 