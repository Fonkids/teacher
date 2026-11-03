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

var appDirs = {
	baseStorage: function() { return cordova.file.externalDataDirectory; },
	baseStorageAudio: function() { return this.baseStorage() + "audio/"; }	
};

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

var audio = {//V2
	media: null,
	doStartRecord: function() {
		console.log("doStartRecord");

		console.log("cordova:", typeof cordova);
		console.log("Media:", typeof Media);
		console.log("cordova.file:", typeof cordova.file);
	
		if (typeof Media === "undefined") {
			alert("Media plugina ez dago erabilgarri");
			return;
		}
	
		if (!cordova.file) {
			alert("Cordova File plugina ez dago erabilgarri");
			return;
		}

		try {
            if (this.media) {
                this.media.release();
                this.media = null;
            }

            this.media = new Media(
                cordova.file.dataDirectory + "tmprecording.aac"
            );

            this.media.startRecord();
            return true;

        } catch (error) {
            console.error("Grabaketa hasteko errorea:", error);
            this.media = null;
            alert("Ezin izan da grabaketa hasi");
            return false;
        }
	},
	doStopRecord_E: function(fileFullPath, onSuccess, onError) {
		console.log("doStopRecord_E");

		console.log("Media objektua:", this.media);

		if (!this.media) {
			console.error("Ez dago gelditzeko grabaziorik");
			return;
		}

		this.media.stopRecord();
		
		var tempFullPath = cordova.file.dataDirectory + "tmprecording.aac";

		if (!tempFullPath.startsWith("file://"))
			tempFullPath = "file://" + tempFullPath;
		if (!fileFullPath.startsWith("file://"))
			fileFullPath = "file://" + fileFullPath;

		fileUtils.move_E(
			tempFullPath,
			fileFullPath,
			function() {
				audio.media.release();
				if (onSuccess != false)
					onSuccess();
			},
			function() {
				console.error("Audio file move error");
				if (onError != false)
					onError();
			}
		);
	}
};
