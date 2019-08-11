"use strict";

/* global BM, MDUdet, MDUdivBookmarksByTag */
// jshint esversion: 6
// jshint loopfunc: true

const MDU = {

	copyright: "Copyright 2019 Opentecture authors. ",
	date: "2019-08-10",
	description: "Search for duplicate text strings in the JSON file",
	license: "MIT License",
	version: "0.5.05-0MDU",

};

MDU.getMenuDuplicates= function() {

	const htm =
	`
		<details id=MDUdet ontoggle=MDU.setMenuDuplicates(); >

			<summary>Filter duplicates MDU</summary>

			<p>${ MDU.description }</p>

			<p>
				Search: <input type=search name="q" oninput=MDU.filterBookmarks(this) ;>
			</p>

			<div id=MDUdivJsonLines ></div>

			<hr>

		</details>
	`;

	return htm;

};



MDU.setMenuDuplicates = function( bookmarks = BOP.bookmarks ){

	if ( MDUdet.open === false ) return;

	inpTagsIgnore.value = "duplicates";

	bookmarks = COR.getBookmarksFilterByTagsToIgnore( bookmarks );

	let markHtm = `<p id=pDupes ></p>`;

	let dupes = [];

	bookmarks.forEach( ( bookmark, count ) => {

		const match = BOP.bookmarks.filter( bopmark => bopmark.url === bookmark.url );

		if ( match.length > 1 ) {

			console.log( '', match );

			const index = BOP.bookmarks.indexOf( bookmark );

			markHtm +=
			`
				<div style=margin-bottom:0.5rem; >
					<div style="display:inline-block" >${ count + 1 }. </div>
					<div style="display:inline-block;width:80%;" ><button onclick=BED.setTargetToEditDialog("${ index }"); title="${ bookmark.description }"  >${ bookmark.name }</button></div>
					<div style="display:inline-block" ><a href="${ bookmark.url }" target="_blank" title="open link in new tab"  >❐</a></div>
				</div>
			`;

			dupes.push( bookmark );

		}

	} );

	MDUdivJsonLines.innerHTML = markHtm;

	pDupes.innerHTML = `${ dupes.length } duplicates`;
	
	BOP.setBookmarks( dupes.sort() );

};



MDU.filterBookmarks = function ( input ) {

	const str = input.value;
	//console.log( 'str', str );
	const a = document.createElement( 'a' );

	let bookmarks = [];

	if ( str === "" ) {

		bookmarks = BOP.bookmarks;

	} else {

		bookmarks = BOP.bookmarks.filter( bookmark => {

			const bookmarkString = JSON.stringify( bookmark );

			return bookmarkString.includes( str );

		} );

	}

	MDU.setMenuSearch ( bookmarks );

};