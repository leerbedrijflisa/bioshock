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

        return super.initialize();
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
        var fileName = this.$element.find('#newFileName').val();

        if (fileName.endsWith('.css') || fileName.endsWith('.html')) {

            Workspace.instance.ajax.createFile({ filename: fileName }, (data) => {
                if (data.result) {

                    /* TODO: Update the editor */
                    $('#filename').text(fileName);
                    this.close()
                        .exit();
                } else {

                    alert('Er is een interne fout opgetreden bij het aanmaken van uw bestand!');
                }
            });
        } else {
            alert('Kan geen bestand aanmaken zonder extensie!');
        }
    }
};