/*
 * $Id: objects.js Oct 9, 2023 9:41:08 AM tta2627$
 * 
 * Copyright (C) 2023 Maider Huarte Arrayago
 * 
 * This file is part of TTA2627_08v3_www.zip.
 * 
 * TTA2627_08v3_www.zip is intended
 * for learning purpouses only.
 * 
 * TTA2627_08v3_www.zip is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * TTA2627_08v3_www.zip is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details
 * <http://www.gnu.org/licenses/>.
 */


var pageT = {//V3
	load: function(i) {
//		console.log("load 1");

		$("#question-" + i).text("QUESTION " + (parseInt(i) + 1) + ": " + tests[i].question);

		$("label[id|='label-radio-choice-" + i + "']").each(
			function(rI) {
				$(this).text(tests[i].resp[rI].text);
			}
		);

//		console.log("load 2");
	}
}

var user = {
	id: null,
	alias: null,
	uid: 'tty4ThQOkCZs4iQhn6VW910n7VB3'
};
