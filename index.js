// NOTE: this is not what the hackathon-ready code will look like.
// This is purely to see what it takes to get a working version of
// the notes done. The code the students will see needs to be well
// documented, and well-abstracted so that they can quickly understand
// what's going on and fill in a function or two
var sidebar = "<div class='annotate-sidebar'><div class='annotate-header'>Notes</div><div class='annotate-list'></div><input type=submit class='annotate-save' value='Save'><input class='annotate-footer' placeholder='Type notes here!'></div>";

var toggle = "<div class='annotate-toggle'>X</div>";

var noteTemplate = "<div class='annotate-note'><div class='annotate-note-text'></div><div class='annotate-note-close'>X</div></div>";

// get Current page is used to identify the current page, so that notes will be saved
// and retrieved only when visiting the page again.
var getCurrentPage = function() {
	return window.location.hostname + window.location.pathname;
};

var getNotes = function(callback) {
	var currentPage = getCurrentPage();
	chrome.storage.sync.get(currentPage, function(storage) {
		var list = storage[currentPage];
		if (!list || Object.keys(list).length === 0) {
			list = [];
		}
		callback(list);
	});
};

// Adds a note
var saveNote = function(text) {
	getNotes(function(list) {
		list.push({
			text: text
		});
		saveNotes(list);
	});
};

// Saves the list of notes to storage
var saveNotes = function(list) {
	var save = {};
	save[getCurrentPage()] = list;
	chrome.storage.sync.set(save, function(){});
};

var removeNote = function(index, callback) {
	getNotes(function(list) {
		list.splice(index, 1);
		saveNotes(list);
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
	var listChange = changes[getCurrentPage()];
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

	console.log(getCurrentPage());

	getNotes(renderNotes);
});
