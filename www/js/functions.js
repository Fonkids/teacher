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

// ---------- Laguntzailea: botoiak gaitu / desgaitu ----------
// <button> elementuak ez dira beti jQuery Mobile "button widget" gisa hasieratzen,
// beraz .button("disable") ez da fidagarria. Honek kasu guztietan funtzionatzen du.
function setEnabled($el, enabled) {
    $el.each(function () {
        var $b = $(this);
        $b.prop("disabled", !enabled)
          .attr("aria-disabled", !enabled)
          .toggleClass("ui-state-disabled ui-disabled", !enabled);
        $b.closest("div.ui-btn").toggleClass("ui-state-disabled ui-disabled", !enabled);
    });
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
        // doStartRecord() true itzultzen du bakarrik grabaketa hasi bada
        started = audio.doStartRecord() === true;
    } catch (error) {
        console.error("Grabazioa hasteko errorea:", error);
    }
    if (!started) return;

    activeRecorder = $rec;
    $rec.find(".rec-file-name").text("Grabatzen...");
    $rec.find(".rec-player").hide();
    setEnabled($rec.find(".btn-rec-start"), false);
    setEnabled($rec.find(".btn-rec-stop"), true);
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
            setEnabled($rec.find(".btn-rec-stop"), false);
            setEnabled($rec.find(".btn-rec-start"), true);
        },
        function(error) {
            activeRecorder = null;
            console.error("Audio error:", JSON.stringify(error));
            alert("Errorea audioa gordetzean.");
            $rec.find(".rec-file-name").text("");
            setEnabled($rec.find(".btn-rec-stop"), false);
            setEnabled($rec.find(".btn-rec-start"), true);
        }
    );
}

