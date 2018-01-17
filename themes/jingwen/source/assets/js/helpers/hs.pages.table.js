/*
 * This plug-in adds another pagination option similar to `full_numbers`, except
 * it adds ellipses around the page numbers when applicable. You can set how
 * many page numbers should be displayed with the iShowPages option.
 *
 * This plug- in extends the oStdClasses object with the following properties:
 * sPageEllipsis, sPageNumber and sPageNumbers.
 *
 * It also extends the oSettings object with the following properties:
 * _iShowPages, _iShowPagesHalf, _iCurrentPage, _iTotalPages, _iFirstPage and
 * _iLastPage.
 *
 * Note that DataTables 1.10 has this ability built in. As such, this plug-ins
 * has been marked as deprecated, but may still be useful for if you are using
 * an old version of DataTables.
 *
 * @name Ellipses
 * @summary Show ellipses in the pagination control where there is a gap in numbers
 * @deprecated
 * @author [Dave Kennedy](http://daveden.wordpress.com/)
 * @example
 *     $(document).ready(function() {
 *         $('#example').dataTable({
 *             'sPaginationType': 'ellipses'
 *         });
 *     });
 */

$.extend($.fn.dataTableExt.oStdClasses, {
    'sPageEllipsis': 'paginate_ellipsis',
    'sPageNumber': 'paginate_number',
    'sPageNumbers': 'paginate_numbers'
});


/// 上一页 Elemnt 生成代码
function PreviousConMethod(){

  var resString = '\
              <li class="list-inline-item float-sm-left">\
                <a class="u-pagination-v1__item u-pagination-v1-4 g-rounded-50 g-pa-7-16" href="#" aria-label="Previous">\
                  <span aria-hidden="true">\
                    <i class="fa fa-angle-left g-mr-5"></i>\
                    上一页\
                  </span>\
                  <span class="sr-only">Previous</span>\
                </a>\
              </li>';

              return resString;
};

/// 上一页 Elemnt 生成代码
function NextConMethod(){

  var resString = '\
                <li class="list-inline-item float-sm-right">\
                  <a class="u-pagination-v1__item u-pagination-v1-4 g-rounded-50 g-pa-7-16" href="#" aria-label="Next">\
                    <span aria-hidden="true">\
                      下一页\
                      <i class="fa fa-angle-right g-ml-5"></i>\
                    </span>\
                    <span class="sr-only">Next</span>\
                  </a>\
                </li>\
                ';

              return resString;
};

/// 上一页 Elemnt 生成代码
function NormalNumberConMethod(number){

  var resString = '\
              <li class="list-inline-item g-hidden-sm-down hidden-all-list-li-link-elment">\
                <a class="u-pagination-v1__item u-pagination-v1-4 g-rounded-50 g-pa-7-14" href="#">'+number+'</a>\
              </li>';

              return resString;
};

function EllipsisConMethod(){

    var resString = '\
        <li class="list-inline-item g-hidden-sm-down hidden-all-list-li-link-elment">\
          <a class="g-pa-7-14">...</a>\
        </li>\
    ';

    return resString;
}

