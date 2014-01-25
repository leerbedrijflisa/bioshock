class Validator {

    public onFileValidationFinished(data: any[]) {
    }

    public validateFile(fileName: string, contents: string) {
        var validationType = '';

        if(FileSystemHelper.isHTML(fileName)) {
            validationType = 'html';
        }
        else if(FileSystemHelper.isCSS(fileName)) {
            validationType = 'css';
        }

        $.get('/validate/validate' + validationType, {
            source: contents
        }, (data) => {
            this.onFileValidationFinished(data);            
        }, 'json');
    }
} 