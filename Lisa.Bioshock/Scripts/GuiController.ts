/// <reference path="typings/jquery/jquery.d.ts" />
class GuiController {

    /**
     * Creates a new GuiController
     *
     * @constructor
     * @param {object} options - Options used for initializing the GuiController.
     */
    constructor(editor:any, options = {}) {

        this.registerEditorHandlers(options);
        this.registerKeyHandlers();        
        this.registerSynchronizeHandlers();
    }    

    /**
     * Registers the editor on which the change event should be handled
     * 
     * @param {*} editor - The editor (CodeMirror).
     */
    public registerEditor = (editor: any) => {
        this.editor = editor;        
        this.editor.on('change', (codeMirror) => {

            this.synchronizer.update(codeMirror.getValue());
        });
    }

    /**
     * Registers the drag handle
     * 
     * @param {string} handle - The selector to get the drag handle.
     */
    public registerDragHandle = (handle:string) => {

        this.registerEditorHandlers({ handle: handle });
    }

    /**
     * Registers the element that will be used to identify the editors window
     * 
     * @param {string} window - The selector used to get the window.
     */
    public registerWindow = (window: string) => {

        this.registerEditorHandlers({ window: window });
    }

    /**
     * Registers the element that will be used to identify the preview
     * 
     * @param {string} preview - The selector used to get the preview.
     */
    public registerPreview = (preview: string) => {

        this.registerEditorHandlers({ preview: preview });
    }

    /**
     * Registers the element that will be used to identify the overlay
     * 
     * @param {string} overlay - The selector used to get the overlay.
     */
    public registerOverlay = (overlay: string) => {

        this.registerEditorHandlers({ overlay: overlay });
    }

    /**
     * Registers the element that will be used to identify the (escape) menu
     * 
     * @param {string} overlay - The selector used to get the menu.
     */
    public registerMenu = (menu: string) => {

        this.registerEditorHandlers({ menu: menu });
    }

    private editorKeyDown = (event) => {
        this.lastKeyDown = event.keyCode;

        if (!this.isMenuActive) {

            if (event.ctrlKey && event.keyCode == 13) {

                var lineNumber = this.editor.getCursor().line;
                var lineText = this.editor.getLineHandle(lineNumber).text;

                this.editor.setLine(lineNumber, "\n" + lineText);
                this.editor.setCursor(lineNumber);
            }
        }
    }

    private editorKeyUp = (event) => {

        if (!this.isMenuActive) {

            if (event.keyCode == 17 && this.lastKeyDown == 17) {

                $(this.editorWindowSelector).toggle();
                this.editor.refresh();
            }
        }

        if (event.keyCode === 27) {

            if (this.isMenuActive) {

                this.isMenuActive = false;
                this.toggleOverlay();
                this.editor.focus();
            } else {

                this.isMenuActive = true;
                this.toggleOverlay();
            }

            $(this.menuWindowSelector).toggle().focus();
            
        }
    }

    private registerKeyHandlers() {

        $(window).keydown(this.editorKeyDown);
        $(window).keyup(this.editorKeyUp);
        
        var iframe: any = $(this.previewSelector)[0];
        $(iframe.contentWindow).keydown(this.editorKeyDown);
        $(iframe.contentWindow).keyup(this.editorKeyUp);
    }

    private registerSynchronizeHandlers() {

        this.synchronizer = new Synchronizer(this.previewSelector);
        this.synchronizer.start(() => {

            this.synchronizer.update(this.editor.getValue());
        });
    }

    private registerEditorHandlers(options:Object) {

        if (options.hasOwnProperty('preview')) {

            this.previewSelector = options['preview'];
        }

        if (options.hasOwnProperty('overlay')) {

            this.overlaySelector = options['overlay'];
        }

        if (options.hasOwnProperty('editor')) {

            this.registerEditor(options['editor']);
        }

        if (options.hasOwnProperty('window')) {

            this.editorWindowSelector = options['window'];
        }

        if (options.hasOwnProperty('menu')) {

            this.menuWindowSelector = options['menu'];
        }

        $(this.editorWindowSelector).resizable({

            minHeight: 52,
            minWidth: 200,  
            containment: "#overlay",
            resize: (event, ui) => {
                
                
                if (this.isMenuActive) {


                    $(this.editorWindowSelector).width(this.editorWidth);
                    $(this.editorWindowSelector).height(this.editorHeight);
                }
                else {
                    this.editorWidth = ui.size.width;
                    this.editorHeight = ui.size.height;
                    
                }
                this.editor.refresh();
                
            },

            start: () => {

                this.isEditorDragging = true;
                this.toggleOverlay();
            },
            stop: () => {

                this.isEditorDragging = false;
                this.toggleOverlay();
                this.editor.refresh();
            },
            handles: 'all'
        });

        $(this.editorWindowSelector).draggable({

            iframeFix: true,
            containment: "window"
        });
        if (options.hasOwnProperty('handle')) {

            $(this.editorWindowSelector).draggable('option', 'handle', options['handle']);
        } else {

            this.registerDragHandle('h1');
        } 
    }

    private toggleOverlay() {

        if (this.isMenuActive) {

            $(this.overlaySelector).css({
                'background-color': 'black',
                'opacity': '0.65',
                'z-index': '499'
            });
        } else {

            $(this.overlaySelector).css({
                'background-color': '',
                'opacity': '1',
                'z-index': '0'
            });
        }

        if (this.isMenuActive || this.isEditorDragging) {
            $('#overlay').show();
        }
        else {
            $('#overlay').hide();
        }

    }    

    private editorWindowSelector = '#editorWindow';   
    private previewSelector = '#preview';
    private overlaySelector = '#overlay';
    private menuWindowSelector = '#editorMenuWindow';
    private editorWidth;
    private editorHeight;
    private isMenuActive = false;
    private isEditorDragging = false;
    private synchronizer: Synchronizer;
    private editor = undefined;    
    private lastKeyDown: number;          
}