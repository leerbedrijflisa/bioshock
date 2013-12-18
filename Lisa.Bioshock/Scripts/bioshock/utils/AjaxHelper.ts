/// <reference path="../../typings/jquery/jquery.d.ts" />
class AjaxHelper {

    constructor(public projectID: any) {
    }

    public getFiles(data: Object, success: Function, error?: Function) {

        this.makeRequest('/test/getFiles', data, false, success, error);
    }

    public getFileContent(data: Object, success: Function, error?: Function) {

        this.makeRequest('/test/GetFileContent', data, true, success, error);
    }

    public createFile(data: Object, success: Function, error?: Function) {

        this.makeRequest('/test/CreateFile', data, false, success, error);
    }

    private makeRequest(url: string, data: Object, isPost: boolean, success: Function, error?: Function) {
        if (data === undefined) {
            data = {};
        }
        data["projectID"] = this.projectID;

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
};