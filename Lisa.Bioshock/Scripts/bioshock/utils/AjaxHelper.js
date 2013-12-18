/// <reference path="../../typings/jquery/jquery.d.ts" />
var AjaxHelper = (function () {
    function AjaxHelper(projectID) {
        this.projectID = projectID;
    }
    AjaxHelper.prototype.getFiles = function (data, success, error) {
        if (data === undefined) {
            data = {};
        }
        data['projectID'] = this.projectID;

        this.makeRequest('/test/getFiles', data, false, success, error);
    };

    AjaxHelper.prototype.getFileContent = function (data, success, error) {
        if (data === undefined) {
            data = {};
        }
        data['projectID'] = this.projectID;

        this.makeRequest('/test/GetFileContent', data, true, success, error);
    };

    AjaxHelper.prototype.makeRequest = function (url, data, isPost, success, error) {
        $.ajax({
            'url': url,
            'data': data,
            'success': function (result) {
                success(result);
            },
            'error': function (jqXHR, textStatus, errorThrown) {
                if (error) {
                    error(jqXHR, textStatus, errorThrown);
                }
            },
            'type': (isPost ? 'POST' : 'GET')
        });
    };
    return AjaxHelper;
})();
;
//# sourceMappingURL=AjaxHelper.js.map
