
var stackApi = (function(){
	var key = "iC4HQbr5rg0JKVxKI62rWA((";
	var baseUrl = "https://api.stackexchange.com/2.2/search?key="+key+"&site=stackoverflow&order=desc&sort=activity&filter=default";

	function _search(query, callback) {
		var url = baseUrl + '&tagged=' + query;
		$.get(url).success(callback);
	}

	return {
		search: _search
	};
})();

var questionList = (function(){
	var $questionList = $('.js-questions')

	function _refresh(queryData) {
		var questionListHtml = '';
		$.each(queryData.items, function(i,item){
			questionListHtml += '<li>';
			questionListHtml += item.title
			questionListHtml += '</li>';
		});

		$questionList.html(questionListHtml);
	}

	return {
		refresh: _refresh
	}
})();

// Fire it up
$(function(){
	$('.js-search-form').submit(function(e){
		e.preventDefault();

		var query = $(this).find('[name=query]').val();
		stackApi.search(query,function(queryResponse){
			questionList.refresh(queryResponse);
		});


		
	});
});
