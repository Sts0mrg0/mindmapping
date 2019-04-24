// Copyright 2019 pushMe-pullYou authors. MIT License
/* global  * /
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const CM = { "release": "0.4.0", "date": "2019-04-20" };

CM.bookmarks = [];
CM.jsonLines = [];
CM.urlJson = "opentecture-bookmarks.json";

CM.tags = [

	"3d", "api", "architecture", "assembly", "association", "bim", "building",
	"cad", "collaboration", "component", "configure", "consultant",
	"design", "designer", "diy", "education", "engineering", "environment", "fabricate", "gallery", "gbxml","hardware",
	"ifc", "interactive", "justice",
	"landscape", "lego", "modular", "mvp", "news", "online",
	 "open-source", "parametric design", "performance", "planning", "printing",
	 "rendering", "reference", "repository", "research", "robotics",
	 "schema", "science", "service", "software", "space", "standards", "structure", "sustainability", "system",
	 "tools", "urban", "visualization"
]

CM.parseFile = function( obj ) {

	const data = obj.target ? obj.target.response : obj;

	CM.bookmarks = [];
	CM.descriptions = [];
	CM.comments = [];
	CM.tags = [];
	//index = 0;

	CM.jsonLines = data.split(/\r\n|\n/);

	for ( let line of CM.jsonLines ) {
		//console.log( 'line', line );

		if ( line.slice( 0, 1 ) !== "{" ) { continue; }

		const jsonl = JSON.parse( line );
		//console.log( 'jsonl', jsonl );

		if ( jsonl.type === "url" ) {

			CM.bookmarks.push( jsonl );

		} else if ( jsonl.type === "description" ) {

			CM.descriptions.push( jsonl );

		} else if ( jsonl.type === "comment" ) {

			CM.comments.push( jsonl );

		} else if ( jsonl.type === "tags" ) {

				CM.tags.push( jsonl );

		} else {

			console.log( 'oops', jsonl );

		}

	}
	//console.log( 'bookmarks', CM.bookmarks );

	//BLBS.setMenuHeaders(); // will change to setting an event here

	BLBF.setMenuItemsByUrl( CM.bookmarks );

};



CM.parseJson = function( index ) {

	divContents.innerHTML = tmpNewBookmark.innerHTML;

	bookmark = CM.bookmarks[ index ];
	//console.log( 'bookmark', bookmark );

	inpUrl.value = bookmark.url;
	inpName.value = bookmark.name;
	inpDateAdd.value = bookmark.dateAdd;
	inpDateUpdate.value = bookmark.dateUpdate;
	inpId.value = bookmark.id;
	inpType.value = bookmark.type;
	inpImages.value = bookmark.images,
	inpTags.value = bookmark.tags,
	selSource.value = bookmark.source;
	txtDescription.value = bookmark.description;
	selStatus.value = bookmark.status;

	if ( bookmark.status === "iframe-ok" ) {

		ifr.src = bookmark.url;

	}


/*

	commentsFiltered = CM.comments.filter( comment => comment.targetId === bookmark.id );

	commentText = commentsFiltered.length ?
		`<p>
			Comments by ${ commentsFiltered[ 0 ].author}:
			<div style=width:50rem; >${ commentsFiltered[ 0 ].content }</div>
		</p>`
		:
		""
	;

	commentId = commentsFiltered.length ?
		commentsFiltered[ 0 ].id
		:
		CM.comments.length + 1
	;

*/


}



function parseHtmlGetDescription( xhr ) {

	CM.source = xhr.target.response;
	//console.log( 'response', response );

	let description = CM.source.match( /name="description" content="(.*?)"/i );
	//console.log( 'description', description );

	description = description  ? description[ 1 ] : "";

	const txt = txtBookmarks.value.match( /"description": "(.*?)"/i );
	//console.log( 'txt', txt );

	if ( !txt || txt[ 1 ].length === 0 ) {

		txtBookmarks.value = txtBookmarks.value.replace( /\t]/, `],"description":"${ description }"` );

	} else {

		console.log( 'description exists', txt, description );

	}

}



