
var stackApi = (function(){
	var key = "iC4HQbr5rg0JKVxKI62rWA((";
	var baseUrl = "https://api.stackexchange.com/2.2/search?key="+key+"&site=stackoverflow&order=desc&sort=activity&filter=default";

	function _search(query, callback) {
		console.log(query);
		var url = baseUrl + '&tagged=' + query;
		$.get(url).success(callback);
	}

	return {
		search: _search
	};
})();

// Fire it up
$(function(){
	$('.js-search-form').submit(function(e){
		e.preventDefault();

		var query = $(this).find('[name=query]').val();
		var questions = stackApi.search(query);

	})
});
