#targetengine "wwsmartstylemapping"
//
//	

if ( app.name.indexOf('Server') > 0 ) 
{
	app.consoleout("Server mode, UI script functions not loaded.");
	exit(0); // function not available in InDesign client
}


// ============= ============= ============= ============= ============= =============
// DEFINE MENUS
//
//	[0]		To which Top Menu to add the new menu item
//	[1]		To which context menu(s) to add the new menu item:
//			'$ID/RtMouseLayout'		- general context menu for selected page items (Selection Tool)
//			'$ID/RtMouseText'		- general context menu for selected text (Text Selection Tool)
//			'$ID/RtMouseDefault'	- general context menu for layout (no selection)
//	[2]		Display name, '-' = separator
//	[3]		Function to invoke
//	[4]		Check before display
//

var MyMenuItems = Array(

	[ 'Extra',  ['$ID/RtMouseLayout'], 
				'Inspect Style Mapping', 	
				(function(){ 
					app.doScript(File(app.scriptPreferences.scriptsFolder.fullName+"/../EnterpriseScripts/SmartStyleMapping/inspect_style_mapping.jsx")); }), 
				_checkselection ],

);

//
//	before display (enable/disable) helper functions
//
function _checkdocument() {
	return app.documents.length > 0;
}

function _checkselection() {
	return app.documents.length > 0 && app.selection.length > 0;
}

function _checklocalimages() {
	return app.documents.length > 0;
}

function _checkopenarticle () {
	if (app.documents.length == 0)
		return false;
		
	if (app.selection.length == 0)
		return false;
	
	for (var i=0; i<app.selection.length; i++) {
		if ("parentStory" in app.selection[i]) 
		 	if (!app.selection[i].parentStory.textLock)
		 		return true;
	}
	
	return false;
}


// ============= ============= ============= ============= ============= =============
// MENU FUNCTIONS


function _separator() 
{
}





// ============= ============= ============= ============= ============= =============
// 
// INSTALL MENUS
// DO NOT CHANGE BELOW
// 
// ============= ============= ============= ============= ============= =============


for (var i=0; i<MyMenuItems.length; i++)
{
	// add to smart connection menu
	var myScriptAction = app.scriptMenuActions.add(MyMenuItems[i][2]);
	var myEventListener = myScriptAction.eventListeners.add("onInvoke", MyMenuItems[i][3]);
	
	try {
		var MyMenu = app.menus.item("$ID/Main").submenus.add(MyMenuItems[i][0]);	
	} catch (err) {
		var MyMenu = app.menus.item("$ID/Main").submenus.item(MyMenuItems[i][0]);
	}
	
	var MyMenuItem = MyMenu.menuItems.add(myScriptAction);
	
	myScriptAction.eventListeners.add("beforeDisplay", 
		(function(action) {
			return function(event){
				event.target.enabled = action();
			}
		 } )(MyMenuItems[i][4]));

	for (var k=0;k<MyMenuItems[i][1].length; k++) {
		app.menus.item(MyMenuItems[i][1][k]).menuItems.add(myScriptAction);
	}
}