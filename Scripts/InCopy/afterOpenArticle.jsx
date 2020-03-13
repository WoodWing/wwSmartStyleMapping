//
//  -Smart Connection afterOpen event-
//
//  callback after Article has been opened
// 
//  incoming parameters:
//      - 
//                 
//

try {
    var scriptfile = File(app.scriptPreferences.scriptsFolder.fullName+"/../EnterpriseScripts/SmartStyleMapping/apply_article_style.jsx");
    app.doScript(scriptfile, ScriptLanguage.JAVASCRIPT, 
                [], 
                UndoModes.ENTIRE_SCRIPT, "Apply article style...");
} catch (err) {
    alert( 'EVENT ERROR '+err);
}