///<reference path="../../typings/diff_match_patch/diff_match_patch.d.ts"/>

interface AjaxResult {
    result: boolean;
    errorMessage?: string;
}


interface StorageItemAjaxResult extends AjaxResult {
    items: StorageItem[];
}


interface AjaxCallbacks {
    error? (result: AjaxResult): any;
    success? (data: any): any;
}

interface AjaxGetFileContentsOptions extends AjaxCallbacks {
    fileId: string;
}

interface AjaxCreateFileOptions extends AjaxCallbacks {
    fileName: string
}

interface AjaxWriteFileOptions extends AjaxCallbacks {
    fileId: string;
    contents: string;
    oldContents: string;
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
    public getFileContents(options: AjaxGetFileContentsOptions) {
        var data = {
            fileId: options.fileId,
            readContents: true
        };

        this.makeRequest('/project/getfile', data, false, options.success, options.error);
    }

    /** 
     * Make an ajax request to get all the shortkeys within the current project.
     *
     * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
     * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
    */
    public getShortKeys(success: Function, error?: Function) {
        this.makeRequest('http://localhost:57464/api/cheatsheet/', null, false, success, error, false);
    }


    /**
     * Make an ajax request to create a new file within the current project.
     *
     * @param {Object} data - An object with key/value pairs that will be send with the request.
     * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
     * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
     */
    public createFile(options: AjaxCreateFileOptions) {

        var data = {
            fileName: options.fileName
        };

        this.makeRequest('/project/createfile', data, false, options.success, options.error);
    }

    /**
     */
    public writeFile(options: AjaxWriteFileOptions) {
        var dmp = new diff_match_patch();

        if (options.oldContents != null || options.contents != null) {
            var diff = dmp.diff_main(options.oldContents, options.contents);
            if (diff.length > 2) {
                dmp.diff_cleanupSemantic(diff);
            }

            var patch_list = dmp.patch_make(diff);
            var patch = dmp.patch_toText(patch_list);
            var data = {
                fileID: options.fileId,
                contents: patch
                //contents: options.contents 
            };

            this.makeRequest('/project/writefile', data, true, options.success, options.error);
        } else {
            console.log("oldContents or contents is null");
        }
    }


    public getStartUpFile(options: AjaxCallbacks) {
        this.makeRequest('/project/getstartupfile', null, false, options.success, options.error);
    }

    
    /** The actual request. */
    private makeRequest(url: string, data: Object, isPost: boolean, success: Function, error?: Function, sendProjectID: boolean = true) {
        data = data || {};

        if (sendProjectID) {
            data['projectID'] = this.projectID; 
        }

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
        if ((data.result !== undefined && !data.result) && (!error || error(data))) {
            ErrorUtil.ajaxError(data.errorMessage);
        }

        if (((data.result === undefined && data) || (data.result !== undefined && data.result))
            && success) {

            success(data);
        }
        //if ((data.result !== undefined && (data.result || data)) && success) {
        //    success(data);
        //}
    }

    private onError(jqXHR: any, error?: Function) {
        var errorMessage = 'An error occurred: ' + jqXHR.status + ' ' + jqXHR.statusText;

        if (!error) {
            ErrorUtil.ajaxError(errorMessage);
        } else {
            var json = JSON.parse(jqXHR.responseText);
            error(json);
        }
    }

    /** The ID of the current project. */
    public projectID: number;
};