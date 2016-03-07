// NOTE: this is not what the hackathon-ready code will look like.
// This is purely to see what it takes to get a working version of
// the notes done. The code the students will see needs to be well
// documented, and well-abstracted so that they can quickly understand
// what's going on and fill in a function or two
var sidebar = "<div class='annotate-sidebar'><div class='annotate-header'>Notes</div><div class='annotate-list'></div><input type=submit class='annotate-save' value='Save'><input class='annotate-footer' placeholder='Type notes here!'></div>";

var toggle = "<div class='annotate-toggle'>X</div>";

var noteTemplate = "<div class='annotate-note'><div class='annotate-note-text'></div><div class='annotate-note-close'>X</div></div>";

var getNotes = function(callback) {
	chrome.storage.sync.get('list', function(storage) {
		var list = storage.list;
		if (!list || Object.keys(list).length === 0) {
			list = [];
		}
		callback(list);
	});
};

// Adds a note
var saveNote = function(text, callback) {
	getNotes(function(list) {
		list.push({
			text: text
		});
		saveNotes(list, callback);
	});
};

// Saves the list of notes to storage
var saveNotes = function(list, callback) {
	chrome.storage.sync.set({'list':list}, function(){
		callback();
	});
};

var removeNote = function(index, callback) {
	getNotes(function(list) {
		list.splice(index, 1);
		saveNotes(list, callback);
	});
};

var renderNotes = function(list) {
	$('.annotate-note').remove();
	list.forEach(function(note, index){
		var noteView = $.parseHTML(noteTemplate);
		$(noteView).find('.annotate-note-text').text(note.text);
		$(noteView).find('.annotate-note-close').click(function() {
			removeNote(index, function(){});
		});
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
});