CM.getImages = function() {

	let htm = "";

	const texts = CM.source.match( /\<img (.*?)>/gi );

	const images = texts ?

		texts.map( text => {

			const link = text.match( /src="(.*?)"/i );
			//console.log( 'link', link );

			return link ? link[ 1 ] : "";
		} )
	: "";

	//console.log( 'images', images );

	for ( image of images ) {

		if ( !image.toLowerCase().startsWith( 'http') ) {

			console.log( 'image', image );

			image = bookmark.url + image;


		}

		htm += `<p style=background-color:#eee; ><img src="${ image }" ><br>${ image }</p>`;

	}

	divImages.innerHTML = htm;

};



CM.updateSource = function( select ) {

	console.log( 'select', select.value );
	ss = select;

	let value = txtBookmarks.value;
	const tags = value.match( /"tags": \[/i );
	//console.log( 't4', txt4[ 0 ] );

	const source = value.match( /"source": "(.*?)"/i );
	//console.log( 't5', txt5 );

	if ( tags && null === source ) {

		value  = value.replace( tags[ 0 ], `"source": "${ select.value.toLowerCase() }",\n\t"tags": [` );

		txtBookmarks.value = value;

	} else if ( source ) {

		value  = value.replace( source[ 0 ], `"source": "${ select.value.toLowerCase() }"` );

		txtBookmarks.value = value;

	}

}

// "notes":"Not CORS or Iframe compatible",

function bookmarkUpdate( id ){

	const index = CM.jsonLines.findIndex( line => line.includes( `\"id":\"${ id }\"` ) )
	console.log( 'index', index );

	line = JSON.stringify( JSON.parse( txtBookmarks.value ) );
	console.log( 'txtComments.value', line );

	if ( index >= 0 ) {

		CM.jsonLines[ index ] = line;

	} else {

		CM.jsonLines.push( line );

	}

	bookmarks = [];

	for ( let line of CM.jsonLines ) {
		//console.log( 'line', line );

		if ( line.slice( 0, 1 ) !== "{" ) { continue; }

		const jsonl = JSON.parse( line );
		//console.log( 'jsonl', jsonl );

		if ( jsonl.type === "url" ) {

			bookmarks.push( jsonl );

		}

	}

	console.log( 'CM.jsonLines[ index ] ', CM.jsonLines[ index ]  );

}



//////////

function tagsAdd( id ){

	const date =  new Date( txt3[ 1 ] * 0.0001 ).toISOString();
	txtTags.value =
`{
	"dateAdded": "${ date }",
	"dateUpdate": "${ date }",
	"id":
	"type": "tags",
	"description": "",
	"content": "comments"
}
`;

}

function commentAdd( id ){

	const date =  new Date( txt3[ 1 ] * 0.0001 ).toISOString();
	txtComments.value =
`{
	"date_added": "${ date }",
	"id": "comment${ comments.length+1 }",
	"type": "comment",
	"targetId": "${ id }",
	"author": "NAME",
	"content": "comments"
}
`;

}



function addImage( id ){

	const txt = txtBookmarks.value;

	const txtNew = txt.replace( /"tags":/i, `"images" : [ "" ],\n\t"tags":` )

	txtBookmarks.value = txtNew;

}



function commentUpdate( id ){

	let index = CM.jsonLines.findIndex( line => line.includes( `\"id":\"${ id }\"` ) )
	//console.log( 'index', index );

	const line = JSON.stringify( JSON.parse( txtComments.value ) );
	//console.log( 'txtComments.value', line );

	if ( index > 0 ) {

		CM.jsonLines[ index ] = line;

	} else {

		CM.jsonLines.push( line );
		index = CM.jsonLines.length - 1;

	}

	console.log( 'CM.jsonLines[ index ] ', CM.jsonLines[ index ]  );
}


