class CodeMirrorEditor {

    public generateErrors(data: any, editor: CodeMirror.Editor): CodeMirror.LineWidget[] {
        var widgets: CodeMirror.LineWidget[] = [];

        for (var i in data) {

            if (data[i].Type == 2) {

                var msg = document.createElement('div');
                $(msg).append(document.createTextNode(data[i].Message))
                    .addClass('lint-error')
                    .hide();

                var widget = editor.addLineWidget(data[i].Line - 1, msg, {
                    above: false,
                    coverGutter: false,
                    noHScroll: true,
                    showIfHidden: true
                });

                widgets.push(widget);

                var marker = this.generateMarker();
                var handle = editor.setGutterMarker(data[i].Line - 1, "Errors", marker);
                var lineNumber = editor.getDoc().getLineNumber(handle);

                $(marker).attr('data-error-line-number', lineNumber)
                    .click(function () {

                        var errorDivId = $(this).attr('data-error-line-number');
                        $('.error-line-number' + errorDivId).toggle();
                    });

                $(msg).addClass('error-line-number' + lineNumber);
            }
        }
        
        return widgets;
    }

    private generateMarker(): HTMLElement {
        var marker = document.createElement('div');
        $(marker).html("<img style='cursor: pointer; width:10px; margin-left:15px; margin-bottom:1px;' src='/Content/Images/ErrorIcon.png'/>");

        return marker;
    }
} 