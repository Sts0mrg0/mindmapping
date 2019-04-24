// Copyright 2019 pushMe-pullYou authors. MIT License
/* global  * /
/* jshint esversion: 6 */
/* jshint loopfunc: true */

const FM = { "release": "1.1", "date": "2019-03-31" };



FM.requestFile = function( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	//xhr.onprogress = function( xhr ) { console.log( 'bytes loaded:', xhr.loaded  ); }; /// or something
	xhr.onload = callback;
	xhr.send( null );

};



FM.openFile = function( files ) {

	const reader = new FileReader();
	reader.onload = function( event ) {

		CM.parseFile( reader.result );

	}

	reader.readAsText( files.files[ 0 ] );

};





FM.parseMarkdownToHtml = function( xhr ) {

	const response = xhr.target.response;
	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const html = converter.makeHtml( response );

	divContents.innerHTML = html;
	window.scrollTo( 0, 0 );

}




FM.saveFile = function() {

	const lines = FM.jsonLines.join( "\n" );

	let blob = new Blob( [ lines ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = 'opentecture-bookmarks.json';
	a.click();
	a = null;

};
