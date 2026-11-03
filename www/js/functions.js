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


/* =========================================================
   1. MOSTRAR EL TIPO DE EJERCICIO SELECCIONADO
   ========================================================= */

   function showExerciseType(type) {

    // Ocultar todos los ejercicios
    $(".exercise-panel").hide();

    // Ocultar también el panel de audio del enunciado
    $("#question-audio-panel").hide();

    if (!type) {
        return;
    }

    // Mostrar el ejercicio seleccionado
    switch (type) {

        case "multiple-choice-a":
            $("#exercise-multiple-choice-a").show();
            $("#question-audio-panel").show();
            break;

        case "multiple-choice-b":
            $("#exercise-multiple-choice-b").show();
            break;

        case "soup-a":
            $("#exercise-soup-a").show();
            break;

        case "soup-b":
            $("#exercise-soup-b").show();
            break;

        case "bikote":
            $("#exercise-hangman-a").show();
            break;

        case "join-a":
            $("#exercise-join-a").show();
            break;

        case "join-b":
            $("#exercise-join-b").show();
            break;
    }
}


/* =========================================================
   2. INICIALIZACIÓN DEL SELECTOR Y DE LAS RESPUESTAS
   ========================================================= */

$(document).on("pagecreate", "#page-t-4", function () {

    // Ocultar todos los ejercicios inicialmente
    $(".exercise-panel").hide();
    $("#question-audio-panel").hide();

    // Cambiar el ejercicio al seleccionar otro tipo
    $("#question-type-select").on("change", function () {
        showExerciseType($(this).val());
    });

    // Inicializar las respuestas dinámicas
    setupDynamicAnswers(
        "multipleA-answers",
        "multipleA-add-answer",
        "multipleA-correct",
        "text"
    );

    setupDynamicAnswers(
        "multipleB-answers",
        "multipleB-add-answer",
        "multipleB-correct",
        "audio"
    );
});


/* =========================================================
   3. CREAR RESPUESTAS DINÁMICAMENTE
   ========================================================= */

function setupDynamicAnswers(
    containerId,
    buttonId,
    groupName,
    answerKind
) {

    var container = $("#" + containerId);
    var button = $("#" + buttonId);

    var answerCount = 0;
    var maxAnswers = 8;

    button.on("click", function () {

        if (container.children(".dynamic-answer").length >= maxAnswers) {
            alert("No se pueden añadir más de 8 respuestas.");
            return;
        }

        answerCount++;

        var id = containerId + "-answer-" + answerCount;

        var row = $("<div>", {
            id: id,
            class: "dynamic-answer"
        });

        // Número de respuesta
        row.append(
            $("<h4>").text("Respuesta " + answerCount)
        );

        // Crear el campo según el tipo de respuesta
        if (answerKind === "text") {

            var textInput = $("<input>", {
                type: "text",
                id: id + "-text",
                name: id + "-text",
                placeholder: "Escribe la respuesta",
                required: true
            });

            row.append(
                $("<label>", {
                    for: id + "-text"
                }).text("Texto de la respuesta:")
            );

            row.append(textInput);

        } else if (answerKind === "audio") {

            var audioInput = $("<input>", {
                type: "file",
                id: id + "-audio",
                name: id + "-audio",
                accept: "audio/*",
                required: true
            });

            var audioPlayer = $("<audio>", {
                id: id + "-player",
                controls: true,
                css: {
                    display: "none",
                    width: "100%"
                }
            });

            row.append(
                $("<label>", {
                    for: id + "-audio"
                }).text("Seleccionar audio:")
            );

            row.append(audioInput);
            row.append(audioPlayer);

            // Reproducir el audio seleccionado
            audioInput.on("change", function () {

                if (this.files && this.files.length > 0) {

                    var url = URL.createObjectURL(this.files[0]);

                    audioPlayer.attr("src", url);
                    audioPlayer.show();

                } else {

                    audioPlayer.hide();
                    audioPlayer.removeAttr("src");
                }
            });
        }

        // Radio para seleccionar la respuesta correcta
        var correctInput = $("<input>", {
            type: "radio",
            name: groupName,
            id: id + "-correct",
            value: answerCount,
            required: true
        });

        row.append(
            $("<label>", {
                for: id + "-correct"
            }).text("Zuzena")
        );

        row.append(correctInput);

        // Botón para eliminar la respuesta
        var removeButton = $("<button>", {
            type: "button",
            text: "Eliminar respuesta",
            class: "ui-btn ui-mini ui-btn-icon-left ui-icon-delete"
        });

        removeButton.on("click", function () {

            row.remove();
        });

        row.append(removeButton);

        container.append(row);

        // Actualizar los elementos de jQuery Mobile
        container.trigger("create");
    });
}


