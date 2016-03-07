// NOTE: this is not what the hackathon-ready code will look like.
// This is purely to see what it takes to get a working version of
// the notes done. The code the students will see needs to be well
// documented, and well-abstracted so that they can quickly understand
// what's going on and fill in a function or two
var sidebar = "<div class='annotate-sidebar'><div class='annotate-header'>Notes</div><div class='annotate-list'></div><input type=submit class='annotate-save' value='Save'><input class='annotate-footer' placeholder='Type notes here!'></div>";

var toggle = "<div class='annotate-toggle'>X</div>";

var noteTemplate = "<div class='annotate-note'></div>";

var getNotes = function(callback) {
	chrome.storage.sync.get('list', function(storage) {
		var list = storage.list;
		if (!list || Object.keys(list).length === 0) {
			list = [];
		}
		callback(list);
	});
};

// Saves a note to storage
var saveNote = function(text, callback) {
	getNotes(function(list) {
		list.push({
			text: text
		});
		chrome.storage.sync.set({'list':list}, function(){
			callback();
		});
	});
};

var renderNotes = function(list) {
	$('.annotate-note').remove();
	list.forEach(function(note){
		var noteView = $.parseHTML(noteTemplate);
		$(noteView).text(note.text);
		$('.annotate-list').append(noteView);
	});
};

// listen for changes to storage and render notes. Because this is a listener
// saveNote will also result in the note being shown
chrome.storage.onChanged.addListener(function(changes, namespace) {
	var listChange = changes.list;
	if (!listChange) {
		return;
	}
	renderNotes(listChange.newValue);
});

$(document).ready(function() {
	$('body').append(sidebar);

	// Button to show/hide notes
	$('body').append(toggle);
	$('.annotate-toggle').click(function() {
		$('.annotate-sidebar').toggle();
		$('.annotate-toggle').toggleClass('hidden');
	});

	// Notes functionality
	$('.annotate-save').click(function() {
		saveNote($('.annotate-footer').val(), function() {
			console.log("saved");
		});
	});
	getNotes(renderNotes);
// Experiment to move rest of page over - this is turning out to be hard
//	$('body').wrapInner("<div class='annotate-wrap' />");
//	$('.annotate-wrap').css('width','70%');
});
