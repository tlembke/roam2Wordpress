

export default {
    onload: ({ extensionAPI }) => {


        window.roamAlphaAPI.ui.commandPalette.addCommand({
            label: "Send to Wordpress",
            callback: () => {
                const uid = window.roamAlphaAPI.ui.getFocusedBlock()?.["block-uid"];
                if (uid == undefined) {
                    alert("Please make sure to focus a block before trying to send data to a webhook");
                    return;
                }
                var which = 1;
                jsonWH(uid, which);
            }
        });

        });

        async function jsonWH(uid, which) {
            var WebhookURL, WebhookDelimiter, WebhookURL2, WebhookDelimiter2;
            WebhookURL = "https://hook.kntz.it/catch/uIkBkAhshs-kz2696-MsVYvvgHL3";
          WebhookDelimiter = ":";


                   
                    var dataString;

                    var thisBlockInfo = window.roamAlphaAPI.data.pull("[:block/string]", [":block/uid", uid]);

                    var apiCall = `[:find ?ancestor (pull ?block [*])
                :in $ ?b
                :where [?ancestor :block/uid ?b]
                       [?ancestor :block/string]
                       [?block :block/parents ?ancestor]]`;

                    var childBlocks = await window.roamAlphaAPI.q(apiCall, uid);

                    var blocks = {};
                    if (which == 1) {
                        if (!WebhookURL.match("ifttt")) {
                            blocks['parentText'] = thisBlockInfo[":block/string"];
                        } else {
                            blocks['value1'] = thisBlockInfo[":block/string"];
                        }
                    } else if (which == 2) {
                        if (!WebhookURL2.match("ifttt")) {
                            blocks['parentText'] = thisBlockInfo[":block/string"];
                        } else {
                            blocks['value1'] = thisBlockInfo[":block/string"];
                        }
                    }

                    var n = 0;
                    for (var i in childBlocks) {
                        dataString = childBlocks[i][1].string;
                        if (which == 1) {
                            if (dataString.match(WebhookDelimiter)) {
                                dataString = dataString.split(WebhookDelimiter);
                                if (WebhookURL.match("ifttt") && (i < 2)) {
                                    var iftttNumber = parseInt(i) + 2;
                                    blocks['value' + iftttNumber + ''] = encodeURIComponent(dataString[1].trim());
                                }
                                else if (!WebhookURL.match("ifttt")) {
                                    blocks['' + dataString[0].trim() + ''] = dataString[1].trim();
                                }
                            } else {
                                if (WebhookURL.match("ifttt") && (i < 2)) {
                                    var iftttNumber = parseInt(i) + 2;
                                    blocks['value' + iftttNumber + ''] = encodeURIComponent(dataString);
                                }
                                else if (!WebhookURL.match("ifttt")) {
                                    n = n + 1;
                                    blocks['string' + n] = dataString;
                                }
                            }
                        } else if (which == 2) {
                            if (dataString.match(WebhookDelimiter2)) {
                                dataString = dataString.split(WebhookDelimiter2);
                                if (WebhookURL2.match("ifttt") && (i < 2)) {
                                    var iftttNumber = parseInt(i) + 2;
                                    blocks['value' + iftttNumber + ''] = encodeURIComponent(dataString[1].trim());
                                }
                                else if (!WebhookURL2.match("ifttt")) {
                                    blocks['' + dataString[0].trim() + ''] = dataString[1].trim();
                                }
                            } else {
                                if (WebhookURL2.match("ifttt") && (i < 2)) {
                                    var iftttNumber = parseInt(i) + 2;
                                    blocks['value' + iftttNumber + ''] = encodeURIComponent(dataString);
                                }
                                else if (!WebhookURL2.match("ifttt")) {
                                    n = n + 1;
                                    blocks['string' + n] = dataString;
                                }
                            }
                        }
                    }

                    var myHeaders = new Headers();
                    var requestOptions = {};
                    if (which == 1) {
                        if (WebhookURL.match("zapier")) {
                            requestOptions["body"] = JSON.stringify(blocks);
                        } else if (WebhookURL.match("ifttt")) {
                            var iftttURL = WebhookURL + "?value1=" + blocks['value1'] + "&value2=" + blocks['value2'] + "&value3=" + blocks['value3'];
                            requestOptions["mode"] = "no-cors";
                        } else if (WebhookURL.match("make") || WebhookURL.match("pipedream")) {
                            myHeaders.append("Content-Type", "application/json");
                            requestOptions["headers"] = myHeaders;
                            requestOptions["body"] = JSON.stringify(blocks);
                        } else {
                            requestOptions["body"] = JSON.stringify(blocks);
                        }
                    } else if (which == 2) {
                        if (WebhookURL2.match("zapier")) {
                            requestOptions["body"] = JSON.stringify(blocks);
                        } else if (WebhookURL2.match("ifttt")) {
                            var iftttURL = WebhookURL2 + "?value1=" + blocks['value1'] + "&value2=" + blocks['value2'] + "&value3=" + blocks['value3'];
                            requestOptions["mode"] = "no-cors";
                        } else if (WebhookURL2.match("make") || WebhookURL2.match("pipedream")) {
                            myHeaders.append("Content-Type", "application/json");
                            requestOptions["headers"] = myHeaders;
                            requestOptions["body"] = JSON.stringify(blocks);
                        } else {
                            requestOptions["body"] = JSON.stringify(blocks);
                        }
                    }
                    requestOptions["method"] = "POST";
                    requestOptions["redirect"] = "follow";

                    if (which == 1) {
                        if (WebhookURL.match("ifttt")) {
                            await fetch(iftttURL, requestOptions)
                            console.log("JSON to webhooks - sent")
                        } else {
                            const response = await fetch(WebhookURL, requestOptions);
                            if (response.ok) {
                                console.log("JSON to webhooks - sent")
                            } else {
                                const data = await response.json();
                                console.error(data);
                            }
                        }
                    } else if (which == 2) {
                        if (WebhookURL2.match("ifttt")) {
                            await fetch(iftttURL, requestOptions)
                            console.log("JSON to webhooks - sent")
                        } else {
                            const response = await fetch(WebhookURL2, requestOptions);
                            if (response.ok) {
                                console.log("JSON to webhooks - sent")
                            } else {
                                const data = await response.json();
                                console.error(data);
                            }
                        }
                    }
                };
            }
        }
    },
    onunload: () => {
        window.roamAlphaAPI.ui.commandPalette.removeCommand({
            label: 'Send to Wordpress'
        });
    }
}

function sendConfigAlert() {
    alert("Please set your webhook address via the Roam Depot tab.");
}