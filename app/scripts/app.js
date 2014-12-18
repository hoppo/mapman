/*global _*/
/*jshint camelcase: false*/
(function(window, $, _, undefined) {
  'use strict';

  console.log('Hello, Gene ID to MapMan bin!');

  var appContext = $('[data-app-name="test-mapman"]');

var templates = {
  resultTable: _.template('<table class="table"><thead><tr><th>AGI code</th><th>MapMan bin code</th><th>MapMan bin description</th></tr></thead><tbody><% _.each(genes, function(r) { %><tr><td><%= r.identifier %></td><td><%= r.bincode %></td><td><%= r.binname %></td></tr><% }) %></tbody></table>')
};

  var form = $('form[name=mapman-query]', appContext);
  form.on('submit', function(e) {
    e.preventDefault();

    var Agave = window.Agave;

    // clear error messages
    $('.messages', this).empty();
    $('.has-error', this).removeClass('has-error');

    var query = {
      locus:this.locus_list.value 
    };

    // basic validate
    var hasError = false;
    if (! query.locus) {
      $(this.locus_list).parent().addClass('has-error');
      $('.messages', this).append('<div class="alert alert-danger">Locus is required</div>');
      hasError = true;
    }

    if (! hasError) {
      $('.results').html('<pre><code>' + JSON.stringify(query, null, 2) + '</code></pre>');

      Agave.api.adama.getStatus({}, function(resp) {
        if (resp.obj.status === 'success') {
          Agave.api.adama.search(
            {'namespace': 'mapman', 'service': 'genelookupflat_v0.1', 'queryParams': query},
            showResults
          );

        } else {
          // ADAMA is not available, show a message
          $('.messages', this).append('<div class="alert alert-danger">The Query Service is currently unavailable. Please try again later.</div>');
        }
      });




    }

    var showResults = function( json ) {

      // show error message for invalid object
      if ( ! ( json && json.obj ) ) {
        $( '.results', appContext ).html( '<div class="alert alert-danger">Invalid response!</div>' );
       return;
      }




      $( '.results', appContext ).html( templates.resultTable( json.obj.result ) );
      $( '.results table', appContext ).dataTable();
    };





//    Agave.api.adama.getStatus({}, function(resp) {
//      if (resp.obj.status === 'success') {
//       Agave.api.adama.search(
//          {'namespace': 'mapman', 'service': 'genelookupflat_v0.1', 'queryParams': query},
//          showResults
//        );
	  
//      } else {
//        // ADAMA is not available, show a message
//        $('.messages', this).append('<div class="alert alert-danger">The Query Service is currently unavailable. Please try again later.</div>');
//      }
//    });

  });

})(window, jQuery, _);

