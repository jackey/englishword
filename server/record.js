var express = require("express");
var querystring = require("querystring");
var http = require("http");
var fs = require("fs");
var path = require("path");

var cachePath = "./caches";
var app = express();

function translateWord(word) {
	var params = {
		"key": "AIzaSyCZ3zIPs8RwyLcQAHxKYueftmOo8cH768I",
		"q" : word,
		"target": "zh-CN",
	};
	var url = "http://translate.google.cn/translate_a/t?client=p&sl=en&tl=zh-CN&hl=en&sc=2&ie=UTF-8&oe=UTF-8&oc=1&otf=1&rom=1&ssel=0&tsel=0&q=" + querystring.escape(word);

	http.get(url, function (res) {
		res.setEncoding("utf-8");
		var data = "";
		res.on("data", function (chunk) {
			data += chunk;
		});

		res.on("end", function () {
			cacheTranslate(word, data);
		});
	})
	.on('error', function (e) {
		console.log(e);
	});
}

function cacheTranslate(word, translation){
	var path = cachePath + "/" + querystring.escape(word);
	fs.openSync(path, "w+");

	fs.writeFile(path, translation, {encoding: "utf8"}, function (err) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(translation);
			console.log("success");
		}
	});
}

app.use(express.static(path.join(__dirname, 'static')));

app.get("/", function (req, res) {
	res.send("hello world");
});

app.get("/all", function (req, res) {
	fs.readdir(cachePath, function (err, files) {
		if (err) {
			res.json({
				err: 'error',
				data: {}
			});
		}
		else {
			var words = [];
			for (var i = 0; i < files.length; i++) {
				var filePath = cachePath + "/" + files[i];
				var word = querystring.unescape(files[i]);
				var translation = fs.readFileSync(filePath, "utf8");
				translation = JSON.parse(translation);
				var o = {};
				o[word] = translation;
				words.push(o);
			}
			res.json({
				error: null,
				data: words
			});
		}
	});
});

app.get("/add/:word", function (req, res) {
	translateWord(req.params.word);
	res.json({
		"success": true
	});
});

app.listen(3001, "192.168.1.32");