/* =========================================================
   4. GRABACIÓN DEL ENUNCIADO DE MULTIPLE-CHOICE-A
   ========================================================= */

var questionRecording = false;
var questionAudioPath = null;


function startAudioRecord() {

    if (typeof audio === "undefined" ||
        typeof audio.doStartRecord !== "function") {

        alert("Grabazioa ez dago eskuragarri.");
        return;
    }

    if (questionRecording || soupBRecordingIndex !== null) {
        alert("Grabatzen...");
        return;
    }

    try {

        questionAudioPath =
            appDirs.baseStorageAudio() +
            "question_" + Date.now() + ".aac";

        audio.doStartRecord();

        questionRecording = true;

        $("#button-audio-start").addClass("ui-disabled");
        $("#button-audio-stop").removeClass("ui-disabled");

        $("#audio-file-name").text("Grabando enunciado...");

    } catch (error) {

        console.error(error);
        alert("Ezin da grabazioa hasi.");
    }
}


function stopAudioRecord() {

    if (!questionRecording) {
        return;
    }

    audio.doStopRecord_E(

        questionAudioPath,

        function () {

            questionRecording = false;

            $("#button-audio-start").removeClass("ui-disabled");
            $("#button-audio-stop").addClass("ui-disabled");

            $("#audio-file-name").text("Enunciado grabado correctamente.");

            $("#audio-source").attr("src", questionAudioPath);

            var player = document.getElementById("audio-player");

            player.style.display = "block";
            player.load();
        },

        function (error) {

            console.error("Errorea enuntziatua gordetzerakoan...", error);

            questionRecording = false;

            $("#button-audio-start").removeClass("ui-disabled");
            $("#button-audio-stop").addClass("ui-disabled");

            alert("Grabazioa ezin izan da gorde.");
        }
    );
}


/* =========================================================
   5. SOPA DE LETRAS B: SUBIR O GRABAR LOS CINCO AUDIOS
   ========================================================= */

var soupBRecordingIndex = null;

var soupBRecordedAudios = {};


/*
 * Iniciar la grabación de una palabra.
 */
function startWordAudioRecord(index) {

    
    if (typeof audio === "undefined" ||
        typeof audio.doStartRecord !== "function") {

        alert("Grabazio sistema ez dago eskuragarri.");
        return;
    }

    if (questionRecording || soupBRecordingIndex !== null) {

        alert("Lehenengo aurreko gabazioa gelditu.");
        return;
    }

    // Eliminar el archivo seleccionado anteriormente
    $("#soupB-audio" + index).val("");

    var player = document.getElementById("soupB-player" + index);

    player.pause();
    player.removeAttribute("src");
    player.style.display = "none";

    var filePath =
        appDirs.baseStorageAudio() +
        "soupB_word" + index + "_" + Date.now() + ".aac";

    soupBRecordedAudios[index] = filePath;

    try {

        audio.doStartRecord();

        soupBRecordingIndex = index;

        $("#soupB-stop" + index).prop("disabled", false);

    } catch (error) {

        console.error(error);

        delete soupBRecordedAudios[index];

        alert("Grabazioa ezin izan da hasi");
    }
}