$.fn.dataTableExt.oPagination.cutsomPage = {
    'oDefaults': {
        'iShowPages': 3
    },
    'fnClickHandler': function(e) {
        var fnCallbackDraw = e.data.fnCallbackDraw,
            oSettings = e.data.oSettings,
            sPage = e.data.sPage;

        if ($(this).is('[disabled]')) {
            return false;
        }

        oSettings.oApi._fnPageChange(oSettings, sPage);
        fnCallbackDraw(oSettings);

        return true;
    },
    // fnInit is called once for each instance of pager
    'fnInit': function(oSettings, nPager, fnCallbackDraw) {
        var oClasses = oSettings.oClasses,
            oLang = oSettings.oLanguage.oPaginate,
            that = this;

        var iShowPages = oSettings.oInit.iShowPages || this.oDefaults.iShowPages,
            iShowPagesHalf = Math.floor(iShowPages / 2);

        $.extend(oSettings, {
            _iShowPages: iShowPages,
            _iShowPagesHalf: iShowPagesHalf,
        });

        var oPrevious = $(PreviousConMethod()),
            oNext = $(NextConMethod());

        oPrevious.click({ 'fnCallbackDraw': fnCallbackDraw, 'oSettings': oSettings, 'sPage': 'previous' }, that.fnClickHandler);
        oNext.click({ 'fnCallbackDraw': fnCallbackDraw, 'oSettings': oSettings, 'sPage': 'next' }, that.fnClickHandler);

        $(nPager).append($('<nav class="text-center searchpage" aria-label="Page Navigation"><ul class="list-inline"></ul></nav>'));

        // Draw
        $(nPager).find("ul:eq(0)").append(oPrevious, oNext);
    },
    // fnUpdate is only called once while table is rendered
    'fnUpdate': function(oSettings, fnCallbackDraw) {
        var oClasses = oSettings.oClasses,
            that = this;

        var tableWrapper = oSettings.nTableWrapper;

        // Update stateful properties
        this.fnUpdateState(oSettings);

        if (oSettings._iCurrentPage === 1) {
            $('#searchdownview a[aria-label="Previous"]').addClass("u-pagination-v1__item--disabled");
        } else {
            $('#searchdownview a[aria-label="Previous"]').removeClass("u-pagination-v1__item--disabled");
        }

        if (oSettings._iTotalPages === 0 || oSettings._iCurrentPage === oSettings._iTotalPages) {
            $('#searchdownview a[aria-label="Next"]').addClass("u-pagination-v1__item--disabled");
        } else {
            $('#searchdownview a[aria-label="Next"]').removeClass("u-pagination-v1__item--disabled");
        }

        var i, oNumber, oNumbers = $("#searchdownview ul[class='list-inline']");

        $(".hidden-all-list-li-link-elment").remove();

        for (i = oSettings._iFirstPage; i <= oSettings._iLastPage; i++) {

          oNumber = $(NormalNumberConMethod(oSettings.fnFormatNumber(i)));

            if (oSettings._iCurrentPage === i) {

                oNumber.find("a:eq(0)").addClass("g-rounded-50");

                oNumber.find("a:eq(0)").addClass("u-pagination-v1-4--active");

            } else {
                oNumber.click({ 'fnCallbackDraw': fnCallbackDraw, 'oSettings': oSettings, 'sPage': i - 1 }, that.fnClickHandler);
            }

            // Draw
            oNumbers.append(oNumber);
        }

        // Add ellipses
        if (1 < oSettings._iFirstPage) {
            oNumbers.prepend(EllipsisConMethod());
        }

        if (oSettings._iLastPage < oSettings._iTotalPages) {
            oNumbers.append(EllipsisConMethod());
        }
    },
    // fnUpdateState used to be part of fnUpdate
    // The reason for moving is so we can access current state info before fnUpdate is called
    'fnUpdateState': function(oSettings) {
        var iCurrentPage = Math.ceil((oSettings._iDisplayStart + 1) / oSettings._iDisplayLength),
            iTotalPages = Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength),
            iFirstPage = iCurrentPage - oSettings._iShowPagesHalf,
            iLastPage = iCurrentPage + oSettings._iShowPagesHalf;

        if (iTotalPages < oSettings._iShowPages) {
            iFirstPage = 1;
            iLastPage = iTotalPages;
        } else if (iFirstPage < 1) {
            iFirstPage = 1;
            iLastPage = oSettings._iShowPages;
        } else if (iLastPage > iTotalPages) {
            iFirstPage = (iTotalPages - oSettings._iShowPages) + 1;
            iLastPage = iTotalPages;
        }

        $.extend(oSettings, {
            _iCurrentPage: iCurrentPage,
            _iTotalPages: iTotalPages,
            _iFirstPage: iFirstPage,
            _iLastPage: iLastPage
        });
    }
};
