var WebhookURL = "https://hook.kntz.it/catch/***REMOVED***";
var blog = [];
var blogEmail=[];
blog[1]="WILT";
blog[2]="PracticeCoach";
blog[3]="AlstonvilleClinic"
blogEmail[1]="***REMOVED***@post.wordpress.com";
blogEmail[2]="***REMOVED***@post.wordpress.com";
blogEmail[3]="***REMOVED***@post.wordpress.com";
var s = document.createElement("script");
s.src = "https://unpkg.com/showdown/dist/showdown.min.js";
s.id = "showdown";
s.async = false;
s.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(s);

async function sendToWordpress(blogID){
      const uid = window.roamAlphaAPI.ui.getFocusedBlock()?.["block-uid"];
      if (uid == undefined) {
                    alert("Please make sure to focus a block before trying to send to Wordpress");
                    return;
       }
      var dataString;
      var thisBlockInfo = window.roamAlphaAPI.data.pull("[:block/string]", [":block/uid", uid]);
      var apiCall = `[:find ?ancestor (pull ?block [*])
                      :in $ ?b
                       :where [?ancestor :block/uid ?b]
                       [?ancestor :block/string]
                       [?ancestor :block/order]
                       [?block :block/parents ?ancestor]]`;

      var childBlocks = await window.roamAlphaAPI.q(apiCall, uid);
      var blocks = {};
      blocks['subject'] = thisBlockInfo[":block/string"];

     
      converter = new showdown.Converter();
      var body = "";
      var childrenOrdered = [];
      var n=0;
      for (var i in childBlocks) {
          dataString = childBlocks[i][1].string;
          dataOrder = childBlocks[i][1].order;
          converter = new showdown.Converter();
          html      = converter.makeHtml(dataString);
          childrenOrdered[dataOrder]=html
          n=n+1;         
      }

      for (let j = 0; j < n; j++) { 
         body = body +  childrenOrdered[j]+ "\n\n"; 
      }

      blocks['body'] = body;
      blocks['email'] = blogEmail[blogID];
      var myHeaders = new Headers();
      var requestOptions = {};
      requestOptions["body"] = JSON.stringify(blocks);
      requestOptions["method"] = "POST";
      requestOptions["redirect"] = "follow";

      const response = await fetch(WebhookURL, requestOptions);
      if (response.ok) {
          console.log("Roam to Wordpress - sent")
      } else {
          const data = await response.json();
          console.error(data);
      }
}

window.roamAlphaAPI.ui
  .commandPalette
  .addCommand({label: 'Blog to ' + blog[1], 
               callback: () => sendToWordpress(1)});

if (blog[2] != ""){
    window.roamAlphaAPI.ui
      .commandPalette
      .addCommand({label: 'Blog to ' + blog[2], 
                   callback: () => sendToWordpress(2)});
}
if (blog[3] != ""){
    window.roamAlphaAPI.ui
      .commandPalette
      .addCommand({label: 'Blog to ' + blog[3], 
                   callback: () => sendToWordpress(3)});
}