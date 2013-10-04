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


    private editorKeyDown = (event) => {
        this.lastKeyDown = event.keyCode;
    }

    private editorKeyUp = (event) => {

        if (event.keyCode == 17 && this.lastKeyDown == 17) {

            $(this.editorWindowSelector).toggle();
            this.editor.refresh();
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

        $(this.editorWindowSelector).resizable({

            start: () => {

                $(this.overlaySelector).toggle();
            },
            stop: () => {

                $(this.overlaySelector).toggle();
                this.editor.refresh();
            },
            handles: 'all'
        });

        $(this.editorWindowSelector).draggable({ iframeFix: true });
        if (options.hasOwnProperty('handle')) {

            $(this.editorWindowSelector).draggable('option', 'handle', options['handle']);
        } else {

            this.registerDragHandle('h1');
        } 
    }    

    private editorWindowSelector = '#editorWindow';   
    private previewSelector = '#preview';
    private overlaySelector = '#overlay';
    private synchronizer: Synchronizer;
    private editor = undefined;    
    private lastKeyDown: number;          
}