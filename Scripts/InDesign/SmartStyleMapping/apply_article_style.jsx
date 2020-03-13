#targetengine "wwsmartstylemapping"

//
//
//	-apply_article_style-
//
//
//	This script replaces paragraph styles and character styles in all text frames of an article.
//	
//
//	Preferably this script is called automatically after an article is placed or updated.
//	For the demo this script is triggered by 'afterPlace' or by 'afterRefreshArticle'
//



(function apply_article_style() {
	
	try {
		// script operates on active document
		var doc = app.documents[0];

		// get mode for applying styles:
		// 'all'		-> find replacement for every style
		// 'pseudo'		-> find replacement only for 'pseudo' styles
		var mode = lookup_context();

		// lookup article based on selection or script argument
		var article = lookup_article();
		
		if (article != null) {
			// now update styles on each member of the article
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
					for (var j=0; j<item.textFrames.length; j++) {
						textitems.push(item.textFrames[j]);
					}
				}
			}

			var do_parastyle = true;
			
			for (var i=0; i<textitems.length; i++) {
				var item = textitems[i]	

				//
				var obs = item.appliedObjectStyle.name;
				if (obs[0] != '[') {
					do_parastyle = !(item.appliedObjectStyle.enableParagraphStyle);
				}
				
				// we need the story, as it contains the text
				var story = item.parentStory;
			


				// combinations of para styles and char styles are applied on so called
				// 'textStyleRanges'. We will iterate those textStyleRanges, which is
				// faster than iterating Paragraphs and Characters separately
				for (var p=0; p<story.textStyleRanges.length; p++) {
					var tsr = story.textStyleRanges[p];
					// app.select(tsr);

					// get the style objects from the new group
					// and apply them (ignore error if style does not exist in new group)
					if (do_parastyle) {
						try {
							var psk = tsr.appliedParagraphStyle.name;
							var ps = null;

							if (psk[0] != '[') {
								if (mode == 'all') psk = pstyle_base(psk);
								var psk = item.extractLabel(psk);
								
								if (psk) {
									psk = psk.split('/').reverse();
									if (psk.length>1) {
										psg = doc.paragraphStyleGroups.itemByName(psk[1]);
									} 
									else {	
										psg = doc;
									}
									ps = psg.paragraphStyles.itemByName(psk[0]);
								}

								if (ps) {
									try {
										tsr.applyParagraphStyle(ps);
									} 
									catch (err) {
										alert(['Alineastijl "' + psk +  '" niet gevonden\r']);
									}
								}
							}
						} catch(err) {
							alert(err);
	// 						tsr.fillColor = 'Cyan';
						}
					}				
					
				}

				// combinations of para styles and char styles are applied on so called
				// 'textStyleRanges'. We will iterate those textStyleRanges, which is
				// faster than iterating Paragraphs and Characters separately
				for (var p=0; p<story.textStyleRanges.length; p++) {
					var tsr = story.textStyleRanges[p];
					app.select(tsr);

					try {
						var csk = tsr.appliedCharacterStyle.name;
						var cs = null;

						// alert([mode,csk,cstyle_base(csk),item.extractLabel(csk)]);

						if (csk[0] != '[') {
							
							if (mode == 'all') csk = cstyle_base(csk);
							var csk = item.extractLabel(csk);
							
							if (csk) {
								csk = csk.split('/').reverse();
								if (csk.length>1) {
									csg = doc.characterStyleGroups.itemByName(csk[1]);
								} 
								else {	
									csg = doc;
								}
								cs = csg.characterStyles.itemByName(csk[0]);
								// alert([csk,cs.name]);
							}

							if (cs) {
								try {
									tsr.applyCharacterStyle(cs);
								} catch (err) {
									alert(['Tekenstijl "' + csk +  '" niet gevonden\r']);
								}
							}
						}
					} catch(err) {		
						alert(err);			
// 						tsr.fillColor = 'Cyan';					
					}		
				}
			}
		}

		// 
		// -- helper functions --
		//

		//
		//	- lookup_context -
		//
		function lookup_context() {

			// if (app.selection.length > 0) 
			// 	return 'all';
			
			// if (app.scriptArgs.isDefined('pageitem'))
			// 	return 'all';

			if (app.scriptArgs.isDefined('Core_ID'))
				return 'pseudo';

			return 'all';
		}


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

				if (!item && app.scriptArgs.isDefined('pageitem')) {
					item = app.documents[0].allPageItems.getItemByID(app.scriptArgs.get('pageitem'));
				}
				
				if (!item && app.scriptArgs.isDefined('Core_ID')) {
					var core_id = app.scriptArgs.get('Core_ID');
					var managedarticles = app.documents[0].managedArticles
					for (var i=0; i<managedarticles.length; i++) {
						var managedarticle = managedarticles[i];
						if (managedarticle.entMetaData.get('Core_ID') == core_id) {
							if (managedarticle.components[0].textContainers.length > 0)
								item = managedarticle.components[0].textContainers[0];
						}
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
				// alert(['lookup_article',err]);
				return null;
			}
		}
		
		function pstyle_base(stylename) {

			var stylebase = stylename.split(/[ _-]/);
			return stylebase[0];
			
		}

		function cstyle_base(stylename) {

			var stylebase = stylename.split(/[ _-]/);
			return stylebase[0] + '_' + stylebase[1] ;
			
		}

		
	} catch (err) {
		// do not expect any errors, just in case...
		alert(['apply_article_style',err]);
	}
})();