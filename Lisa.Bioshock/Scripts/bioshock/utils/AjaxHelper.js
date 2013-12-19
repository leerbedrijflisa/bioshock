/// <reference path="../../typings/jquery/jquery.d.ts" />
var AjaxHelper = (function () {
    function AjaxHelper(projectID) {
        this.projectID = projectID;
    }
    AjaxHelper.prototype.getFiles = function (data, success, error) {
        this.makeRequest('/ajax/getfiles', data, true, success, error);
    };

    AjaxHelper.prototype.getFileContents = function (fileID, success, error) {
        this.makeRequest('/ajax/getfilecontents', { fileID: fileID }, true, success, error);
    };

    AjaxHelper.prototype.createFile = function (data, success, error) {
        this.makeRequest('/ajax/createfile', data, false, success, error);
    };

    // TODO: Maybe always a POST request (is much safer and can handle more data)
    AjaxHelper.prototype.makeRequest = function (url, data, isPost, success, error) {
        if (data === undefined) {
            data = {};
        }
        data['projectID'] = this.projectID;

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
