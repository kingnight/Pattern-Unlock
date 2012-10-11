This is a pattern unlock screen, similar to the one on Android.  

Based on vamshi4001's code (https://github.com/vamshi4001/Android-Unlock-4-Web).

The pegs on the screen represent numbers, laid out like those on your phone dialer (1 in the top left, 9 in the bottom right).

init code:

lock.init(combination code, parent id, callback);

example:

lock.init('123', '#content', function() {
	$('#lock_container').hide(); console.log('donesky'); 
});