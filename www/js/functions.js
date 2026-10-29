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

function stopAudioRecord() {
    console.log("Grabazioa gelditzeko botoia sakatu da");

    if (typeof audio === "undefined" || typeof audio.doStopRecord_E !== "function") {
        console.error("Audio objektua edo doStopRecord_E() funtzioa ez dago erabilgarri");
        alert("Ezin da grabazioa gelditu: audio sistema ez dago erabilgarri.");
        return;
    }

    console.log("1. Stop botoia sakatu da");

    if (!audio || !audio.doStopRecord_E) {
        console.error("2. Audio objektua edo stop funtzioa falta da");
        return;
    }

    console.log("3. Grabazioa gelditzeko deia egingo da");


    var fileFullPath = appDirs.baseStorageAudio() +
        "recording_" + Date.now() + ".aac";

    audio.doStopRecord_E(
        fileFullPath,
        function() {
            $("#audio-file-name").text("Grabazioa gordeta");

            $("#audio-source").attr("src", fileFullPath);
            $("#audio-player").show();

            var player = document.getElementById("audio-player");
            player.load();

            $("#button-audio-stop").addClass("ui-disabled");
            $("#button-audio-start").removeClass("ui-disabled");

            alert("Audioa behar bezala gorde da");
        },
        function(error) {
            console.error("Audio error:", JSON.stringify(error));
            alert("Errorea audioa gordetzean.");

            $("#button-audio-start").removeClass("ui-disabled");
            $("#button-audio-stop").addClass("ui-disabled");
        }
    );
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

function setupDynamicAnswers(containerId, buttonId, groupName) {
    var container = document.getElementById(containerId);
    var addButton = document.getElementById(buttonId);

    if (!container || !addButton || addButton.dataset.initialized) {
        return;
    }

    addButton.dataset.initialized = "true";

    var answerCount = 0;
    var answerMax = 8;

    addButton.addEventListener("click", function () {
        
        if (answerCount >= answerMax){
            return;
        }
        
        answerCount++;

        var row = document.createElement("div");
        row.className = "answer-row";
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";

        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = groupName;
        radio.value = String(answerCount);
        radio.id = groupName + "-correct-" + answerCount;

        var label = document.createElement("label");
        label.htmlFor = radio.id;
        label.textContent = "Zuzena";
        label.style.flexShrink = "0";

        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Erantzuna " + answerCount;
        input.id = groupName + "-answer-" + answerCount;
        input.style.flex = "1";

        var removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "−";
        removeButton.title = "Erantzuna ezabatu";
        removeButton.style.width = "44px";
        removeButton.style.flexShrink = "0";

        removeButton.addEventListener("click", function () {
            row.remove();
            answerCount--;

            // Erantzun bat ezabatzean, berriro gehitzeko aukera
            addButton.disabled = false;
            addButton.classList.remove("ui-state-disabled");
            addButton.textContent = "Gehitu erantzuna (" +
                answerCount + "/" + answerMax + ")";
        });

        row.appendChild(radio);
        row.appendChild(label);
        row.appendChild(input);
        row.appendChild(removeButton);

        container.appendChild(row);

        if (window.jQuery && jQuery.fn.checkboxradio) {
            jQuery(radio).checkboxradio();
            jQuery(radio).checkboxradio("refresh");
        }

        if (window.jQuery && jQuery.fn.textinput) {
            jQuery(input).textinput();
        }

        if (window.jQuery && jQuery.fn.button) {
            jQuery(removeButton).button();
        }

        addButton.textContent = "Gehitu erantzuna (" +
        answerCount + "/" + answerMax + ")";

    // 8 erantzunera iristean botoia desgaitu
    if (answerCount >= answerMax) {
        addButton.disabled = true;
        addButton.classList.add("ui-state-disabled");
    }
    });
}

$(document).on("pagecreate", "#page-t-4", function () {
    setupDynamicAnswers(
        "multipleA-answers",
        "multipleA-add-answer",
        "multipleA-correct"
    );
    setupDynamicAnswers(
        "multipleB-answers",
        "multipleB-add-answer",
        "multipleB-correct"
    );
});

$(document).on("change", "#student-group-select", function () {
    if ($(this).val() === "multiple-choice-a") {
        $("#audio-section").show();
    } else {
        $("#audio-section").hide();
    }
});
$(document).on("change", "#student-group-select", function () {
    if ($(this).val() === "multiple-choice-b") {
        $("#multipleB").show();
    } else {
        $("#multipleB").hide();
    }
});

$(document).on("change", "#student-group-select", function () {
    if ($(this).val() === "soup-a") {
        $("#soupA").show();
    } else {
        $("#soupA").hide();
    }
});
$(document).on("change", "#student-group-select", function () {
    if ($(this).val() === "soup-b") {
        $("#soupB").show();
    } else {
        $("#soupB").hide();
    }
});

$(document).on("change", "#student-group-select", function () {
    if ($(this).val() === "bikote") {
        $("#pair").show();
    } else {
        $("#pair").hide();
    }
});

$(document).on("change", "#student-group-select", function () {
    if ($(this).val() === "join-a") {
        $("#matchA").show();
    } else {
        $("#matchA").hide();
    }
});
$(document).on("change", "#student-group-select", function () {
    if ($(this).val() === "join-b") {
        $("#matchB").show();
    } else {
        $("#matchB").hide();
    }
});
