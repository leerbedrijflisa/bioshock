class ErrorUtil {
    /**
     * Configures the error handler for any SignalR error that occured on the server.
     * 
     * Example: Configures the handlers for the server methods of the demoHub.
     * var hub = $.connection.demoHub;   
     * ErrorUtil.configureSignalR(hub.server);
     *
     * @param {T} signalrHubProxy - The proxyHub for which to configure the error handler(s).
     */
    public static configureSignalR<T>(signalrHubProxy: T) {
        for (var x in signalrHubProxy) {
            if (signalrHubProxy.hasOwnProperty(x) && $.isFunction(signalrHubProxy[x])) {
                var proxy: Function = signalrHubProxy[x];

                signalrHubProxy[x] = () => {
                    var method: Function = signalrHubProxy[x];
                    var deferred: JQueryDeferred<any> = proxy.apply(method.caller, method.arguments);

                    if (deferred) {
                        deferred.fail(ErrorUtil.onSignalRFail);
                    }
                };
            }
        }
    }

    /**
     * Shows the toast for the AJAX request error with the given message as it's error message.
     *
     * @param {string} message - The message to show as error.
     */
    public static ajaxError(message: string) {
        ErrorUtil.triggerToast(message);
    }

    /**
     * Shows the toast with the specified message as the error
     *
     * @param {string} message - The message to show as error.
     */
    public static triggerToast(message: string) {
        message = message || "An unknown error occurred.";
        $('.error-toast')
            .text(message)
            .fadeIn(400)
            .delay(3000)
            .fadeOut(400);
    }

    private static onSignalRFail(error: string) {
        ErrorUtil.triggerToast(error);
    }
} 