/// <reference path="UIWindow.ts" />
class NewFileWindow extends UIWindow {
    public constructor(selector: any) {
        super(selector);
        this.initialize();
    }

    private initialize() {
        this.$form = $('#new-file-form');
        this.$addButton = $('#new-file-add-button');
        this.$error = $("#new-file-error-message");
        this.$fileName = $("#new-file-name");

        this.$form.on('submit', this.onSubmit);
        this.$fileName.on('keydown', this.onKeyUp);
    }

    public open() {
        setTimeout(() => {
            this.$fileName.focus();
        }, 150);
        return super.open();
    }

    public clearEventListeners() {
        this.fileCreating.clear();
        this.errorShown.clear();

        this.$form.off('submit', this.onSubmit);
        this.$fileName.off('keyup', this.onKeyUp);

        return super.clearEventListeners();
    }

    public reset() {
        this.$fileName.val('');
    }

    public showError(message: string) {
        if (this.$error.is(":visible")) {
            this.$error.slideUp(50, () => { this.onErrorShown(message) });
        } else {
            this.onErrorShown(message);
        }
    }

    private onErrorShown(message: string) {
        this.errorShown.raise(message);

        this.$error.text(message);
        this.$error.slideDown(100);
    }

    private onKeyUp = () => {
        this.$error.slideUp(50);
    }

    private onSubmit = () => {
        this.fileCreating.raise(this.$fileName.val());
        return false;
    }

    // events
    public fileCreating: EventDispatcher = new EventDispatcher(this);
    public errorShown: EventDispatcher = new EventDispatcher(this);

    // fields
    private $form: JQuery;
    private $addButton: JQuery;
    private $error: JQuery;
    private $fileName: JQuery;
};