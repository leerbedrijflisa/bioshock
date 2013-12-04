/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="BaseGuiController.ts" />
class FullScreenGuiController extends BaseGuiController {

    constructor(editor: any, options = {}) {
        super(editor, options, false);
    }
}