interface AjaxCallbacks {
    error? (jqXHR: JQueryXHR, textStatus: string, errorThrow: string): any;
    success? (data: any, textStatus: string, jqXHR: JQueryXHR): any;
}

interface AjaxWriteFileOptions extends AjaxCallbacks {
    fileID: string;
    contents: string;
}

class AjaxHelper {

    /**
     * Creates a new instance of the AjaxHelper.
     *
     * @param {string} projectID - This ID will be used for ajax requests.
     */
    constructor(projectID: number) {
        this.projectID = projectID;
    }


    /**
     * Make an ajax request to get all the files within the current project.
     *
     * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
     * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
     */
    public getFiles(success: Function, error?: Function) {
        this.makeRequest('/project/getfiles', null, false, success, error);
    }


     /**
     * Make an ajax request to get the contents of a file (within the current project).
     *
     * @param {string} fileID - The ID of the file.
     * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
     * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
     */
    public getFileContents(fileID: string, success: Function, error?: Function) {
        this.makeRequest('/project/getfile', { fileID: fileID, readContents: true }, false, success, error);
    }


    /**
     * Make an ajax request to create a new file within the current project.
     *
     * @param {Object} data - An object with key/value pairs that will be send with the request.
     * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
     * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
     */
    public createFile(data: Object, success: Function, error?: Function) {
        this.makeRequest('/project/createfile', data, false, success, error);
    }

    /**
     */
    public writeFile(options: AjaxWriteFileOptions) {
        var data = {
            fileID: options.fileID,
            contents: options.contents
        };

        this.makeRequest('/project/writefile', data, true, options.success, options.error);
    }


    public getStartUpFile(options: AjaxCallbacks) {
        this.makeRequest('/project/getstartupfile', null, false, options.success, options.error);
    }

    
    /** The actual request. */
    private makeRequest(url: string, data: Object, isPost: boolean, success: Function, error?: Function) {
        if (data === undefined || data === null) {
            data = {};
        }
        data['projectID'] = this.projectID;

        $.ajax({
            'url': url,
            'data': data,
            'success': (data: StorageItemAjaxResult) => {
                this.onSuccess(data, success, error);
            },
            'error': (jqXHR: any, textStatus: string, errorThrown: string) => {
                this.onError(jqXHR, error);
            },
            'type': (isPost ? 'POST' : 'GET')
        });
    }

    private onSuccess(data: StorageItemAjaxResult, success?: Function, error?: Function) {
        if (!data.result && (error == undefined || error(data))) {
            ErrorUtil.ajaxError(data.errorMessage);
        }

        if (data.result && success) {
            success(data);
        }
    }

    private onError(jqXHR: any, error?: Function) {
        var errorMessage = 'An error occured: ' + jqXHR.status + ' ' + jqXHR.statusText;

        if (error == undefined) {
            ErrorUtil.ajaxError(errorMessage);
        } else {
            var json = JSON.parse(jqXHR.responseText);
            error(json);
        }
    }

    /** The ID of the current project. */
    public projectID: number;
};