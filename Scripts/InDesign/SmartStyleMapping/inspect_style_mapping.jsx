#targetengine "wwsmartstylemapping"

//
//
//	-apply_article_style-
//
//
//	This script replaces paragraph styles and character styles in all text frames of an article.
//	The replacement styles are organized in	style groups. 
//	The Style Group name is taken from the frame's ObjectStyle name (if applied)
//  or from the (indesign) article name.
//
//	Each (indesign) article/frame on the layout has its unique style group and as such can be
//	individually styled 
//
//	Preferably this script is called automatically after an article is placed or updated.
//	For the demo this script is triggered by 'afterPlace' or by 'afterRefreshArticle'
//




(function inspect_styles() {
	
	try {
		// script operates on active document
		if ("activeDocument" in app)
			var doc = app.activeDocument;
		else
			var doc = app.documents[0];

		// lookup article based on selection or script argument
		var article = lookup_article();
		
		if (article != null) {
			
 			var textitems = article_textitems(article);
			var list = "Inspect Stylemapping for "+article.name+"\r"		
			for (var i=0; i<textitems.length; i++) {
				var item = textitems[i]	
				app.select(item);
				
				list += "\r-- " + item.elementLabel + " --\r";
				var pseudostyles = item.extractLabel('pseudostyles');
				pseudostyles = pseudostyles.split(',');
				for (var j=0; j<pseudostyles.length; j++) {
					list += pseudostyles[j] + ' => ' + item.extractLabel(pseudostyles[j]) + "\r";		
				}
				
				
// 				alert(item.extractLabel('stylekeys'));
			}
			alert(list);
		}

		// 
		// -- helper functions --
		//

		//
		//	- lookup_article -
		//
		//	Find article to apply style on. 
		//	1. selected article
		//	2. 'pageitem' refers to target frame when afterPlace.jsx is triggered
		//	3. 'Core_ID' refers to updated article when afterRefreshArticle.jsx is triggered
		//
		function lookup_article() {
			try {
				if (app.selection.length > 0) {
	 				var item = app.selection[0];
				
					if (!('allArticles' in item)) {
						item = item.parentTextFrames[0];
					}
				}

				if (('allArticles' in item)) {
					if (item.allArticles.length) {
						return item.allArticles[0];
					}
				}

				return null;
			} 
			catch (err) {
				alert(['lookup_article',err]);
			}
		}


		//
		//	- article_textitems -
		//

		function article_textitems (article) {
			var textitems = []; 
			// iterate members to collect text items
			var members = article.articleMembers;
			for (var i=0; i<members.length; i++) {
		
				// article member represents a page item
				var item = members[i].itemRef;
			
				// if the pageitem implements 'parentStory' it is a text frame
				if ('parentStory' in item) {
					textitems.push(item);
				}
				
				// Is item a Group ?  
				if ('ungroup' in item) { 
// 					textitems += item.textFrames;
					for (var j=0; j<item.textFrames.length; j++) {
						textitems.push(item.textFrames[j]);
					}
				}
			}
			return textitems;
		}


		//
		//	- lookup_style -
		//
		//	Lookup matching style(name) in stylegroup collection
		//

		function style_base(stylename, mode) {

			var stylebase = stylename.split(/[ _-]/);
			return stylebase[0];
			
		}

		function lookup_style(styles, stylename, mode) {
			try {
				var stylebase = style_base(stylename, mode);

				for (var i=0; i<styles.length; i++) {
					if (styles[i].name.indexOf(stylebase) == 0)
						return (styles[i]);
				}
			} catch (err) {
				// do not expect any errors, just in case...
				alert(['lookup_style',err]);
			}
		}
		
		function remove_duplicates(array_in) {
			array_out = [];
			array_in.sort();
			do {
				if ((v = array_in.pop()) != array_out[0]) {
					array_out.push(v);
					array_out.reverse();
				}
			} while (array_in.length);
			return array_out;
		}

		
	} catch (err) {
		// do not expect any errors, just in case...
		alert(['analyze_styles',err]);
	}
})();