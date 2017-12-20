function paginatorHelper(options) {
  options = options || {};

  var current = options.current || this.page.current || 0;
  var total = options.total || this.page.total || 1;
  var endSize = options.hasOwnProperty('end_size') ? +options.end_size : 1;
  var midSize = options.hasOwnProperty('mid_size') ? +options.mid_size : 2;
  var space = options.hasOwnProperty('space') ? options.space : '&hellip;';
  var base = options.base || this.page.base || '';
  var format = options.format || this.config.pagination_dir + '/%d/';
  var prevText = options.prev_text || 'Prev';
  var nextText = options.next_text || 'Next';
  var prevNext = options.hasOwnProperty('prev_next') ? options.prev_next : true;
  var transform = options.transform;
  var self = this;
  var result = '';
  var i;

  if (!current) return '';

  var currentPage = '<li class="list-inline-item">\
    <a class="active u-pagination-v1__item g-width-30 g-height-30 g-brd-secondary-light-v2 g-brd-primary--active g-color-white g-bg-primary--active g-font-size-12 rounded g-pa-5" >'+(transform ? transform(current) : current)+'</a>\
  </li>';

  function link(i) {
    return self.url_for(i === 1 ? base : base + format.replace('%d', i));
  }

  function pageLink(i) {



    return '            <li class="list-inline-item">\
                  <a class="u-pagination-v1__item g-width-30 g-height-30 g-brd-transparent g-brd-primary--hover g-brd-primary--active g-color-secondary-dark-v1 g-bg-primary--active g-font-size-12 rounded g-pa-5" href="' + link(i) + '">' +(transform ? transform(i) : i) +'</a>\
                </li>';
  }

  // Display the link to the previous page
  if (prevNext && current > 1) {

    result += '<li class="list-inline-item">\
      <a class="u-pagination-v1__item g-brd-secondary-light-v2 g-brd-primary--hover g-color-gray-dark-v5 g-color-primary--hover g-font-size-12 rounded g-px-15 g-py-5 g-ml-15" href="' + link(current - 1) + '" aria-label="Previous">\
        <span aria-hidden="true">\
          <i class="mr-2 fa fa-angle-left"></i>\
            ' + prevText + '\
        </span>\
        <span class="sr-only">' + prevText + '</span>\
      </a>\
    </li>'
  }

  if (options.show_all) {
    // Display pages on the left side of the current page
    for (i = 1; i < current; i++) {
      result += pageLink(i);
    }

    // Display the current page
    result += currentPage;

    // Display pages on the right side of the current page
    for (i = current + 1; i <= total; i++) {
      result += pageLink(i);
    }
  } else {
    // It's too complicated. May need refactor.
    var leftEnd = current <= endSize ? current - 1 : endSize;
    var rightEnd = total - current <= endSize ? current + 1 : total - endSize + 1;
    var leftMid = current - midSize <= endSize ? current - midSize + endSize : current - midSize;
    var rightMid = current + midSize + endSize > total ? current + midSize - endSize : current + midSize;
    var spaceHtml = '            <li class="list-inline-item">\
                  <span class="g-width-30 g-height-30 g-color-gray-dark-v5 g-font-size-12 rounded g-pa-5">'+space+'</span>\
                </li>';

    // Display pages on the left edge
    for (i = 1; i <= leftEnd; i++) {
      result += pageLink(i);
    }

    // Display spaces between edges and middle pages
    if (space && current - endSize - midSize > 1) {
      result += spaceHtml;
    }

    // Display left middle pages
    if (leftMid > leftEnd) {
      for (i = leftMid; i < current; i++) {
        result += pageLink(i);
      }
    }

    // Display the current page
    result += currentPage;

    // Display right middle pages
    if (rightMid < rightEnd) {
      for (i = current + 1; i <= rightMid; i++) {
        result += pageLink(i);
      }
    }

    // Display spaces between edges and middle pages
    if (space && total - endSize - midSize > current) {
      result += spaceHtml;
    }

    // Dispaly pages on the right edge
    for (i = rightEnd; i <= total; i++) {
      result += pageLink(i);
    }
  }

  // Display the link to the next page
  if (prevNext && current < total) {



    result += '            <li class="list-inline-item">\
                  <a class="u-pagination-v1__item g-brd-secondary-light-v2 g-brd-primary--hover g-color-gray-dark-v5 g-color-primary--hover g-font-size-12 rounded g-px-15 g-py-5 g-ml-15" href="' + link(current + 1) + '" aria-label="Next">\
                    <span aria-hidden="true">\
                      ' + nextText + '\
                      <i class="ml-2 fa fa-angle-right"></i>\
                    </span>\
                    <span class="sr-only">' + nextText + '</span>\
                  </a>\
                </li>';
  }



  return '<!-- Pagination -->\
  <div class="container g-pb-100">\
    <nav aria-label="Page Navigation">\
      <ul class="list-inline text-center mb-0">\
        '+result+'\
      </ul>\
    </nav>\
  </div>\
  <!-- End Pagination -->';
};

/// 生成 Page Number
hexo.extend.helper.register('pgn', paginatorHelper);
