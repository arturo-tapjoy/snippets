// default publisher options for video ads (matches legacy celtra ads)

var pubDefaultsZZZ = {
    hide_video_close_button: true,
    show_reward: true
};

/*
/// DEBUG
var pubTest = {
    hide_video_close_button: true,
    show_reward: true
};

pubDefaults = pubTest;
*/

/// END DEBUG

// construct the object for connecting pubcontrols with Celtra UI
(function(tj, pc){ 

  // read only pub properties
  pc = Object.freeze(pc);
      
  tj.timeBeforePlay = Math.round(Number(1000) / 1000);

  tj.warning = function(msg){
    var debugWindow = screen.find('DebugOut');
    if (debugWindow) {
      debugWindow.setTextAction(ctx, { text: msg }, noop);
    }
    
    console.log('Warning: ' + msg);
  };


  // show or hide close button based on publisher settings
  // showActionName || hideActionName, vidComplete
  tj.syncCloseButton = function(args){
   
    var actionName = (args.vidComplete === false && pc.hide_video_close_button) ? args.hideActionName : args.showActionName;
    
    // close button consisits of two or more celtra elements: the hotspot and graphic
    // for some reason, hiding a group of elements is also hiding the wrapper group.  
    // call out to a custom action instead
    screen.triggerAction(ctx, { eventName: actionName }, noop);
  
  };
  
  // set appropriate start message based on publisher settings
  // panelName, actionMessage, currencyAmount, currencyName
  tj.writeStartMessage = function(args){
    args.glueText = ' to get ';
    tj.writePanelMessage(args); 
  };
  
  // set appropriate done message based on publisher settings
  // panelName, actionMessage, currencyAmount, currencyName
  tj.writeDoneMessage = function(args){
    args.glueText = ' you got ';
    tj.writePanelMessage(args);
  };
  
  // update panel message
  // panelName, actionMessage, currencyAmount, currencyName, glueText
  tj.writePanelMessage = function(args){
    
    if (!pc.show_reward && (!args.currencyAmount || !args.currencyAmount)){
      tj.warning('Missing currency macro(s)');
    }

    var textBox = screen.find(args.panelName),
        msg     = !pc.show_reward ? args.actionMessage + '!': args.actionMessage + args.glueText + args.currencyAmount + ' ' + args.currencyName + '!';
      
    if (!textBox){
      tj.warning('Message Panel not found:' + args.panelName);

    } else {
      textBox.setTextAction(ctx, { text: msg }, noop);
    }        
  };


      
}( window.tapjoyPubCon = window.tapjoyPubCon || {}, window.pubControls || window.top.pubControls || pubDefaults ));  


c(); // Call 'c' when the action is considered "completed".