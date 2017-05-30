/** scroll action **/
$(function(){
	$('#top').click(function(){
		$('html,body').animate({scrollTop: '0px'}, 800);
	}); 
	
	$('#m_about').click(function(){
		$('html,body').animate({scrollTop:$('#about').offset().top}, 800);
	});
	
	$('#m_dayconcern').click(function(){
		$('html,body').animate({scrollTop:$('#dayconcern').offset().top}, 800);
	});

	$('#m_homeconcern').click(function(){
		$('html,body').animate({scrollTop:$('#homeconcern').offset().top}, 800);
	});

	$('#m_restservice').click(function(){
		$('html,body').animate({scrollTop:$('#restservice').offset().top}, 800);
	});

	$('#m_issue').click(function(){
		$('html,body').animate({scrollTop:$('#issue').offset().top}, 800);
	});

});