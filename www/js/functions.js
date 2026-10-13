/*
 * $Id: functions.js Oct 9, 2023 9:41:54 AM tta2627$
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

function check(i) {//V1
	//	console.log("check 1");

	results.answered++;

	var answer = $("input[name='radio-choice-" + i + "']:checked").val();

	if (tests[i].resp[answer].isCorrect) {
		alert("CORRECT");
		results.corrects++;
	}
	else {
		alert("WRONG");
		$("#button-" + i + "-2").css("display", "block");
	}

	$(".res-1").text("" + results.corrects + "/" + results.answered);
	$(".res-2").text("" + (results.corrects * 100 / results.answered).toFixed(2) + "%");

	$("label[id|='label-radio-choice-" + i + "']").each( //V2
		function(rI) {
			if (!tests[i].resp[rI].isCorrect)
				$(this).css("color", "darkred");
			else
				$(this).css({ "color": "white", "background-color": "rgb(100, 150, 100)", "font-size": "24px" });
		}
	);

	$("#button-" + i + "-1").addClass("ui-disabled"); //V2

	//	console.log("check 2");
}
