/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts"/>
var BaseGuiController = (function () {
    function BaseGuiController(editor, options, preview) {
        if (typeof options === "undefined") { options = {}; }
        if (typeof preview === "undefined") { preview = true; }
        var _this = this;
        this.registerEditor = function (editor) {
            _this.editor = editor;
            _this.editor.on('change', function (codeMirror) {
                $.post("/Test/WriteFile", { projectID: _this.projectID, guid: _this.currentGuid, source: _this.editor.getValue() });
                _this.synchronizer.update(codeMirror.getValue());

                if (_this.$errors.is(':visible')) {
                    _this.$errors.hide();
                }
            });

            _this.editor.on('gutterClick', function (codeMirror) {
            });
        };
        this.registerDragHandle = function (handle) {
            _this.registerEditorHandlers({ handle: handle });
        };
        this.registerWindow = function (window) {
            _this.registerEditorHandlers({ window: window });
        };
        this.registerPreview = function (preview) {
            _this.registerEditorHandlers({ preview: preview });
        };
        this.registerOverlay = function (overlay) {
            _this.registerEditorHandlers({ overlay: overlay });
        };
        this.registerMenu = function (menu) {
            _this.registerEditorHandlers({ menu: menu });
        };
        this.registerEditorHandlers = function (options) {
            if (options.hasOwnProperty('preview')) {
                _this.previewSelector = options['preview'];
                _this.$preview = $(_this.previewSelector);
            }

            if (options.hasOwnProperty('overlay')) {
                _this.$overlay = $(options['overlay']);
            }

            if (options.hasOwnProperty('editor')) {
                _this.registerEditor(options['editor']);
            }

            if (options.hasOwnProperty('window')) {
                _this.$editorWindow = $(options['window']);
            }

            if (options.hasOwnProperty('menu')) {
                _this.$menuWindow = $(options['menu']);
            }

            _this.$editorWindow.resizable({
                minHeight: 52,
                minWidth: 200,
                containment: "#overlay",
                resize: function (event, ui) {
                    if (_this.isMenuActive) {
                        _this.$editorWindow.width(_this.editorWidth).height(_this.editorHeight);
                    } else {
                        _this.editorWidth = ui.size.width;
                        _this.editorHeight = ui.size.height;
                    }

                    _this.editor.refresh();
                },
                start: function () {
                    _this.isEditorDragging = true;
                    _this.toggleOverlay();
                },
                stop: function () {
                    _this.isEditorDragging = false;
                    _this.toggleOverlay();
                    _this.editor.refresh();
                },
                handles: 'all'
            }).draggable({
                iframeFix: true,
                containment: 'window'
            });

            if (options.hasOwnProperty('handle')) {
                _this.$editorWindow.draggable('option', 'handle', options['handle']);
            } else {
                _this.registerDragHandle('h1');
            }
        };
        this.editorKeyDown = function (event) {
            _this.lastKeyDown = event.keyCode;

            if (!_this.isMenuActive) {
                // Insert line above current
                if (event.ctrlKey && event.keyCode === _this.keys.ENTER) {
                    _this.insertWhitespace();
                }

                if (event.altKey) {
                    // File browser
                    if (event.keyCode === _this.keys.O) {
                        _this.createFileList();
                        _this.updateMenuState();
                        _this.openWindow = "open";
                        _this.$openFileWindow.toggle();
                        $('.filter_query').val('').focus();
                    }

                    // New file dialog
                    if (event.keyCode === _this.keys.N) {
                        _this.openWindow = "new";
                        _this.updateMenuState();
                        _this.$newFileWindow.toggle();

                        // TEMP FIX FOR IE!
                        setTimeout(function () {
                            $("#newFileName").focus();
                        }, 100);
                    }

                    // Opens file switcher
                    if (event.keyCode === _this.keys.C) {
                        var filename = $("#filename").text();
                        var id = "";
                        if (filename.indexOf(".html") > -1)
                            id = _this.lastCSS;
                        else if (filename.indexOf(".css") > -1)
                            id = _this.lastHTML;
                        $.post("/test/GetFileContent", { guid: id }, function (data) {
                            _this.currentGuid = id;
                            _this.editor.setValue(data.content);
                            $("#filename").text(data.name);
                        });
                        //this.GetFilesByContentType();
                    }

                    // Open fullscreen
                    if (event.keyCode === _this.keys.F) {
                        _this.canToggleEditor = false;
                        _this.$editorWindow.toggle();
                        var fullscreen = window.open("/home/fullscreen", "_blank");
                        fullscreen.onunload = function () {
                            _this.canToggleEditor = true;
                            _this.$editorWindow.show();
                        };
                    }
                }
            } else {
                if (event.altKey) {
                    // Close file dialog
                    if (event.keyCode === _this.keys.O && (_this.openWindow == "open")) {
                        _this.isMenuActive = false;
                        _this.$openFileWindow.toggle();
                        $('.filter_query').val('');

                        //this.applyFilter();
                        $('.nicescroll-rails').hide();
                        _this.toggleOverlay();
                        _this.isMenuAvailable = true;
                        _this.openWindow = "none";
                    }

                    // Close new file dialog if allowed
                    if (event.keyCode === _this.keys.N && (_this.openWindow == "new")) {
                        _this.isMenuActive = false;
                        _this.toggleOverlay();
                        _this.$newFileWindow.toggle();
                        _this.isMenuAvailable = true;
                        $("#newFileName").val("");
                        _this.openWindow = "none";
                    }
                }
            }
        };
        this.editorKeyUp = function (event) {
            if (!_this.isMenuActive && _this.canToggleEditor) {
                if (event.keyCode == 17 && _this.lastKeyDown == 17) {
                    _this.$editorWindow.toggle();
                    _this.editor.refresh();
                }

                if (event.keyCode == 144 && _this.lastKeyDown == 144) {
                    if (_this.ready) {
                        _this.ready = false;
                        for (var i = 0; i < _this.widgets.length; ++i) {
                            _this.editor.removeLineWidget(_this.widgets[i]);
                            _this.editor.clearGutter("Errors");
                        }
                        _this.widgets.length = 0;
                        var filename = $("#filename").text();
                        if (filename.indexOf(".html") > -1) {
                            $.get("/validate/validatehtml", { source: _this.editor.getValue() }, function (data) {
                                _this.getErrors(data);
                            }, "json");
                        } else if (filename.indexOf(".css") > -1) {
                            $.get("/validate/validatecss", { source: _this.editor.getValue() }, function (data) {
                                _this.getErrors(data);
                            }, "json");
                        }

                        _this.ready = true;
                    }
                }
            }

            if (event.keyCode === 27) {
                if (_this.isMenuAvailable) {
                    if (_this.isMenuActive) {
                        _this.isMenuActive = false;
                        _this.toggleOverlay();
                        _this.editor.focus();
                    } else {
                        _this.isMenuActive = true;
                        _this.toggleOverlay();
                    }

                    _this.$menuWindow.toggle().focus();
                }
            }
        };
        this.GetFilesByContentType = function () {
            var contentType = "";
            var filename = $("#filename").text();
            if (filename.indexOf(".html") > -1)
                contentType = "text/css";
            else if (filename.indexOf(".css") > -1)
                contentType = "text/html";
            $.get("/Test/GetFiles", { projectID: _this.projectID, contentType: contentType }, function (data) {
                var id = data[0].ID;
                $.post("/test/GetFileContent", { guid: id }, function (data) {
                    _this.currentGuid = id;
                    _this.editor.setValue(data.content);
                });
                $("#filename").text(data[0].Name);
            });
        };
        this.SetLastFile = function () {
            var filename = $("#filename").text();
            if (filename.indexOf(".html") > -1) {
                _this.lastHTML = _this.currentGuid;
                console.log("lastHTML is now: " + _this.currentGuid);
            } else if (filename.indexOf(".css") > -1) {
                _this.lastCSS = _this.currentGuid;
                console.log("lastCSS is now: " + _this.currentGuid);
            }
        };
        this.getErrors = function (data) {
            for (var i in data) {
                if (data[i].Type == 2) {
                    var msg = document.createElement("div");
                    $(msg).append(document.createTextNode(data[i].Message));
                    $(msg).addClass("lint-error");
                    $(msg).hide();
                    _this.widgets.push(_this.editor.addLineWidget(data[i].Line - 1, msg, { coverGutter: false, noHScroll: true }));

                    var marker = _this.makeMarker();
                    var handle = _this.editor.setGutterMarker(data[i].Line - 1, "Errors", marker);
                    var lineNumber = _this.editor.getLineNumber(handle);

                    $(marker).attr("data-error-line-number", lineNumber).click(function (event) {
                        var errorDivId = $(this).attr("data-error-line-number");
                        $('.error-line-number' + errorDivId).toggle();
                    });
                    $(msg).addClass("error-line-number" + lineNumber);
                }
            }

            if (_this.widgets.length == 0) {
                $(_this.errorCount).text('Geen');
            } else {
                $(_this.errorCount).text(_this.widgets.length);
            }
            _this.$errors.show();
        };
        this.applyFilter = function () {
            var filter = $('#openFileWindow .filter_query').val();
            _this.showFilterResults(filter);
        };
        this.createFileList = function () {
            var fileList = $('#file_list');
            _this.files = [];
            fileList.empty();

            $.get("/test/getFiles", { projectID: _this.projectID }, function (data) {
                fileList.append('<div class="folder"><span class="folder_name">/</span><ul></ul><div class="clear"></div></div>');
                for (var i = data.length - 1; i >= 0; i--) {
                    var item = data[i];

                    if (item.Type == "File") {
                        var ul = $('#file_list .folder ul:last');
                        ul.append('<li><a><img src="/Content/Images/item.png" alt=""><span>' + item.Name + '</span></a></li>');
                        _this.files.push(item);

                        data.splice(i, 1);
                    }
                }

                for (i = 0; i < data.length; i++) {
                    _this.generateFolderTree(data[i], fileList);
                }
            });
        };
        this.generateFolderTree = function (item, fileList) {
            fileList.append('<div class="folder"><span class="folder_name">' + item.FullPath.replace('/root', '') + '</span><ul></ul><div class="clear"></div></div>');

            for (var i = item.Subs.length - 1; i >= 0; i--) {
                var sub = item.Subs[i];
                if (sub.Type == "File") {
                    var ul = $('#file_list .folder ul:last');
                    ul.append('<li><a><img src="/Content/Images/item.png" alt=""><span>' + sub.Name + '</span></a></li>');
                    _this.files.push(sub);

                    item.Subs.splice(i, 1);
                }
            }

            for (var i = 0; i < item.Subs.length; i++) {
                var sub = item.Subs[i];
                _this.generateFolderTree(sub, fileList);
            }
        };
        this.showFilterResults = function (filter) {
            var block = $('#block .highlights');
            $('#block .highlights ul').remove();

            if (filter.length > 0) {
                block.append('<ul></ul>');
                var li = $('#block .highlights ul');

                for (var i = 0; i < _this.files.length; i++) {
                    var file = _this.files[i];
                    if (file.Name.search(filter) > -1 || file.FullPath.search(filter) > -1) {
                        li.prepend('<li><a href="javascript:void(0);" data-id="' + file.ID + '"><img src="/Content/Images/filter_item_logo.png" alt=""><span>' + file.Name + '</span></a></li>');
                    }
                }

                li.find("a").click(function (event) {
                    var id = $(event.currentTarget).attr("data-id");

                    $.post("/test/GetFileContent", { projectID: _this.projectID, guid: id }, function (data) {
                        _this.currentGuid = id;
                        _this.editor.setValue(data.content);
                        _this.isMenuActive = false;
                        _this.toggleOverlay();
                        _this.$openFileWindow.toggle();
                        $('.filter_query').val('');
                        _this.isMenuAvailable = true;
                        $("#filename").text(data.name);
                        _this.SetLastFile();
                        _this.editor.focus();
                    });
                });
            }
        };
        this.openStartUpFile = function () {
            $.post("/Test/OpenStartUpFile", { projectID: _this.projectID }, function (data) {
                _this.currentGuid = data.id;
                $("#filename").text(data.name);
                _this.SetLastFile();
                _this.editor.setValue(data.content);
                _this.editor.focus();
            });
        };
        this.registerEvents = function () {
            //$(this.addButton).bind("click", this.createFile);
            //$("#newFileName").bind("keydown", (event) => {
            //    if (event.keyCode == 13) {
            //        this.createFile();
            //        return false;
            //    }
            //});
        };
        this.createFile = function () {
            var fileName = $("#newFileName").val();
            if (fileName.endsWith(".css") || fileName.endsWith(".html")) {
                $.get("/test/CreateFile", { projectID: _this.projectID, filename: fileName }, function (data) {
                    if (data.Result) {
                        _this.currentGuid = data.ID;
                        _this.createFileList();
                        _this.isMenuActive = false;
                        _this.toggleOverlay();
                        _this.$newFileWindow.toggle();
                        _this.isMenuAvailable = true;
                        _this.editor.setValue("");
                        $("#filename").text(fileName);

                        _this.editor.focus();
                    }
                });
            } else {
                $("#newFileName").tooltip({ content: "Kan geen bestand maken zonder extensie" });
                $("#newFileName").tooltip("option", "show", { effect: "blind", duration: 700 });
                $("#newFileName").tooltip("open");
            }
        };
        this.keys = {
            ENTER: 13,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79
        };
        this.$overlay = $('#overlay');
        this.$editorWindow = $('#editorWindow');
        this.$preview = $('#preview');
        this.$menuWindow = $('#editorMenuWindow');
        this.$openFileWindow = $('#openFileWindow');
        this.$newFileWindow = $('#newFileWindow');
        this.$errors = $('#errors');
        this.previewSelector = '#preview';
        this.errorCount = '#errorcount';
        this.addButton = '#addButton';
        this.isMenuActive = false;
        this.isMenuAvailable = true;
        this.isEditorDragging = false;
        this.canToggleEditor = true;
        this.openWindow = "";
        this.lastHTML = "";
        this.lastCSS = "";
        this.currentGuid = "";
        this.files = [];
        this.widgets = [];
        this.ready = true;
        this.registerSynchronizeHandlers();
        this.registerEditorHandlers(options);
        this.registerKeyHandlers();
        this.registerEvents();
        this.projectID = $("#ProjectID").val();

        //this.initFilesView();
        if (preview) {
            this.registerPreviewHandlers();
        }
    }
    BaseGuiController.prototype.registerPreviewHandlers = function () {
        var iframe = this.$preview[0];
        $(iframe.contentWindow).keydown(this.editorKeyDown).keyup(this.editorKeyUp);
    };

    BaseGuiController.prototype.insertWhitespace = function () {
        var lineNumber = this.editor.getCursor().line;
        var lineText = this.editor.getLineHandle(lineNumber).text;

        this.editor.setLine(lineNumber, "\n" + lineText);
        this.editor.setCursor(lineNumber);
    };
    BaseGuiController.prototype.updateMenuState = function () {
        this.isMenuActive = true;
        this.toggleOverlay();
        this.isMenuAvailable = false;
    };

    BaseGuiController.prototype.canExecuteAction = function () {
        return (!this.isMenuActive && this.canToggleEditor);
    };

    BaseGuiController.prototype.initFilesView = function () {
        $('#filter').submit(function () {
            var $ul = $('#block .highlights ul');
            var $children = $ul.children("li");

            if ($children.length > 0) {
                var $a = $children.first().find("a");
                $a.click();
            }

            $('.filter_query').focus();
            return false;
        });

        $('#openFileWindow .filter_query').keyup(this.applyFilter);
        this.createFileList();
        var scrollbar = $("#file_list");
        scrollbar.niceScroll({ touchbehavior: false, cursorcolor: "#fff", cursoropacitymax: 1, cursorwidth: 16, cursorborder: false, cursorborderradius: false, background: "#121012", autohidemode: false, railpadding: { top: 2, right: 2, bottom: 2 } }).cursor.css({ "background": "#FF4200" });
        $('.nicescroll-rails').show({
            complete: function () {
                var scroll = $("#file_list");
                scroll.getNiceScroll().resize();
            }
        });
    };

    BaseGuiController.prototype.registerKeyHandlers = function () {
        $(window).keydown(this.editorKeyDown);
        $(window).keyup(this.editorKeyUp);
    };

    BaseGuiController.prototype.registerSynchronizeHandlers = function () {
        var _this = this;
        this.synchronizer = new Synchronizer(this.previewSelector);
        this.synchronizer.start(function () {
            _this.synchronizer.update(_this.editor.getValue());
        });
    };

    BaseGuiController.prototype.makeMarker = function () {
        var errorMarker = document.createElement("div");
        $(errorMarker).click(function (event) {
        });
        errorMarker.innerHTML = "<img style='cursor: pointer; width:10px; margin-left:15px; margin-bottom:1px;' src='/Content/Images/ErrorIcon.png'/>";
        return errorMarker;
    };

    BaseGuiController.prototype.toggleOverlay = function () {
        if (this.isMenuActive) {
            this.$overlay.css({
                'background-color': 'black',
                'opacity': '0.65',
                'z-index': '499'
            });
        } else {
            this.$overlay.css({
                'background-color': '',
                'opacity': '1',
                'z-index': '0'
            });
        }

        if (this.isMenuActive || this.isEditorDragging) {
            $('#overlay').show();
        } else {
            $('#overlay').hide();
        }
    };
    return BaseGuiController;
})();
//# sourceMappingURL=BaseGuiController.js.map