/*
 * Detener y guardar la grabación de una palabra.
 */
function stopWordAudioRecord(index) {

    if (soupBRecordingIndex !== index) {
        return;
    }

    var filePath = soupBRecordedAudios[index];

    audio.doStopRecord_E(

        filePath,

        function () {

            var player =
                document.getElementById("soupB-player" + index);

            player.src = filePath;
            player.style.display = "block";
            player.load();

            $("#soupB-stop" + index).prop("disabled", true);

            soupBRecordingIndex = null;
        },

        function (error) {

            console.error("Errorea grabazioa gordetzerakoan:", error);

            delete soupBRecordedAudios[index];

            $("#soupB-stop" + index).prop("disabled", true);

            soupBRecordingIndex = null;

            alert("Grabazioa ezin izan da gorde");
        }
    );
}


/*
 * Si se sube un archivo, se elimina la referencia
 * a la grabación anterior y se muestra el reproductor.
 */
$(document).on(
    "change",
    "#soupB-words input[type='file']",
    function () {

        var index = Number(
            this.id.replace("soupB-audio", "")
        );

        if (this.files && this.files.length > 0) {

            delete soupBRecordedAudios[index];

            var player =
                document.getElementById("soupB-player" + index);

            player.src = URL.createObjectURL(this.files[0]);
            player.style.display = "block";
            player.load();
        }
    }
);
// cordova-ren plugin-aren dokumentazioan dioenez, WebView bidezko metodoa gomendatzen dute orain
// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/

//Kameraren ebentua entzuten
document.addEventListener("deviceready", function() {
    document.getElementById("selfie").addEventListener("change", async function(e) {
        const blob = e.target.files[0];
        if (!blob) return;

        console.log("updateAvatar:", typeof updateAvatar);
        console.log("blob:", blob);

        var avatar_result = null;

        try {

            avatar_result = await updateAvatar(
                user.uid,
                "avatar.jpg",
                blob,
                blob.type
            );
    
            alert("Upload successful");
    
        } catch(err) {
    
            console.error(err);
            alert("Upload failed:" + err);
        }

        // Fitxategiak gordetzeko karpeta
        const dirEntry = await new Promise((res, rej) =>
            window.resolveLocalFileSystemURL(
                cordova.file.externalDataDirectory, res, rej
            )
        );

        // Fitxategia sortu, hemen sartuko da irudia irudia daukagunean
        const filename = `selfie_${Date.now()}.jpg`;

        const fileEntry = await new Promise((res, rej) =>
            dirEntry.getFile(filename, { create: true, exclusive: false }, res, rej)
        );

        // Itxaron irudia lortu arte, lortze denean: fitxategira idatzi
        const writer = await new Promise((res, rej) =>
            fileEntry.createWriter(res, rej)
        );
        await new Promise((res, rej) => {
            writer.onwriteend = res;
            writer.onerror = rej;
            writer.write(blob);
        });

        console.log("Saved to:", fileEntry.toURL());

        //Irudi berria erakusten
        const preview = document.getElementById("selfie-preview");
        preview.src = fileEntry.toURL();
        preview.style.display = "block";
        document.getElementById("selfie-path").textContent = avatar_result.fullPath;
    });
});

$(document).on("change", "#question-type-select", function () {
    $(".exercise-panel").hide();

    var type = $(this).val();

    switch (type) {
        case "multiple-choice-a":
            $("#exercise-multiple-choice-a").show();
            break;

        case "multiple-choice-b":
            $("#exercise-multiple-choice-b").show();
            break;

        case "soup-a":
            $("#exercise-soup-a").show();
            break;

        case "soup-b":
            $("#exercise-soup-b").show();
            break;

        case "join-a":
            $("#exercise-join-a").show();
            break;

        case "join-b":
            $("#exercise-join-b").show();
            break;
    }
});