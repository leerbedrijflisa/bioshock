var AjaxHelper = (function () {
    /**
    * Creates a new instance of the AjaxHelper.
    *
    * @param {string} projectID - This ID will be used for ajax requests.
    */
    function AjaxHelper(projectID) {
        this.projectID = projectID;
    }
    /**
    * Make an ajax request to get all the files within the current project.
    *
    * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
    * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
    */
    AjaxHelper.prototype.getFiles = function (success, error) {
        this.makeRequest('/ajax/getfiles', null, true, success, error);
    };

    /**
    * Make an ajax request to get the contents of a file (within the current project).
    *
    * @param {string} fileID - The ID of the file.
    * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
    * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
    */
    AjaxHelper.prototype.getFileContents = function (fileID, success, error) {
        this.makeRequest('/ajax/getfilecontents', { fileID: fileID }, true, success, error);
    };

    /**
    * Make an ajax request to create a new file within the current project.
    *
    * @param {Object} data - An object with key/value pairs that will be send with the request.
    * @param {Function} success - This handler will be triggered after the ajax request returns the status code 200 OK.
    * @param {Function} error? - When given, this handler will be triggered when any errors occurs in the ajax request.
    */
    AjaxHelper.prototype.createFile = function (data, success, error) {
        this.makeRequest('/ajax/createfile', data, true, success, error);
    };

    /** The actual request. */
    AjaxHelper.prototype.makeRequest = function (url, data, isPost, success, error) {
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
