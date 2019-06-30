/* global  */
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const BBF = {

	"copyright": "Copyright 2019 pushMe-pullYou authors. MIT License",
	"date": "2019-06-08",
	"description": "Display bookmarks by domain",
	"version": "0.5.0-0",

};


BBF.getMenuBookmarksByFilter = function() {

	const htm =
	`

		<p>Bookmarks by filter BBF v${ BBF.version }</p>

		<p>${ BBF.description }</p>

		<p>
			Search: <input type=search name="q" oninput=BBF.filterBookmarks(this) ;>
		</p>

		<div id=BBFdivBookmarksByFilter></div>

		<hr>

	</details>
	`;

	return htm;

}


BBF.setMenuItemsByUrl = function( bookmarks = BM.jsonLines ){
	// https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string

	//const bookmarks = BM.jsonLines;
	const a = document.createElement( 'a' );
	const subdomains = ["www.", "m.", "en." ];

	let sites = [];
	let bookmarksSelected = [];

	for ( let bookmark of bookmarks ) {

		if ( ! bookmark.url ) { continue; }

		a.href = bookmark.url;
		let site = a.hostname;

		const subdomain = subdomains.filter( bit => site.startsWith( bit ) === true );
		//console.log( 'subdomain', subdomain );

		site = site.replace ( subdomain, "" );
		//console.log( 'site', site );

		let item = sites.find( item => item === site );
		//console.log( 'item', item );

		if ( !item ) { sites.push( site ); }

	}

	sites = sites.sort();
	//console.log( 'sites', sites );

	let siteHtm = `${ bookmarks.length } links`;

	for ( let site of sites ) {
		//console.log( 'site', site );

		marks = bookmarks.filter( bookmark => bookmark.url && bookmark.url.includes( site ) );
		//console.log( 'marks', marks );

		bookmarksSelected.push( ...marks );

		let markHtm = "";

		for ( let mark of marks ) {

			const index = bookmarks.indexOf( mark );

			markHtm +=
			`
			<div style=margin-bottom:0.5rem; >
				<button onclick=BM.parseJson("${ index }"); title="${ mark.description }"  >${ mark.name }</button>
				<a href="${ mark.url }" target="_blank" title="open link in new tab"  >❐</a>
			</div>
			`;

		}

		siteHtm +=
		`
			<details>

				<summary>${ site } - ${ marks.length }</summary>

				${ markHtm }

			</details>
		`;

	}

	BBFdivBookmarksByFilter.innerHTML = siteHtm;

	BM.setBookmarks( bookmarksSelected );

};



BBF.filterBookmarks = function ( input ) {

	const str = input.value;
	//console.log( 'str', str );
	const a = document.createElement( 'a' );

	BBF.bookmarks = [];

	if ( str === "" ) {

		for ( let line of BM.lines ) {
			//console.log( 'line', line );

			//if ( line.slice( 0, 1 ) !== "{" ) { continue; }

			const jsonl = JSON.parse( line );
			//console.log( 'jsonl', jsonl );

			if ( jsonl.type === "url" ) { BBF.bookmarks.push( jsonl ); }

		}

	} else {

		for ( let line of BM.lines ) {

			//if ( line.slice( 0, 1 ) !== "{" ) { continue; }
			//console.log( 'line', line );

			const jsonl = JSON.parse( line );
			//console.log( 'jsonl', jsonl.url );

			if ( jsonl.url ) {

				a.href = jsonl.url;
				const site = a.hostname;
				//console.log( 'site', site );

				if ( site.includes( str ) ) { BBF.bookmarks.push( jsonl ); }

			}

		}

	}

	BBF.setMenuItemsByUrl( BBF.bookmarks );

}