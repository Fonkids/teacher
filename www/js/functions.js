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

function startAudioRecord() {
    console.log("Grabazioa hasteko botoia sakatu da");

    if (typeof audio === "undefined" || typeof audio.doStartRecord !== "function") {
        console.error("Audio objektua edo doStartRecord() funtzioa ez dago erabilgarri");
        alert("Ezin da grabazioa hasi: audio sistema ez dago erabilgarri.");
        return;
    }

    $("#audio-file-name").text("");
    $("#audio-player").hide();

    $("#button-audio-start").addClass("ui-disabled");
    $("#button-audio-stop").removeClass("ui-disabled");

    try {
        audio.doStartRecord();
    } catch (error) {
        console.error("Grabazioa hasteko errorea:", error);
        alert("Errorea grabazioa hastean.");
        $("#button-audio-start").removeClass("ui-disabled");
        $("#button-audio-stop").addClass("ui-disabled");
    }
}

function buildHeader() {
    return $(
        '<div data-role="header" data-position="fixed" data-id="app-header">' +
        '  <table style="width:100%; table-layout:fixed;"><tbody><tr>' +
        '    <td style="text-align:left;width:33%"><a href="#page-t-9" class="btn-info ui-btn ui-icon-info ui-btn-icon-left ui-mini ui-corner-all">Info</a></td>' +
        '    <td style="text-align:center;width:34%">Logo</td>' +
        '    <td style="text-align:right;width:33%"><a href="#page-t-10" class="btn-settings ui-btn ui-icon-gear ui-btn-icon-left ui-mini ui-corner-all">Ezarpenak</a></td>' +
        '  </tr></tbody></table>' +
        '</div>'
    );
}

function buildFooter(back, backLabel, next, nextLabel, nextIcon) {
    var html =
        '<div data-role="footer" data-position="fixed" data-id="app-footer">' +
        '<table style="width:100%; table-layout:fixed; text-align:center;"><tr>' +
        '<td style="text-align:left;width:45%">' + backBtn(back, backLabel) + '</td>' +
        '<td style="width:10%"><p style="margin:0">2026</br>2027</p></td>' +
        '<td style="text-align:right;width:45%">' + nextBtn(next, nextLabel, nextIcon) + '</td>' +
        '</tr></table></div>';
    return $(html);
}

function backBtn(target, label) {
    if (target === "exit") {
        return '<a href="#" class="btn-exit ui-btn ui-icon-arrow-l ui-btn-icon-left ui-mini ui-corner-all">Irten</a>';
    }
    if (target === "back") { // history back
        return '<a href="#" data-rel="back" class="ui-btn ui-icon-arrow-l ui-btn-icon-left ui-mini ui-corner-all">' + label + '</a>';
    }
    return '<a href="' + target + '" class="btn-back ui-btn ui-icon-arrow-l ui-btn-icon-left ui-mini ui-corner-all" data-transition="slidefade" data-direction="reverse">' + label + '</a>';
}

function nextBtn(next, label, icon) {
    return next
        ? '<a href="' + next + '" class="btn-next ui-btn ui-icon-' + (icon || "plus") + ' ui-btn-icon-right ui-mini ui-corner-all" data-transition="slidefade">' + label + '</a>'
        : '';
}


// ---------- Audio grabaketa (berrerabilgarria) ----------
// Une berean grabazio bakarra egon daiteke martxan.
var activeRecorder = null;

function startAudioRecord($rec) {
    if (activeRecorder) {
        alert("Beste grabazio bat martxan dago.");
        return;
    }
    if (typeof audio === "undefined" || typeof audio.doStartRecord !== "function") {
        alert("Ezin da grabazioa hasi: audio sistema ez dago erabilgarri.");
        return;
    }

    var started = false;
    try {
        started = audio.doStartRecord() !== false;
    } catch (error) {
        console.error("Grabazioa hasteko errorea:", error);
    }
    if (!started) return;

    activeRecorder = $rec;
    $rec.find(".rec-file-name").text("");
    $rec.find(".rec-player").hide();
    $rec.find(".btn-rec-start").button("disable");
    $rec.find(".btn-rec-stop").button("enable");
}

function stopAudioRecord($rec) {
    if (!activeRecorder || activeRecorder[0] !== $rec[0]) return;

    var fileFullPath = appDirs.baseStorageAudio() + "recording_" + Date.now() + ".aac";

    audio.doStopRecord_E(
        fileFullPath,
        function() {
            activeRecorder = null;
            $rec.data("audioPath", fileFullPath); // ruta gordetzeko (galdera gordetzean erabili)
            $rec.find(".rec-file-name").text("Grabazioa gordeta");
            $rec.find(".rec-source").attr("src", fileFullPath);
            var player = $rec.find(".rec-player").show()[0];
            player.load();
            $rec.find(".btn-rec-stop").button("disable");
            $rec.find(".btn-rec-start").button("enable");
        },
        function(error) {
            activeRecorder = null;
            console.error("Audio error:", JSON.stringify(error));
            alert("Errorea audioa gordetzean.");
            $rec.find(".btn-rec-stop").button("disable");
            $rec.find(".btn-rec-start").button("enable");
        }
    );
}

