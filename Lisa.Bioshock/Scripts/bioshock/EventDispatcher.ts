class EventDispatcher {
    constructor(owner: any) {
        this.owner = owner;
        this.clear();
    }

    public raise(...params: any[]) {
        for (var i in this.listeners) {
            if (this.listeners.hasOwnProperty(i)) {
                this.listeners[i].apply(this.owner, params);
            }
        }
    }

    public addListener(listener: Function) {
        this.listeners.push(listener);
    }

    public removeListener(listener: Function) {
        var idx = this.listeners.indexOf(listener);

        if (idx >= 0) {
            this.listeners.splice(idx);
        }
    }

    public clear() {
        this.listeners = [];
    }

    private owner: any;
    private listeners: Function[];
} 