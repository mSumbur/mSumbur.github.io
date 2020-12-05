// ui-search 定义
$.fn.UiSearch = function() {
    var ui = $(this)

    $('.ui-search-selected', ui).on('click', function() {
        $('.ui-search-select-list').show()
        return false
    })

    $('.ui-search-select-list a', ui).on('click', function() {
        $('.ui-search-selected').text($(this).text())
        $('.ui-search-select-list').hide()
        return false
    })

    $('body').on('click', function() {
        $('.ui-search-select-list').hide()
    })
}

/**
 * ui-tab
 * @param {string} header tab 组件的选项卡切换部分 className
 * @param {string} content tab 组件的内容部分 className
 */
$.fn.UiTab = function(header, content) {
    var ui = $(this)
    var tabs = $(header, ui)
    var contents = $(content, ui)

    tabs.on('click', function() {
        var index = $(this).index()
        tabs.removeClass('item_focus').eq(index).addClass('item_focus')
        contents.hide().eq(index).show()
        console.log(index)
        return false
    })
}

// 返回顶部
$.fn.UiBackUp = function() {
    var ui = $(this)
    var el = $('<a href="javascript:;" class="ui-back-top"></a>')
    ui.append(el)

    var windowHeight = $(window).height()
    $(window).on('scroll', function() {
        var top = $('html, body').scrollTop()
        console.log(top, "   ", windowHeight)
        if (top > windowHeight) {
            el.show()
        } else {
            el.hide()
        }
    })

    el.on('click', function() {
        $(window).scrollTop(0)
    })
}

// ui-slider
$.fn.UiSlider = function() {
    var ui = $(this)
    var item = $('.ui-slider-wrap .item', ui)
    var btn_prev = $('.ui-slider-arrow .left', ui)
    var btn_next = $('.ui-slider-arrow .right', ui)
    var process = $('.ui-slider-process .item', ui)

    btn_prev.on('click', function() {

    })
}

// 页面的脚本逻辑
$(function() {
    $('.ui-search').UiSearch()

    $('.content-tab').UiTab('.caption > .item', '.block > .item')

    $('.content-tab .block .item').UiTab('.block-caption-item', '.block-content')

    $('body').UiBackUp()

    $('.ui-slider').UiSlider()
})