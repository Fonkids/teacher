/*
 * $Id: storage.js Oct 31, 2021 5:40:57 PM tta2627$
 *
 * Copyright (C) 2021 Maider Huarte Arrayago
 *
 * This file is part of TTA2627_09v5_www.zip.
 *
 * TTA2627_09v5_www.zip is intended for learning purposes only.
 *
 * TTA2627_09v5_www.zip is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * TTA2627_09v5_www.zip is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details
 * <http://www.gnu.org/licenses/>.
 */

const storageSB = supabaseProj.storage;


async function getFileUrl(bucket, pathToFile) {
	const { data, error } = storageSB.from(bucket).getPublicUrl(pathToFile);
	if (error) throw new Error(`Failed to get file URL: ${error.message}`);
	return data.publicUrl;
  }
  
  async function uploadFile(bucket, pathToFile, file, contentType) {
	const { data, error } = await storageSB.from(bucket).upload(pathToFile, file, {
	  upsert: true,
	  contentType: contentType || (file && file.type) || "application/octet-stream",
	});
	if (error) throw new Error(`Failed to upload ${bucket}/${pathToFile}: ${error.message}`);
	return data;
  }
  
  async function deleteFile(bucket, pathToFile) {
	const { data, error } = await storageSB.from(bucket).remove([pathToFile]);
	if (error) throw new Error(`Failed to delete ${bucket}/${pathToFile}: ${error.message}`);
	return data;
  }
  
  async function updateFile(bucket, pathToFile, file, contentType) {
	const { data, error } = await storageSB.from(bucket).update(pathToFile, file, {
	  contentType: contentType || (file && file.type) || "application/octet-stream",
	});
	if (error) throw new Error(`Failed to update ${bucket}/${pathToFile}: ${error.message}`);
	return data;
  }
  
  async function getMultimediaUrl(ariketaId, edukia) {
	return getFileUrl("multimedia", `${ariketaId}/${edukia}`);
  }
  
  async function updateMultimedia(ariketaId, edukia, file, contentType) {
	return uploadFile("multimedia", `${ariketaId}/${edukia}`, file, contentType);
  }
  
  async function deleteMultimedia(ariketaId, edukia) {
	return deleteFile("multimedia", `${ariketaId}/${edukia}`);
  }
  
  async function getAvatarUrl(uid, pfp) {
	return getFileUrl("pfp", `${uid}/${pfp}`);
  }
  
  async function updateAvatar(uid, pfp, file, contentType) {
	return uploadFile("pfp", `${uid}/${pfp}`, file, contentType);
  }
  
  async function deleteAvatar(uid, pfp) {
	return deleteFile("pfp", `${uid}/${pfp}`);
  }