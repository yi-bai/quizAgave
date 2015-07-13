/* Common app functionality */

var app = (function () {
    "use strict";

    var app = {};

    // Common initialization function (to be called from each page)
    app.initialize = function () {
        app.jumpPage = function () {
            var quiz_id = Office.context.document.settings.get('quiz_id');
            var activeView;
            Office.context.document.getActiveViewAsync(function (result) {
                activeView = result.value;
                if ((typeof quiz_id != 'string' || quiz_id == 'local') && activeView == 'edit') location.href('create.html');
                else if (typeof quiz_id == 'string' && activeView == 'edit') location.href('result.html');
                else if (typeof quiz_id != 'string' && activeView != 'edit') location.href('notice.html');
                else if (typeof quiz_id == 'string' && activeView != 'edit') location.href('answer.html');
            });
        }

        $('body').append(
            '<div id="notification-message">' +
                '<div class="padding">' +
                    '<div id="notification-message-close"></div>' +
                    '<div id="notification-message-header"></div>' +
                    '<div id="notification-message-body"></div>' +
                '</div>' +
            '</div>');

        $('#notification-message-close').click(function () {
            $('#notification-message').hide();
        });


        // After initialization, expose a common notification function
        app.showNotification = function (header, text) {
            $('#notification-message-header').text(header);
            $('#notification-message-body').text(text);
            $('#notification-message').slideDown('fast');
        };
    };

    return app;
})();

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            if(reason == 'inserted') app.jumpPage();
            Office.context.document.addHandlerAsync(Office.EventType.ActiveViewChanged, app.jumpPage);
            task();
        });
    };

})();