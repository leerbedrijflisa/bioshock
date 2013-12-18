/// <reference path="../../typings/jquery/jquery.d.ts" />
var AjaxHelper = (function () {
    function AjaxHelper() {
    }
    AjaxHelper.prototype.getFiles = function (success, error) {
        $.ajax({
            url: '/test/getFiles',
            data: {
                projectID: Workspace.instance.projectID
            },
            success: function (data) {
                success(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (error) {
                    error(jqXHR, textStatus, errorThrown);
                }
            }
        });
    };
    return AjaxHelper;
})();
;
//# sourceMappingURL=AjaxHelper.js.map
