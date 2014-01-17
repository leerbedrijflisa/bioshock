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
        this.makeRequest('/ajax/getfiles', null, true, success, error);
    }


     /**
     * Make an ajax request to get the contents of a file (within the current project).
     *
     * @param {string} fileID - The ID of the file.
     * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
     * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
     */
    public getFileContents(fileID: string, success: Function, error?: Function) {
        this.makeRequest('/ajax/getfilecontents', { fileID: fileID }, true, success, error);
    }


    /**
     * Make an ajax request to create a new file within the current project.
     *
     * @param {Object} data - An object with key/value pairs that will be send with the request.
     * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
     * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
     */
    public createFile(data: Object, success: Function, error?: Function) {
        this.makeRequest('/ajax/createfile', data, true, success, error);
    }

    /**
     */
    public writeFile(options: AjaxWriteFileOptions) {
        var data = {
            fileID: options.fileID,
            contents: options.contents
        };

        this.makeRequest('/test/writefile', data, true, options.success, options.error);
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
            'success': function (result) {
                if (success) {
                    success(result);
                }
            },
            'error': function (jqXHR: any, textStatus: string, errorThrown: string) {
                if (error) {
                    error(jqXHR, textStatus, errorThrown);
                }
            },
            'type': (isPost ? 'POST' : 'GET')
        });
    }

    /** The ID of the current project. */
    public projectID: number;
};