/*
 * $Id: utils.js Oct 31, 2023 5:41:11 PM tta2627$
 * 
 * Copyright (C) 2023 Maider Huarte Arrayago
 * 
 * This file is part of TTA2627_09v1_www.zip.
 * 
 * TTA2627_09v1_www.zip is intended for learning purposes only.
 * 
 * TTA2627_09v1_www.zip is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * TTA2627_09v1_www.zip is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details
 * <http://www.gnu.org/licenses/>.
 */

var dateUtils = {
	dbFormat: function(timestamp) {
		var d = new Date(parseInt(timestamp));
		return d.toISOString();
	},
	localeFormat: function(timestamp, locale) {
		var d = new Date(parseInt(timestamp));
		return "" + d.toLocaleDateString(locale) + " " + d.toLocaleTimeString(locale);
	}
};

var fileUtils = {
	createStorageDirs_E: function(baseDirectory, directoriesToCreateArray, mode, onSuccess, onError) {
		console.log("createStorageDirs_E");
		if (directoriesToCreateArray.length > 0) {
			var directoryName = directoriesToCreateArray[0];
			window.resolveLocalFileSystemURL(
				baseDirectory,
				function(dirEntry) {
					dirEntry.getDirectory(
						directoryName,
						{ create: true },
						function() {
							console.log("	Directory created: " + directoryName);
							directoriesToCreateArray.splice(0, 1);
							if (mode == "path")
								baseDirectory = baseDirectory + directoryName + "/";
							fileUtils.createStorageDirs_E(baseDirectory, directoriesToCreateArray, mode, onSuccess, onError);
						},
						function(error) {
							console.error("	Error dir not created " + directoryName + ": " + JSON.stringify(error));
							if (onError != null)
								onError(error);
						}
					);
				},
				function(error) {
					console.error("	Error baseDir not accessed: " + JSON.stringify(error));
					if (onError != null)
						onError(error);
				}
			);
		}
		else {
			if (onSuccess != null)
				onSuccess();
		}
	},
	move_E: function(sourceFullPathURL, destFullPathURL, onMoveSuccess, onError) {
		console.log("move_E");
		window.resolveLocalFileSystemURL(
			sourceFullPathURL,
			function(fileEntry) {
				var destDirectoryPathURL = destFullPathURL.substring(0, destFullPathURL.lastIndexOf("/") + 1);
				var filename = destFullPathURL.substring(destFullPathURL.lastIndexOf("/") + 1);

				window.resolveLocalFileSystemURL(
					destDirectoryPathURL,
					function(dirEntry) {
						fileEntry.moveTo(
							dirEntry,
							filename,
							function() {
								console.log("	Successfully moved: " + destDirectoryPathURL);
								if (onMoveSuccess != null)
									onMoveSuccess();
							},
							function(error) {
								console.error("	Moving unsuccessful error: " + JSON.stringify(error));
								if (onError != null)
									onError(error);
							}
						);
					},
					function(error) {
						console.error("	Destination directory error: " + JSON.stringify(error));
						if (onError != null)
							onError(error);
					}
				);
			},
			function(error) {
				console.error("	Source file error: " + JSON.stringify(error));
				if (onError != null)
					onError(error);
			}
		);
	}
};
