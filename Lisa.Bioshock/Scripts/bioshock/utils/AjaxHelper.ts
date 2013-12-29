/// <reference path="../../typings/jquery/jquery.d.ts" />
class AjaxHelper {

    constructor(projectID: string) {
        this.projectID = projectID;
    }

    public getFiles(success: Function, error?: Function) {

        this.makeRequest('/ajax/getfiles', null, true, success, error);
    }

    public getFileContents(fileID: string, success: Function, error?: Function) {
        this.makeRequest('/ajax/getfilecontents', { fileID: fileID }, true, success, error);
    }

    public createFile(data: Object, success: Function, error?: Function) {

        this.makeRequest('/ajax/createfile', data, true, success, error);
    }

    // TODO: Maybe always a POST request (is much safer and can handle more data)
    private makeRequest(url: string, data: Object, isPost: boolean, success: Function, error?: Function) {
        if (data === undefined || data === null) {
            data = {};
        }
        data['projectID'] = this.projectID;

        $.ajax({
            'url': url,
            'data': data,
            'success': function (result) {
                success(result);
            },
            'error': function (jqXHR: any, textStatus: string, errorThrown: string) {
                if (error) {
                    error(jqXHR, textStatus, errorThrown);
                }
            },
            'type': (isPost ? 'POST' : 'GET')
        });
    }

    public projectID: string;
};