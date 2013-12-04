function callbackOnSelection(info, tab) {
  var from = info["pageUrl"];
  var text = info["selectionText"];
  var post = {"from": from, "word": text};
  
	var req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if (req.readystate == 4) {
			console.log("YEAL!!");
		}
	}

	req.open("GET", "http://192.168.1.32:3001/add/" + encodeURIComponent(text), true);
	req.send();
}

var menu = chrome.contextMenus.create({
  "title": "Record it",
  "contexts": ["selection"],
  "onclick": callbackOnSelection
});