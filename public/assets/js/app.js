$(document).ready(function () {
    //For advance search options
    $('#advbutton').on('click', function (e) {
        var style = $('#advance').toggle();
    });
    // for Sidebar
    $('.main-menu').on('click', 'a', function (e) {
        var parents = $(this).parents('li');
        var li = $(this).closest('li.dropdown');
        var another_items = $('.main-menu li').not(parents);
        another_items.find('a').removeClass('active');
        another_items.find('a').removeClass('active-parent');
        if ($(this).hasClass('dropdown-toggle') || $(this).closest('li').find('ul').length == 0) {
            $(this).addClass('active-parent');
            var current = $(this).next();
            if (current.is(':visible')) {
                li.find("ul.dropdown-menu").slideUp('fast');
                li.find("ul.dropdown-menu a").removeClass('active')
            }
            else {
                another_items.find("ul.dropdown-menu").slideUp('fast');
                current.slideDown('fast');
            }
        }
        else {
            if (li.find('a.dropdown-toggle').hasClass('active-parent')) {
                var pre = $(this).closest('ul.dropdown-menu');
                pre.find("li.dropdown").not($(this).closest('li')).find('ul.dropdown-menu').slideUp('fast');
            }
        }
        if ($(this).hasClass('active') == false) {
            $(this).parents("ul.dropdown-menu").find('a').removeClass('active');
            $(this).addClass('active')
        }
        if ($(this).attr('href') == '#') {
            e.preventDefault();
        }
    });

    //for Expand and Collapse
    $('#content').on('click','.header-icon', function(e){
       var button = $(this).find('i');
        var parent = $(this).parent('div').parent('div').parent('div').parent('div');
        if(button.hasClass('fa-chevron-up')){
            var content = parent.find('.panel-body');
            var footer = parent.find('.panel-footer');
            content.slideToggle('fast');
            footer.slideToggle('fast');
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        }else{
            var content = parent.find('.panel-body');
            var footer = parent.find('.panel-footer');
            content.slideToggle('fast');
            footer.slideToggle('fast');
            button.toggleClass('fa-chevron-down').toggleClass('fa-chevron-up');
        }

    });

});