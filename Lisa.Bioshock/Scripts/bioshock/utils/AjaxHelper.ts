/// <reference path="../../typings/jquery/jquery.d.ts" />
class AjaxHelper {

    public getFiles(success: Function, error?: Function) {
        $.ajax({
            url: '/test/getFiles',
            data: {
                projectID: Workspace.instance.projectID
            },
            success: function (data) {
                success(data);
            },
            error: function (jqXHR: any, textStatus: string, errorThrown: string) {
                if (error) {
                    error(jqXHR, textStatus, errorThrown);
                }
            }
        });
    }
};