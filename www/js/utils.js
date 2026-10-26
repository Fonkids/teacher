/*
 * $Id: utils.js Oct 31, 2023 5:41:11 PM tta2627$
 * 
 * Copyright (C) 2023 Maider Huarte Arrayago
 * 
 * This file is part of TTA2627_09v2_www.zip.
 * 
 * TTA2627_09v2_www.zip is intended for learning purposes only.
 * 
 * TTA2627_09v2_www.zip is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * TTA2627_09v2_www.zip is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details
 * <http://www.gnu.org/licenses/>.
 */

var dateUtils = { //V1
	dbFormat: function(timestamp) {
		var d = new Date(parseInt(timestamp));
		return d.toISOString();
	},
	localeFormat: function(timestamp, locale) {
		var d = new Date(parseInt(timestamp));
		return "" + d.toLocaleDateString(locale) + " " + d.toLocaleTimeString(locale);
	}
};


/*
 * Utils: date and file utilities.
 */

var dateUtils = {
    dbFormat: function(timestamp) {
        var d = new Date(parseInt(timestamp));
        return d.toISOString();
    },

    localeFormat: function(timestamp, locale) {
        var d = new Date(parseInt(timestamp));
        return "" + d.toLocaleDateString(locale) + " " +
            d.toLocaleTimeString(locale);
    }
};

var fileUtils = {
    createStorageDirs_E: function(
        baseDirectory,
        directoriesToCreateArray,
        mode,
        onSuccess,
        onError
    ) {
        console.log("createStorageDirs_E: " + baseDirectory);

        if (directoriesToCreateArray.length === 0) {
            if (onSuccess != null) {
                onSuccess();
            }
            return;
        }

        var directoryName = directoriesToCreateArray[0];

        window.resolveLocalFileSystemURL(
            baseDirectory,

            function(dirEntry) {
                dirEntry.getDirectory(
                    directoryName,
                    { create: true },

                    function(newDirEntry) {
                        console.log(
                            "Directory created/found: " +
                            newDirEntry.fullPath
                        );

                        directoriesToCreateArray.splice(0, 1);

                        var nextBaseDirectory = baseDirectory;

                        if (mode === "path") {
                            nextBaseDirectory =
                                newDirEntry.toURL();
                        }

                        fileUtils.createStorageDirs_E(
                            nextBaseDirectory,
                            directoriesToCreateArray,
                            mode,
                            onSuccess,
                            onError
                        );
                    },

                    function(error) {
                        console.error(
                            "Directory creation error (" +
                            directoryName + "): " +
                            JSON.stringify(error)
                        );

                        if (onError != null) {
                            onError(error);
                        }
                    }
                );
            },

            function(error) {
                console.error(
                    "Base directory access error (" +
                    baseDirectory + "): " +
                    JSON.stringify(error)
                );

                if (onError != null) {
                    onError(error);
                }
            }
        );
    },

    move_E: function(
        sourceFullPathURL,
        destFullPathURL,
        onMoveSuccess,
        onError
    ) {
        console.log("move_E");
        console.log("Source: " + sourceFullPathURL);
        console.log("Destination: " + destFullPathURL);

        window.resolveLocalFileSystemURL(
            sourceFullPathURL,

            function(fileEntry) {
                var lastSlash =
                    destFullPathURL.lastIndexOf("/");

                if (lastSlash === -1) {
                    console.error(
                        "Invalid destination path: " +
                        destFullPathURL
                    );

                    if (onError != null) {
                        onError({
                            code: 2,
                            message: "Invalid destination path"
                        });
                    }
                    return;
                }

                var destDirectoryPathURL =
                    destFullPathURL.substring(0, lastSlash + 1);

                var filename =
                    destFullPathURL.substring(lastSlash + 1);

                console.log(
                    "Destination directory: " +
                    destDirectoryPathURL
                );
                console.log("Destination filename: " + filename);

                function moveFile(dirEntry) {
                    fileEntry.moveTo(
                        dirEntry,
                        filename,

                        function(movedEntry) {
                            console.log(
                                "File moved successfully: " +
                                movedEntry.toURL()
                            );

                            if (onMoveSuccess != null) {
                                onMoveSuccess(movedEntry);
                            }
                        },

                        function(error) {
                            console.error(
                                "File move error: " +
                                JSON.stringify(error)
                            );

                            if (onError != null) {
                                onError(error);
                            }
                        }
                    );
                }

                // First, try to find the destination directory.
                window.resolveLocalFileSystemURL(
                    destDirectoryPathURL,

                    function(dirEntry) {
                        moveFile(dirEntry);
                    },

                    function(resolveError) {
                        console.warn(
                            "Destination directory not found: " +
                            JSON.stringify(resolveError)
                        );

                        // If it is missing, create the final directory.
                        // The parent directory must already exist.
                        var parentPath =
                            destDirectoryPathURL.substring(
                                0,
                                destDirectoryPathURL.replace(
                                    /\/+$/, ""
                                ).lastIndexOf("/") + 1
                            );

                        var directoryName =
                            destDirectoryPathURL.replace(/\/+$/, "")
                                .split("/")
                                .pop();

                        console.log("Parent directory: " + parentPath);
                        console.log("Directory to create: " + directoryName);

                        window.resolveLocalFileSystemURL(
                            parentPath,

                            function(parentEntry) {
                                parentEntry.getDirectory(
                                    directoryName,
                                    { create: true },

                                    function(newDirEntry) {
                                        console.log(
                                            "Destination directory created: " +
                                            newDirEntry.toURL()
                                        );

                                        moveFile(newDirEntry);
                                    },

                                    function(createError) {
                                        console.error(
                                            "Could not create destination directory: " +
                                            JSON.stringify(createError)
                                        );

                                        if (onError != null) {
                                            onError(createError);
                                        }
                                    }
                                );
                            },

                            function(parentError) {
                                console.error(
                                    "Parent directory not accessible: " +
                                    JSON.stringify(parentError)
                                );

                                if (onError != null) {
                                    onError(parentError);
                                }
                            }
                        );
                    }
                );
            },

            function(error) {
                console.error(
                    "Source file not found or inaccessible: " +
                    sourceFullPathURL + " " +
                    JSON.stringify(error)
                );

                if (onError != null) {
                    onError(error);
                }
            }
        );
    }
};