$(document).on("click", ".btn-rec-start", function () {
    if ($(this).prop("disabled")) return;
    startAudioRecord($(this).closest(".audio-recorder"));
});
$(document).on("click", ".btn-rec-stop", function () {
    if ($(this).prop("disabled")) return;
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

    // Multiple choice
    $("#answer-type-container").toggle(type === "multiple-choice");
    $("#answers-block").toggle(type === "multiple-choice");
    $("#answers-block .answer-text").toggle(answer === "text");
    $("#answers-block .answer-audio").toggle(answer === "audio");
    $("#answers-block .answer-image").toggle(answer === "image");

    // Beste motak
    $("#soup-block").toggle(type === "soup");
    $("#join-block").toggle(type === "join");
    $("#classify-block").toggle(type === "classify");

    if (type === "multiple-choice") updateAnswerButtons();
}

$(document).on("change", "#exercise-type-select, #statement-type-select, #answer-type-select", updateExerciseForm);

$(document).on("pagecreate", "#page-t-4", function () {
    updateExerciseForm();
    updateAnswerButtons();
});

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

// ---------- Multiple choice: erantzunak gehitu / kendu (4tik 8ra) ----------
var MIN_ANSWERS = 4;
var MAX_ANSWERS = 8;

function updateAnswerButtons() {
    var n = $("#answers-block .answer-row.is-active").length;
    setEnabled($("#btn-add-answer"), n < MAX_ANSWERS);
    setEnabled($("#btn-remove-answer"), n > MIN_ANSWERS);
}

$(document).on("click", "#btn-add-answer", function () {
    var $next = $("#answers-block .answer-row").not(".is-active").first();
    if ($next.length > 0) {
        $next.addClass("is-active").show();
    }
    updateAnswerButtons(); // beti eguneratu, bukaeran ere
});

$(document).on("click", "#btn-remove-answer", function () {
    var $rows = $("#answers-block .answer-row.is-active");
    if ($rows.length <= MIN_ANSWERS) {
        updateAnswerButtons();
        return;
    }

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
    setEnabled($rec.find(".btn-rec-start"), true);
    setEnabled($rec.find(".btn-rec-stop"), false);

    // zuzena kendutako erantzuna bazen, itzuli lehenengora (A)
    var $radio = $last.find("input[type=radio]");
    if ($radio.prop("checked")) {
        $("#erantzuna-a").prop("checked", true);
    }
    $("input[name='erantzun-zuzena']").checkboxradio("refresh");

    $last.removeClass("is-active").hide();
    updateAnswerButtons();
});

// cordova-ren plugin-aren dokumentazioan dioenez, WebView bidezko metodoa gomendatzen dute orain
// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/

// Kameraren ebentua entzuten
document.addEventListener("deviceready", function () {

    document.getElementById("selfie").addEventListener(
        "change",
        async function (e) {

            const blob = e.target.files[0];
            if (!blob) return;

            const filename = `pfp.jpeg`;

            try {

                /* -------------------------
                 * 1. ROOT DIRECTORY
                 * ------------------------- */

                const rootDir = await new Promise((res, rej) =>
                    window.resolveLocalFileSystemURL(
                        appDirs.baseStorage(),
                        res,
                        rej
                    )
                );

                /* -------------------------
                 * 2. CREATE images/ IF NEEDED
                 * ------------------------- */

                const imagesDir = await new Promise((res, rej) =>
                    rootDir.getDirectory(
                        "images",
                        { create: true },
                        res,
                        rej
                    )
                );

                console.log(
                    "Images directory:",
                    imagesDir.toURL()
                );

                /* -------------------------
                 * 3. CREATE FILE
                 * ------------------------- */

                const fileEntry = await new Promise((res, rej) =>
                    imagesDir.getFile(
                        filename,
                        {
                            create: true,
                            exclusive: false
                        },
                        res,
                        rej
                    )
                );

                /* -------------------------
                 * 4. WRITE IMAGE
                 * ------------------------- */

                const writer = await new Promise((res, rej) =>
                    fileEntry.createWriter(res, rej)
                );

                await new Promise((res, rej) => {
                    writer.onwriteend = res;
                    writer.onerror = rej;
                    writer.write(blob);
                });

                console.log(
                    "Local image saved:",
                    fileEntry.toURL()
                );

                /* -------------------------
                 * 5. PREVIEW
                 * ------------------------- */

                const preview =
                    document.getElementById("selfie-preview");

                preview.src =
                    fileEntry.toURL() +
                    "?t=" +
                    Date.now();

                preview.style.display = "block";

                document.getElementById("selfie-path")
                    .textContent =
                    fileEntry.toURL();

                /* -------------------------
                 * 6. UPLOAD TO SUPABASE
                 * ------------------------- */

                const uploadResult =
                    await updateAvatar(
                        userSettings.uid,
                        filename,
                        blob,
                        blob.type
                    );

                console.log(
                    "Supabase upload result:",
                    uploadResult
                );

                alert("Upload successful");

                await refreshProfilePages();

                /* -------------------------
                 * 7. RESET INPUT
                 * ------------------------- */

                document.getElementById("selfie").value = "";

            } catch (err) {

                console.error(
                    "Avatar processing error:",
                    err
                );

                alert(
                    "Avatar processing failed:\n" +
                    JSON.stringify(err, null, 2)
                );
            }
        }
    );
});

// Login eta Login-a mantentzeko

function saveSession() {

    localStorage.setItem(
        "fonkidsTeacherSettings",
        JSON.stringify(userSettings)
    );
}

function loadSession() {

    const saved =
        localStorage.getItem(
            "fonkidsTeacherSettings"
        );

    if (!saved) {
        return false;
    }

    try {

        const settings =
            JSON.parse(saved);

        userSettings =
            settings;

        return true;

    } catch(error) {

        console.error(
            "Session load error:",
            error
        );

        return false;
    }
}

document.addEventListener("deviceready", function() {

        if (loadSession()) {

            console.log(
                "Previous session found:",
                userSettings.uid
            );

            $.mobile.changePage(
                "#page-t-1"
            );

        } else {

            console.log(
                "No previous session"
            );

            $.mobile.changePage(
                "#page-t-0"
            );
        }

    }
);

$(document).on(
    "click",
    "#logout",
    function() {

        localStorage.removeItem(
            "fonkidsTeacherSettings"
        );

        $.mobile.changePage(
            "#page-t-0"
        );
    }
);

$(document).on(
    "click",
    "#login",
    function() {

        //FAKING THE LOGIN ALL EPIC STYLE LOL #LMAO

        userSettings.uid = "tty4ThQOkCZs4iQhn6VW910n7VB3";
    
        userSettings.alias = "Erlantz";
        
        userSettings.email = "test@domain.tld";
        
        userSettings.lastLogin = new Date().toISOString();
        
        saveSession();

        $.mobile.changePage(
            "#page-t-1"
        );
    }
);

// PROFILAREN INFORMAZIOA ERAKUSTEN P10 eta P11-n!!

async function refreshProfilePages() {

    // ---------- TEXT ----------
    $("#user-name").text(userSettings.alias);
    $("#settings-username").text(userSettings.alias);

    $("#user-email").text(userSettings.email);
    $("#settings-email").text(userSettings.email);

    $("#user-uid").text(userSettings.uid);

    $("#user-last-login").text(
        userSettings.lastLogin || "-"
    );

    $("#new-username").val(
        userSettings.alias
    );

    // ---------- AVATAR ----------
    try {

        const avatarUrl =
            await getAvatarUrl(
                userSettings.uid,
                userSettings.pfp
            );

        console.log(
            "Avatar URL:",
            avatarUrl
        );

        $("#user-avatar").attr(
            "src",
            avatarUrl + "?t=" + Date.now()
        );

        $("#settings-avatar").attr(
            "src",
            avatarUrl + "?t=" + Date.now()
        );

    }
    catch(error) {

        console.error(
            "Avatar load failed:",
            error
        );
    }
}

$(document).on(
    "pageshow",
    "#page-t-9,#page-t-10",
    refreshProfilePages
);


//ERABILTZAILE IZENA ALDATZEN
$(document).on(
    "click",
    "#save-profile-changes",
    function() {

        userSettings.alias =
            $("#new-username").val();

        saveSession();

        refreshProfilePages();

        alert("Profile saved");
    }
);