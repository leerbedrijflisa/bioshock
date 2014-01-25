/// <reference path="UIWindow.ts" />
class NewFileWindow extends UIWindow {
    public constructor(selector: any) {
        super(selector);
    }

    public initialize() {
        var $form = $('#new-file-form');
        var $addButton = $('#new-file-add-button');
        this.$error = $("#new-file-error-message");
        this.$fileName = $("#new-file-name");

        this.open(() => {
            this.onOpen();
        }).close(() => {
            this.onClose();
        });

        $form.submit(() => {
            this.createFile();
            return false;
        });

        $addButton.click(() => {
            this.createFile();
            return false;
        });

        this.$fileName.keydown(() => {
            this.$error.slideUp(50);
        });

        return super.initialize();
    }

    public onNewFile(fileName: string) {
    }

    public showError = (message: string) => {
        var show = () => {
            this.$error.text(message);
            this.$error.slideDown(100);
        };

        if (this.$error.is(":visible")) {
            this.$error.slideUp(50, show);
        } else {
            show();
        }
    }

    private onClose = () => {
        this.$fileName.val('');
    }

    private onOpen = () => {
        setTimeout(() => {
            this.$fileName.focus();
        }, 150);
    }

    private createFile = () => {
        this.onNewFile(this.$fileName.val());
    }

    private $error: JQuery;
    private $fileName: JQuery;
};