// NOTE: this is not what the hackathon-ready code will look like.
// This is purely to see what it takes to get a working version of
// the notes done. The code the students will see needs to be well
// documented, and well-abstracted so that they can quickly understand
// what's going on and fill in a function or two
var sidebar = "<div class='annotate-sidebar'><div class='annotate-header'><h2>Notes</h2></div><div class='annotate-list'></div><input type=submit class='annotate-save' value='Save'><input class='annotate-footer' placeholder='Type notes here!'></div>";

var noteTemplate = "<div class='annotate-note'></div>";

// Saves a note to storage
var saveNote = function(text, callback) {
	chrome.storage.sync.get('list', function(storage) {
		var list = storage.list;
		if (Object.keys(list).length === 0) {
			list = [];
		}
		console.log("list: ");
		console.log(list);
		list.push({
			text: text
		});
		chrome.storage.sync.set({'list':list}, function(){
			callback();
		});
	});
};


// listen for changes to storage and render notes. Because this is a listener
// saveNote will also result in the note being shown
chrome.storage.onChanged.addListener(function(changes, namespace) {
	var listChange = changes.list;
	if (!listChange) {
		return;
	}
	var list = listChange.newValue;
	list.forEach(function(note){
		var noteView = $.parseHTML(noteTemplate);
		noteView.innerHTML = note.text; // this is broken still. i am bad at jquery.
		$('.annotate-list').append(noteView);
	});
});

$(document).ready(function() {
	$('body').append(sidebar);
	$('.annotate-save').click(function() {
		saveNote($('.annotate-footer').val(), function() {
			console.log("saved");
		});
	});
// Experiment to fix rest of page
//	$('body').wrapInner("<div class='annotate-wrap' />");
//	$('.annotate-wrap').css('width','70%');
});
