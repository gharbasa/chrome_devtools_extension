// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.devtools.panels.create(
    'RegUSA',
    'x32_32.png',
    'panel/panel.html',
    null // no callback needed
);
/*
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

// Relay the tab ID to the background page
chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId
});
*/

//console.log("Ok, Hit from regusa test server: " + unescape("' + escape(request.request.url) + '") + ", method: " + unescape("' + escape(request.request.method) + '"))

chrome.devtools.network.onRequestFinished.addListener(
    function(request) {
        if(request.request.url.indexOf('api.test.regusa.dtrts.com') > -1) {
            //if (request.response.bodySize > 40*1024) {
                //if(request.request.method !== "OPTIONS") {
                    request.getContent(function(content, encoding) //content is the response content.
                    {  
                        let traffic = {};
                        chrome.devtools.inspectedWindow.eval(
                            'console.log("Ok, Hit from regusa test server: " + unescape("' + escape(request.request.url) + '") + ", method: " + unescape("' + escape(request.request.method) + '"))');
                        
                        //chrome.devtools.inspectedWindow.eval(
                        //    'console.log("Ok, Response content..: " + unescape("' +
                        //    escape(content) + '"))');
                        
                        traffic.request = {};
                        traffic.response =  {};
                        traffic.url = request.request.url;
                        traffic.method = request.request.method;
                        if (typeof request.request.postData !== 'undefined' && request.request.postData !== null) {
                            traffic.request.postData = request.request.postData;
                        }
                        traffic.response.content  = content;
                        traffic.queryParams = [];

                        for (var i = 0; i < request.request.queryString.length; i++)
		                {
			                var queryParam = {};
			                queryParam.name = request.request.queryString[i].name;
			                queryParam.value = request.request.queryString[i].value;
			                traffic.queryParams.push(queryParam);
                        }
                        traffic.duration = Math.floor(request.time);
                        traffic.request.headers = [];
                        for (var i = 0; i < request.request.headers.length; i++)
                        {
                            var header = {};
                            header.name = request.request.headers[i].name;
                            header.value = request.request.headers[i].value;
                            traffic.request.headers.push(header);
                        }
                        traffic.response.headers = [];
                        traffic.response.status = request.response.status;

                        for (var i = 0; i < request.response.headers.length; i++)
                        {
                            var header = {};
                            header.name = request.response.headers[i].name;
                            header.value = request.response.headers[i].value;
                            traffic.response.headers.push(header);
                        }
                        //chrome.devtools.inspectedWindow.eval(
                         //   'console.log("Ok, traffic: " + unescape("' +
                         //   escape(JSON.stringify(traffic)) + '"))');
                        
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function() {
                            if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
                               if (xmlhttp.status == 200) {
                                chrome.devtools.inspectedWindow.eval(
                                    'console.log("Posted to server successfully: " + unescape("' + escape(request.request.url) + '"))');
                                }
                               else if (xmlhttp.status == 400) {
                                chrome.devtools.inspectedWindow.eval(
                                    'console.log("ERROR 400 posting an url: " + unescape("' + escape(request.request.url) + '"))');
                               }
                               else {
                                chrome.devtools.inspectedWindow.eval(
                                    'console.log("ERROR some weird error while posting an url: " + unescape("' + escape(request.request.url) + '"))');
                               }
                            }
                        };
                        xmlhttp.open("POST", "http://localhost:8080/record", true);
                        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        xmlhttp.send(JSON.stringify(traffic));
                    });
                }

            
        //}
});