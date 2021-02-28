$(document).ready(function () {
    function LoadTheme() {
        var theme = '/assets/css/theme-1.css';

        if (typeof GetCookie === "function") {
            theme = GetCookie('theme_demo');
        }
        if (!theme) {
            theme = '/assets/css/theme-1.css';
            if (typeof SetCookie === "function") {
                SetCookie('theme_demo', theme, 1);
            }
        }

        $('#theme-style').attr('href', theme);
        $('#color-options li.active').removeClass('active');

        var $listItem = $('#color-options li a[data-style="' + theme + "']");
        $listItem.closest('li').addClass('active');

    }
    LoadTheme();

    /* ======= DEMO THEME CONFIG ====== */
    $(document).on('click', '#config-trigger', function (e) {

        e.preventDefault();

        //$("#config-panel").toggleClass('config-panel-open');

        if ($(this).hasClass('config-panel-open')) {
            $("#config-panel").animate({
                right: "-=190" //same as the panel width
            }, 500);
            $(this).removeClass('config-panel-open').addClass('config-panel-hide');
        }
        else {
            $("#config-panel").animate({
                right: "+=190" //same as the panel width
            }, 500);
            $(this).removeClass('config-panel-hide').addClass('config-panel-open');
        }
    });

    $(document).on('click', '#config-close', function (e) {
        e.preventDefault();
        $('#config-trigger').click();
    });


    $(document).on('click', '#color-options a', function (e) {
        e.preventDefault();
        var $styleSheet = $(this).attr('data-style');

        $('#theme-style').attr('href', $styleSheet);

        var $listItem = $(this).closest('li');
        $listItem.addClass('active');
        $listItem.siblings().removeClass('active');
        if (typeof SetCookie === "function") {
            SetCookie('theme_demo', $styleSheet, 1);
        }
    });

});