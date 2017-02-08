// Pub Controls
// Developer: Alan Peters

// default publisher options for video ads (matches legacy celtra ads)
var pubDefaults = {
    autoplay: true,
    video_autoplay_timer: false,
    video_autoplay_timer_duration: 4000,
    hide_video_close_button: false,
    show_reward: true
};

/*
/// DEBUG
var pubTest = {
    autoplay: true,
    video_autoplay_timer: true,
    video_autoplay_timer_duration: 4000,
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
      
  tj.timeBeforePlay = Math.round(Number(pc.video_autoplay_timer_duration) / 1000);

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
        msg     = !pc.show_reward ? args.actionMessage : args.actionMessage + args.glueText + args.currencyAmount + ' ' + args.currencyName;
      
    if (!textBox){
      tj.warning('Message Panel not found:' + args.panelName);

    } else {
      textBox.setTextAction(ctx, { text: msg }, noop);
    }        
  };
  
   // set up time remaining 
  // countdownBox, videoPlayerName
  tj.initPlayheadCounter = function(args){
         
    args.videoPlayer = screen.find(args.videoPlayerName);
    if (!args.videoPlayer){
      tj.warning('Video Player not found:' + args.videoPlayer);

    } else {
       
      tj.runPlayheadTimer(args);   
    }

  };
  // timeVal, videoPlayer
  tj.runPlayheadTimer = function(args){
  
    args.timeVal = tj.getTimeRemaining(args);
    if (args.timeVal > 0){
        tj.setCounterText(args);        
    }
    return setTimeout( function(){tj.runPlayheadTimer(args);}, 1000 );   
  };


  // calc time remaining from a videoPlayer
  // videoPlayer
  tj.getTimeRemaining = function(args){
    
    if (!args.videoPlayer){
      tj.warning('no video player provided');
      return;
    }
    
    var duration      = args.videoPlayer.getDuration(),
        currentTime   = args.videoPlayer.getCurrentTime(),
        timeRemaining = Math.abs(Math.round(duration - currentTime));
        
    return timeRemaining;    
  };  


  // set up countdown timer based on publisher settings 
  // if starts then calls showCountdownActionName 
  // then either way calls back completeCountdownActionName when video should play
  // countdownBox, showCountdownActionName, completeCountdownActionName
  tj.initAutoplayTimer = function(args){
  
    if( !pc.autoplay ){
      screen.triggerAction(ctx, { eventName: args.showManualControlsActionName }, noop);
    } else if ( pc.video_autoplay_timer ){
      screen.triggerAction(ctx, { eventName: args.showCountdownActionName }, noop);
      tj.runAutoplayTimer(args);
    } else {
      screen.triggerAction(ctx, { eventName: args.completeCountdownActionName }, noop);
    } 
  };
  
  // run the auto-play timer and update the text
  tj.runAutoplayTimer = function(args){
  
    if (tj.timeBeforePlay > 0){
      args.timeVal = tj.timeBeforePlay;
      tj.setCounterText(args);
      --tj.timeBeforePlay;
      return setTimeout( function(){tj.runAutoplayTimer(args);}, 1000 );    
    } else {
      screen.triggerAction(ctx, { eventName: args.completeCountdownActionName }, noop);
    }
  };
  
  // utility to update the value of a timer dispay text field passed into 
  // countdownBox, timeVal
  tj.setCounterText = function(args){
    var textBox = screen.find(args.countdownBox);
     
    if (!textBox){
      tj.warning('Countdown not found:' + args.countdownBox);

    } else {
      var val = Number(args.timeVal) > 0 ? '' + args.timeVal : '';
      textBox.setTextAction(ctx, { text: '' + args.timeVal }, noop);
    }    
  };
  
      
}( window.tapjoyPubCon = window.tapjoyPubCon || {}, window.pubControls || pubDefaults ));  





c(); // Call 'c' when the action is considered "completed".

