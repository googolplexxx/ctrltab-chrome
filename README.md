# ctrltab-chrome
What I absolutely hate about Google Chrome is that it lacks alt+Tab-like behavior when you use ctrl+Tab which is very crucial to me. I used Firefox for quite a while only for that reason. But recently I found the solution for this problem. I just downloaded [this](https://chrome.google.com/webstore/detail/ctrl%2Btab-mru/ialfjajikhdldpgcfglgndennidgkhik) extension and it pretty much solved the issue, except it had very poor user interface. I decided to change it a bit, so that it would be comfortable to use. I changed color theme to dark and added preview for each open tab in menu.
## Installation
Open chrome://extensions and toggle Developer mode switch. "Load unpacked" button will appear. Click it and select the folder with extension. I suggest you moving this folder to the safe place, e.g. chrome folder.
## Change key shortcuts to ctrl+Tab and ctrl+Shift+Tab
By default chrome doesn't allow users to set such shortcuts. However, this restriction can be easily bypassed:  
1) Open the extensions page (chrome://extensions)  
2) Find the extension in the list and click "Details" button  
3) Copy id of the extension from address bar  
4) Open the shortcuts page (chrome://extensions/shortcuts)  
5) Open the developer console (ctrl+Shift+I)  
6) Paste the following:  
`chrome.developerPrivate.updateExtensionCommand({
    extensionId: "<extension-id>",
    commandName: "next",
    keybinding: "Ctrl+Tab"
});
chrome.developerPrivate.updateExtensionCommand({
    extensionId: "<extension-id>",
    commandName: "previous",
    keybinding: "Ctrl+Shift+Tab"
});`  

That is all, you can now use the extension!
