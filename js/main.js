
var stackApi = (function(){
	var key = "iC4HQbr5rg0JKVxKI62rWA((";
	var baseUrl = "https://api.stackexchange.com/2.2";
	var searchSuffix = "/search?key="+key+"&filter=default";
	var answerSuffix = "/questions/QID/answers?";
	var genericSuffix = "site=stackoverflow&order=desc&sort=activity";

	/**
	 * Question search by term
	 */
	function _search(query, callback) {
		var url = baseUrl + searchSuffix + '&tagged=' + query + '&' + genericSuffix;
		$.get(url).success(callback);
	}

	/**
	 * Get all answers to a question id
	 */
	function _getAnswers(qid, callback) {
		// The answerSuffix contains a placeholder that we swap out
		var url = baseUrl + answerSuffix.replace('QID', qid) + genericSuffix;
		$.get(url).success(callback);
	}

	return {
		search: _search,
		getAnswers: _getAnswers
	};
})();

var questionList = (function(){
	var $questionList = $('.js-questions');

	/**
	 * Any handlers that need to be kicked off
	 */
	function _init(options) {
		// When a user clicks on a question header we intercept
		// we need to use 'on' because the questions are dynamically 
		// added to the page
		$('body').on('click', '.js-question-link', function(e){
			e.preventDefault();
			var qid = $(this).data('qid');
			var $questionContainer = $(this).parents('.question');

			options.questionClick(qid, $questionContainer);
		});
	}

	/**
	 * Processes answers into html and puts it in the correct spot
	 * of the question container
	 */
	function _insertAnswers($questionContainer, answers) {
		var answersHtml = '<div class="answers">';
		answersHtml += '<h4>Answers</h4>';

		if (answers.length) {
			answersHtml += '<ul class="answers-list">'
			$.each(answers, function(i, answer) {
				answersHtml += '<li>';
					answersHtml += '<img width="20px" src="'+answer.owner.profile_image+'">';
					answersHtml += answer.owner.display_name
					if (answer.is_accepted) {
						answersHtml += '<i class="glyphicon glyphicon-ok-sign"></i>';
					}
				answersHtml += '</li>';
			});
			answersHtml += '</ul>';
		} else {
			answersHtml += '<p>no answers submitted</p>';
		}
		answersHtml += '</div>';

		// if answers was already fetched remove it
		$questionContainer.find('.answers').remove();

		// insert our new answers
		$questionContainer.find('.question-body').prepend(answersHtml);
	}

	/**
	 * Wrapper for any updates to query data
	 */
	function _refreshQuestions(queryData) {
		_inserQuestions(queryData.items);
	}

	/**
	 * Processes question items into an html template 
	 * and appends it to it's container
	 */
	function _inserQuestions(items) {
		var questionListHtml = '';

		if (items.length) {
			$.each(items, function(i,item){

				questionListHtml += '<div class="col-sm-6">';
					questionListHtml += '<div class="question">';

						questionListHtml += '<h3 class="question-title">';
							questionListHtml += '<a href="#" data-qid="'+item.question_id+'" class="js-question-link">'+item.title+'</a>';
						questionListHtml += '</h3>';

						questionListHtml += '<div class="question-body">';
							questionListHtml += '<ul class="list-inline">';
								if (item.is_answered) {
									questionListHtml += '<li><i class="glyphicon glyphicon-ok-sign"></i> Answered</li>';
								}
								questionListHtml += '<li><i class="glyphicon glyphicon-eye-open"></i> '+item.view_count+' Views</li>';
								questionListHtml += '<li><i class="glyphicon glyphicon-retweet"></i> '+item.answer_count+' Answers</li>';
							questionListHtml += '</ul>';

							questionListHtml += '<ul class="list-inline question-tags">';
								questionListHtml += '<li>tags: </li>'
								questionListHtml += '<li><span class="label label-info">'
								questionListHtml += item.tags.join('</span></li><li><span class="label label-info">');
								questionListHtml += '</span></li>';
							questionListHtml += '</ul>';
						questionListHtml += '</div>';
					questionListHtml += '</div>';
				questionListHtml += '</div>';
			});
		} else {
			questionListHtml = '<p>No results found for that search term, try again with something less specific</p>';
		}

		$questionList.html(questionListHtml);
	}

	return {
		init: _init,
		refreshQuestions: _refreshQuestions,
		insertAnswers: _insertAnswers
	}
})();

// Connect all of the pieces
$(function(){
	questionList.init({
		// Handler for when a question is clicked
		questionClick: function(qid, $questionContainer) {

			// Reach out to the api and get a list of answers
			stackApi.getAnswers(qid, function(response) {

				// Ask question list to append the answers
				var answers = response.items;
				questionList.insertAnswers($questionContainer, answers);
			});
		}
	});

	// Search form handler
	$('.js-search-form').submit(function(e){
		e.preventDefault();

		// Reach out to the api with our query,
		// and tell the questionList to refresh itself with this data
		var query = $(this).find('[name=query]').val();
		stackApi.search(query, questionList.refreshQuestions);
	});
});
