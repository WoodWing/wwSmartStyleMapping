//AfterSelectionAttributeChanged.jsx
//An InDesign CS JavaScript
//
//Detects changes to the attributes of the selection. 
//In this script we analyze the applied styles to define a style mapping
//dictionary in script labels
//
#targetengine "wwsmartstylemapping"

//
// prevent stacking event handlers
//
try {
	app.eventListeners.itemByName('WW_AnalyzeStyleMapping').remove();
} catch (err) {
	//
}

app.eventListeners.add(
	"afterSelectionAttributeChanged", 

	function analyze_styles(myEvent) {

//
// call function via doScripts to control undo behaviour 
//
		app.doScript( (function() {
		
						
				try {

					function pstyle_base(stylename) {
						var stylebase = stylename.substring( 0, 4 );
						return stylebase;
					
					}

					function cstyle_base(stylename) {
						var stylebase = stylename.substring( 0, 9 );
						return stylebase;
					}

		// bail out on no selection
					if (app.selection.length == 0 )
						return;


		// get selected item
					var item = app.selection[0];

		// need parent if this is not the real pageitem, but for example an InsertionPoint or Text(Selection)			
					if (!('allArticles') in item)
						item = item.parent;

		// do not redefine style mapping after article has been placed/assigned (it has a valid managedArticle)
		// (the try catch is necessary in case the managedArticle is undefined - the script will terminate otherwise)
					try { if (typeof item.managedArticle == 'undefined') return; return } catch(err) {}

		// last check: it this really a valid text item?
					if ('textStyleRanges' in item) {						
						var pseudostyles = [];
						// combinations of para styles and char styles are applied on so called
						// 'textStyleRanges'. We will iterate those textStyleRanges, which is
						// faster than iterating Paragraphs and Characters separately
						for (var p=0; p<item.textStyleRanges.length; p++) {
							var tsr = item.textStyleRanges[p];

							// get basename for the paragraph style
							var base = pstyle_base(tsr.appliedParagraphStyle.name);
							// if it's not an indesign fall back style 
							if (base[0] != '[') {
								var fullname = tsr.appliedParagraphStyle.name;
								if (tsr.appliedParagraphStyle.parent.constructor.name == 'ParagraphStyleGroup') 
									fullname = tsr.appliedParagraphStyle.parent.name + '/' + fullname;

								item.insertLabel( base, fullname );
								pseudostyles.push( base );
							}
							
							// same for character style
							var base = cstyle_base(tsr.appliedCharacterStyle.name);
							if (base[0] != '[') {
							
								var fullname = tsr.appliedCharacterStyle.name;
								if (tsr.appliedCharacterStyle.parent.constructor.name == 'CharacterStyleGroup') 
									fullname = tsr.appliedCharacterStyle.parent.name + '/' + fullname;

								item.insertLabel(base, fullname);
								pseudostyles.push( base );
							} 
						}

						// remove duplicates from the array
						pseudostyles = remove_duplicates(pseudostyles);	
						// and save it in the text item			
						item.insertLabel('pseudostyles', pseudostyles.join());	
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
					// alert(['analyze_styles',err]);
				}
		}), 
		ScriptLanguage.JAVASCRIPT,
		[],
		UndoModes.AUTO_UNDO);
	},
	false,
	{ name: "WW_AnalyzeStyleMapping"} 
);



