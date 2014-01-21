class Validator {

    public onFileValidationFinished(data: any[]) {
    }

    public validateFile(fileName: string, contents: string) {
        var validationType = '';

        if (fileName.indexOf('.html') > -1) {
            validationType = 'html';
        }
        else if (fileName.indexOf('.css') > -1) {
            validationType = 'css';
        }

        $.get('/validate/validate' + validationType, {
            source: contents
        }, (data) => {
            this.onFileValidationFinished(data);            
        }, 'json');
    }
} 