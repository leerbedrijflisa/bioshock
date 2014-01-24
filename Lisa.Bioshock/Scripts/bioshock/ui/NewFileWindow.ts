/// <reference path="UIWindow.ts" />
class NewFileWindow extends UIWindow {
    public constructor(selector: any) {
        super(selector);
    }

    public initialize() {
        var $form = this.$element.find('#createFile');
        var $addButton = this.$element.find('#addButton');

        this.open(() => {
            this.setUp();
        }).close(() => {
            this.cleanup();
        });

        $form.submit(() => {
            this.createFile();
            return false;
        });

        $addButton.click(() => {
            this.createFile();
            return false;
        });

        this.$error = $("#newFileErrorMessage");

        return super.initialize();
    }

    public onNewFile(fileName: string) {
    }

    public showError = (message: string) => {
        this.$error.slideUp(50, () => {
            this.$error.text(message);
            this.$error.slideDown(100);
        });
    }

    private cleanup = () => {
        this.$element.find('#newFileName').val('');
    }

    private setUp = () => {
        var $filename = this.$element.find('#newFileName');
        console.log($filename);

        setTimeout(function () {

            $filename.focus();
        }, 500);
    }

    private createFile = () => {
        //    console.log('Create file called.');
        //    var fileName = this.$element.find('#newFileName').val();

        //    if (fileName.endsWith('.css') || fileName.endsWith('.html')) {

        //        workspace.ajax.createFile({ filename: fileName }, (file: IStorageItem) => {
        //            if (data.result) {

        //                workspace.editor.newFile(data.contentType);
        //                $('#filename').text(fileName);
        //                this.onNewFile(file);
        //                this.close();
        //            } else {

        //                alert('Er is een interne fout opgetreden bij het aanmaken van uw bestand!');
        //            }
        //        });
        //    } else {
        //        alert('Kan geen bestand aanmaken zonder extensie!');
        //    }

        this.onNewFile(this.$element.find('#newFileName').val());
        this.close();
    }

    private $error: JQuery;
};