$(document).on("click", ".btn-rec-start", function () {
    startAudioRecord($(this).closest(".audio-recorder"));
});
$(document).on("click", ".btn-rec-stop", function () {
    stopAudioRecord($(this).closest(".audio-recorder"));
});

// ---------- Ariketa formularioa (P5) ----------
function updateExerciseForm() {
    var type = $("#exercise-type-select").val();
    var statement = $("#statement-type-select").val();
    var answer = $("#answer-type-select").val();

    $("#exercise-options").toggle(type !== "");

    $("#statement-text").toggle(statement === "text");
    $("#statement-audio").toggle(statement === "audio");

    $("#answers-block").toggle(type === "multiple-choice");
    $("#answers-block .answer-text").toggle(answer === "text");
    $("#answers-block .answer-audio").toggle(answer === "audio");
    $("#answers-block .answer-image").toggle(answer === "image");
}

$(document).on("change", "#exercise-type-select, #statement-type-select, #answer-type-select", updateExerciseForm);

function buildHeader() {
    return $(
        '<div data-role="header" data-position="fixed" data-id="app-header">' +
        '  <table style="width:100%; table-layout:fixed;"><tbody><tr>' +
        '    <td style="text-align:left;width:33%"><a href="#page-t-9" class="btn-info ui-btn ui-icon-info ui-btn-icon-left ui-mini ui-corner-all">Info</a></td>' +
        '    <td style="text-align:center;width:34%">Logo</td>' +
        '    <td style="text-align:right;width:33%"><a href="#page-t-10" class="btn-settings ui-btn ui-icon-gear ui-btn-icon-left ui-mini ui-corner-all">Ezarpenak</a></td>' +
        '  </tr></tbody></table>' +
        '</div>'
    );
}

function buildFooter(back, backLabel, next, nextLabel, nextIcon) {
    var html =
        '<div data-role="footer" data-position="fixed" data-id="app-footer">' +
        '<table style="width:100%; table-layout:fixed; text-align:center;"><tr>' +
        '<td style="text-align:left;width:33%">' + backBtn(back, backLabel) + '</td>' +
        '<td style="width:34%"><h4 style="margin:0">2026-2027</h4></td>' +
        '<td style="text-align:right;width:33%">' + nextBtn(next, nextLabel, nextIcon) + '</td>' +
        '</tr></table></div>';
    return $(html);
}

function backBtn(target, label) {
    if (target === "exit") {
        return '<a href="#" class="btn-exit ui-btn ui-icon-arrow-l ui-btn-icon-left ui-mini ui-corner-all">Irten</a>';
    }
    if (target === "back") { // history back
        return '<a href="#" data-rel="back" class="ui-btn ui-icon-arrow-l ui-btn-icon-left ui-mini ui-corner-all">' + label + '</a>';
    }
    return '<a href="' + target + '" class="btn-back ui-btn ui-icon-arrow-l ui-btn-icon-left ui-mini ui-corner-all" data-transition="slidefade" data-direction="reverse">' + label + '</a>';
}

function nextBtn(next, label, icon) {
    return next
        ? '<a href="' + next + '" class="btn-next ui-btn ui-icon-' + (icon || "plus") + ' ui-btn-icon-right ui-mini ui-corner-all" data-transition="slidefade">' + label + '</a>'
        : '';
}

// ---------- Multiple choice: erantzunak gehitu / kendu (2tik 5era) ----------
var MIN_ANSWERS = 4;
var MAX_ANSWERS = 8;

function updateAnswerButtons() {
    var n = $("#answers-block .answer-row.is-active").length;
    $("#btn-add-answer").button(n >= MAX_ANSWERS ? "disable" : "enable");
    $("#btn-remove-answer").button(n <= MIN_ANSWERS ? "disable" : "enable");
}

$(document).on("click", "#btn-add-answer", function () {
    var $next = $("#answers-block .answer-row").not(".is-active").first();
    if ($next.length === 0) return;
    $next.addClass("is-active").show();
    updateAnswerButtons();
});

$(document).on("click", "#btn-remove-answer", function () {
    var $rows = $("#answers-block .answer-row.is-active");
    if ($rows.length <= MIN_ANSWERS) return;

    var $last = $rows.last();
    var $rec = $last.find(".audio-recorder");

    if (activeRecorder && $rec.length && activeRecorder[0] === $rec[0]) {
        alert("Grabazioa martxan dago erantzun honetan. Gelditu lehenengo.");
        return;
    }

    // garbitu erantzun hori
    $last.find("input[type=text]").val("");
    $last.find("input[type=file]").val("");
    $rec.removeData("audioPath");
    $rec.find(".rec-file-name").text("");
    $rec.find(".rec-player").hide();

    // zuzena kendutako erantzuna bazen, itzuli lehenengora (A)
    var $radio = $last.find("input[type=radio]");
    if ($radio.prop("checked")) {
        $("#erantzuna-a").prop("checked", true);
    }
    $("input[name='erantzun-zuzena']").checkboxradio("refresh");

    $last.removeClass("is-active").hide();
    updateAnswerButtons();
});
 