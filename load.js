var remote = require('remote');
var dialog = remote.require('dialog');
var browserWindow = remote.require('browser-window');
var fs = require('fs');
var readLine = require('readline');
var csv = require('comma-separated-values');

var mainContent = null;
var filePath = null;
var colorSettings = null;

function onLoad() {
	mainContent = document.getElementById("main_content");
	filePath = document.getElementById("file_path");
	parseColorSettingsFile();
}

function openLoadFile() {
	var win = browserWindow.getFocusedWindow();

	dialog.showOpenDialog(
			win,
			{
				properties: ['openFile'],
				filters: [
				{
					name: 'Documents',
					extensions: ['txt', 'text', 'log']
				}
			]
			},
			// Callback
			function (filenames) {
				if (filenames) {
					readFile(filenames[0]);
				}
			});
}

function readFile(path) {
	filePath.innerHTML = path;
	clearMainContent();
	rs = fs.ReadStream(path);
	rl = readLine.createInterface({input:rs, output:{}});
	var i = 0;
	rl.on('line', function(line) {
		var e = document.createElement('div');
		e.innerHTML = '<b>' + ++i + '</b> ' + line.trim();
		
		setLogLevelClass(e, line);
		if (colorSettings) {
			colorSettings.forEach(function(object) {
				if (isMatch(line, object.text)) {
					e.style.color = object.color;
				}
			});
		}
		mainContent.appendChild(e);
	});
}

function clearMainContent() {
	while (mainContent.firstChild) {
		mainContent.removeChild(mainContent.firstChild);
	}
}

function setLogLevelClass(element, line) {
	var reg = /\d\d-\d\d\s\d\d:\d\d:\d\d\.\d\d\d\s(.)/;
	var result = line.match(reg);
	if (!result) {
		return;
	}
	var logLevel = result[1];
	switch (logLevel) {
		case 'V':
			element.className = 'verbose';
			break;
		case 'D':
			element.className = 'debug';
			break;
		case 'I':
			element.className = 'info';
			break;
		case 'W':
			element.className = 'warn';
			break;
		case 'E':
			element.className = 'error';
			break;
		case 'A':
			element.className = 'assert';
			break;
	}
}

function isMatch(line, regText) {
	var reg = new RegExp(regText);
	return reg.test(line);
}

function parseColorSettingsFile() {
	fs.readFile('color_settings.txt', function (error, text) {
		if (error != null) {
		   alert('error: ' + error);
		   return;
		}	   
		console.log(text.toString());
		colorSettings = new csv(text.toString(), {header: true}).parse();
		//console.log(colorSettings);
	});
}

function clickVerbose(isChecked) {
	var elements = document.getElementsByClassName('verbose');
	changeDisplayStyle(isChecked, elements);
}

function clickDebug(isChecked) {
	var elements = document.getElementsByClassName('debug');
	changeDisplayStyle(isChecked, elements);
}

function clickInfo(isChecked) {
	var elements = document.getElementsByClassName('info');
	changeDisplayStyle(isChecked, elements);
}

function clickWarn(isChecked) {
	var elements = document.getElementsByClassName('warn');
	changeDisplayStyle(isChecked, elements);
}

function clickError(isChecked) {
	var elements = document.getElementsByClassName('error');
	changeDisplayStyle(isChecked, elements);
}

function clickAssert(isChecked) {
	var elements = document.getElementsByClassName('assert');
	changeDisplayStyle(isChecked, elements);
}

function changeDisplayStyle(isShown, elements) {
	if (isShown) {
		for (i=0; i<elements.length; i++) {
			elements[i].style.display = 'block';
		}	
	} else {
		for (i=0; i<elements.length; i++) {
			elements[i].style.display = 'none';
		}	

	}
}	
