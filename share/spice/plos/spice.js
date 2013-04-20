// TODO
//    - Maybe facets with highlighted terms?
//    - How about some altmetrics? http://api.plos.org/alm/faq/

function ddg_spice_plos(request) {

  // Get query and exclude the trigger.
  var query = DDG.get_query().replace(/plos/i, "");

  // Check if response is OK.
  var status = request['responseHeader']['status'];
  if (status === 0) {

    // Fetch information.
    var qtime = request['responseHeader']['QTime'];
    var numFound = request['response']['numFound'];
    
    // Get docs and define loop limit.
    var docs = request['response']['docs'];
    if (docs.length < 5) {
      var limit = docs.length;
    } else {
      var limit = 5;
    };

    // Create object for results.
    var results = '<div>'
                + '<span style="font-family:monospace;padding-bottom:1em;">Data Provided by PLOS</span>'
                + '<ul style="padding:1em 0 0 0;">';

    // Loop over documents.
    for (var i = 0; i < limit; i++) {
      // Define article and its variables.
      var doc = docs[i];
      var title = doc['title_display'];
      var author_list = doc['author_display'];
      if (author_list.length > 3) {
        var authors = author_list.splice(0, 3).join(', ') + ', et al';
      } else {
        var authors = author_list.join(', ');
      }
      var journal = doc['journal'];
      var pubdate = doc['publication_date'];
      var year = pubdate.substr(0, 4);
      var id = doc['id'];
      results += '<li style="list-style-type:none;padding:0 3px 1em 3px;">'
              + '<a href="http://dx.doi.org/' + id + '" style="color:#333333;">'
              + '<span style="display:block;font-weight:bold;">' + title + '</span>'
              + '<span>' + authors + '</span>. '
              + '<span style="font-style:italic;">' + journal + '</span> '
              + '<span>(' + year + ')</span>'
              //+ '<span class="id">' + id + '</span>'
              + '</a>'
              + '</li>';
    };

    // Finish results.
    results += '</ul>'
            + '<span style="font-family:monospace;float:left;padding:3px 3px 0 0;">Found ' + numFound + ' results in ' + qtime + ' ms</span>'
            + '</div>';

    // Define callback items.
    var items = [[]];
    items[0] = {
      a: results,
      h: 'PLOS research articles: ' + query,
      s: 'PLOS',
      u: 'http://www.plosone.org/search/advancedSearch.action?pageSize=50&unformattedQuery=' + query,
      force_big_header: true,
    }
    nra(items);
  }
}
