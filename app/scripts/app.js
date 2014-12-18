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
    $('.results', appContext).empty();
    $('.messages', this).empty();
    $('.has-error', this).removeClass('has-error');

    var lines = this.locus_list.value.split(/\n/);
    var texts=[];
    var hasError = false;

    for (var i=0; i<lines.length; i++){
      if(/\S/.test(lines[i])){
        texts.push($.trim(lines[i]));
      }
    }
   
    if(texts.length === 0){
      $(this.locus_list).parent().addClass('has-error');
      $('.messages', this).append('<div class="alert alert-danger">AGI codes are required</div>');
      hasError = true;
    }

   console.log(texts);   

   var query ={
     locus:texts
     //locus1:'AT2G&9730',
     //locus2:'AT2G39731',
     //locus3:'AT2G39732',
     //locus4:'AT2G39733'
   };  
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
      console.log(JSON.stringify(json, null, 2));
      // show error message for invalid object
      if ( ! ( json && json.obj ) ) {
        $( '.results', appContext ).html( '<div class="alert alert-danger">Invalid response!</div>' );
       return;
      }

      $( '.results', appContext ).html( templates.resultTable( json.obj.result ) );
      $( '.results table', appContext ).dataTable();
    };

  });

})(window, jQuery, _);

