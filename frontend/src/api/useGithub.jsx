import { useAppContext } from "../Context/AppContext";
import {
  getContent,
  getMemoUser,
  joinPaths,
  readFileAsBase64,
  uploadSingleFile,
} from "./github";

export default function useGithub() {
  const { setLoaderTxt } = useAppContext();

  const downloadBufferContent = async (data) => {
    const pathArr = data.map((obj) => obj.path);

    let fileNum = 0;
    try {
      for (const path of pathArr) {
        fileNum++;
        setLoaderTxt(`Downloading File ${fileNum}/${pathArr.length}`);

        const response = await getContent(path);
        const downloadDetail = {
          url: response.download_url,
          name: response.name,
        };

        // Check if the file is a chunkdata file
        if (downloadDetail.name.endsWith(".chunkdata")) {
          // Fetch chunk data
          const responseText = await fetch(downloadDetail.url);
          const chunkData = await responseText.text();
          const chunkNames = chunkData.split("\n").slice(1, -1); // Skip the first line (header) and last line (total chunks)
          const totalChunks = parseInt(
            chunkData.split("\n").slice(-1)[0].split(": ")[1],
          );

          const blobs = [];
          let downloadedChunks = 0;

          const hiddenFolder = await getContent(
            `${path.substring(0, path.lastIndexOf("/"))}/hiddenChunks-${downloadDetail.name.split(".chunkdata")[0]}`,
          );
          const totalFileSize = hiddenFolder.reduce(
            (acc, item) => acc + item.size,
            0,
          );
          let totalFileSizeText;
          if (totalFileSize >= 1024 * 1024 * 1024) {
            // Convert to GB if size is 1000 MB or more
            totalFileSizeText =
              (totalFileSize / (1024 * 1024 * 1024)).toFixed(2) + " GB";
          } else {
            // Otherwise, convert to MB
            totalFileSizeText =
              (totalFileSize / (1024 * 1024)).toFixed(2) + " MB";
          }

          setLoaderTxt(
            `Downloading ${totalFileSizeText} File ${fileNum}/${pathArr.length} Chunk ${1}/${totalChunks}`,
          );

          // Download chunks in groups of 3
          for (let i = 0; i < totalChunks; i += 3) {
            // Slice to get a maximum of 3 chunk names at a time
            const chunkGroup = chunkNames.slice(i, i + 3);

            // Track each chunk download progress
            const chunkPromises = chunkGroup.map(async (chunkName) => {
              const chunkPath = `${path.substring(0, path.lastIndexOf("/"))}/hiddenChunks-${downloadDetail.name.split(".chunkdata")[0]}/${chunkName}`;
              const chunkResponse = await getContent(chunkPath);

              if (chunkResponse.download_url) {
                // Download the chunk and update the progress counter upon success
                return fetch(chunkResponse.download_url)
                  .then((res) => res.blob())
                  .then((blob) => {
                    downloadedChunks++;
                    setLoaderTxt(
                      `Downloading ${totalFileSizeText} File ${fileNum}/${pathArr.length} Chunk ${downloadedChunks + 1}/${totalChunks}`,
                    );
                    return blob;
                  });
              }
            });

            // Wait for all 3 chunks in the group to download
            const groupBlobs = await Promise.all(chunkPromises);
            blobs.push(...groupBlobs.filter(Boolean)); // Add the blobs to the array, filtering out any undefined values
          }

          setLoaderTxt(`Compiling Chunks`);

          // Combine all downloaded chunks
          const combinedBlob = new Blob(blobs);
          const blobUrl = URL.createObjectURL(combinedBlob);

          const combinedFileLink = document.createElement("a");
          combinedFileLink.href = blobUrl;
          combinedFileLink.download =
            downloadDetail.name.split(".chunkdata")[0]; // Name without .chunkdata
          document.body.appendChild(combinedFileLink);
          combinedFileLink.click();
          combinedFileLink.remove();
          URL.revokeObjectURL(blobUrl); // Clean up
        } else {
          const fileBlob = await fetch(downloadDetail.url).then((res) =>
            res.blob(),
          );
          const fileBlobUrl = URL.createObjectURL(fileBlob);

          const fileDownloadLink = document.createElement("a");
          fileDownloadLink.href = fileBlobUrl;
          fileDownloadLink.download = downloadDetail.name;
          document.body.appendChild(fileDownloadLink);
          fileDownloadLink.click();
          fileDownloadLink.remove();
          URL.revokeObjectURL(fileBlobUrl); // Clean up
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoaderTxt("");
    }

    return 1;
  };

  const deleteContent = async (data) => {
    const user = await getMemoUser();
    const responses = [];

    let fileNum = 0;
    for (const dat of data) {
      fileNum++;
      const url = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${dat.path}`;

      try {
        if (dat.path.endsWith(".chunkdata")) {
          // If the file is a chunkdata file, delete it and its chunks
          const deleteResponse = await fetch(url, {
            method: "DELETE",
            headers: {
              Authorization: `token ${user.githubToken}`,
              "X-GitHub-Api-Version": "2022-11-28",
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({
              message: `Deleting Chunkdata File: ${dat.path}`,
              sha: dat.sha,
            }),
          });

          if (!deleteResponse.ok) {
            throw new Error(
              `Failed to delete ${dat.path}: ${deleteResponse.status}`,
            );
          }

          responses.push(await deleteResponse.json());

          // Construct the full path for the chunk folder
          const chunkFolderName = `${dat.path.substring(0, dat.path.lastIndexOf("/"))}/hiddenChunks-${dat.name.split(".chunkdata")[0]}`;
          const chunkList = await getContent(chunkFolderName);

          // Ensure chunkList is an array before iterating
          if (Array.isArray(chunkList)) {
            let chunkNum = 0;
            for (const chunk of chunkList) {
              chunkNum++;
              setLoaderTxt(
                `Deleting File ${fileNum}/${data.length} Chunk ${chunkNum}/${chunkList.length}`,
              );

              const chunkDeleteUrl = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${chunk.path}`;

              const chunkDeleteResponse = await fetch(chunkDeleteUrl, {
                method: "DELETE",
                headers: {
                  Authorization: `token ${user.githubToken}`,
                  "X-GitHub-Api-Version": "2022-11-28",
                  Accept: "application/vnd.github.v3+json",
                },
                body: JSON.stringify({
                  message: `Deleting Chunk: ${chunk.path}`,
                  sha: chunk.sha,
                }),
              });

              if (!chunkDeleteResponse.ok) {
                console.error(
                  `Failed to delete chunk ${chunk.path}: ${chunkDeleteResponse.status}`,
                );
              } else {
                responses.push(await chunkDeleteResponse.json());
              }
            }
          } else {
            console.warn(`No chunks found for folder: ${chunkFolderName}`);
          }
        } else {
          // Regular file deletion
          setLoaderTxt(`Deleting File ${fileNum}/${data.length}`);
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              Authorization: `token ${user.githubToken}`,
              "X-GitHub-Api-Version": "2022-11-28",
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({
              message: `Deleting File: ${dat.path}`,
              sha: dat.sha,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to delete ${dat.path}: ${response.status}`);
          }

          responses.push(await response.json());
        }
      } catch (error) {
        console.error(`Error deleting content at path ${dat.path}:`, error);
        throw error;
      } finally {
        setLoaderTxt("");
      }
    }

    return responses;
  };

  const postContent = async ({ files, uploadPath = "" }) => {
    const user = await getMemoUser();
    const responses = [];
    const CHUNK_SIZE = 25 * 1024 * 1024; // 25 MB

    let fileNum = 0;
    for (const file of files) {
      fileNum++;
      try {
        if (file.size <= CHUNK_SIZE) {
          setLoaderTxt(`Uploading File ${fileNum}/${files.length}`);
          // If file is less than or equal to 25 MB, upload normally
          const base64Content = await readFileAsBase64(file);
          const url = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${joinPaths(uploadPath, file.name)}`;

          const response = await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `token ${user.githubToken}`,
              "X-GitHub-Api-Version": "2022-11-28",
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({
              message: `Adding file: ${file.name}`,
              content: base64Content,
            }),
          });

          const responseBody = await response.json();

          if (!response.ok) {
            throw new Error(
              responseBody.message || `Failed to upload ${file.name}`,
            );
          }

          responses.push(responseBody);
        } else {
          // Handle chunked upload for files larger than 25 MB
          const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
          const chunkFolderName = `hiddenChunks-${file.name}`;
          const chunkPath = `${uploadPath}/${chunkFolderName}`;
          const chunkMetadata = [];

          for (let i = 0; i < chunkCount; i++) {
            setLoaderTxt(
              `Uploading File ${fileNum}/${files.length} Chunk ${i + 1}/${chunkCount}`,
            );
            const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            const chunkName = `${file.name}-part-${i + 1}`;
            chunkMetadata.push(chunkName);

            const chunkResponse = await uploadSingleFile(
              chunk,
              user.githubRepoOwner,
              user.githubRepo,
              chunkPath,
              chunkName,
            );
            responses.push(chunkResponse);
          }

          // Create and upload metadata file in the uploadPath
          const metadataContent = `Chunk Names:\n${chunkMetadata.join("\n")}\nTotal Chunks: ${chunkCount}`;
          const metadataBlob = new Blob([metadataContent], {
            type: "text/plain",
          });
          const metadataFile = new File(
            [metadataBlob],
            `${file.name}.chunkdata`,
          );

          const metadataResponse = await uploadSingleFile(
            metadataFile,
            user.githubRepoOwner,
            user.githubRepo,
            uploadPath,
            `${file.name}.chunkdata`,
          );
          responses.push(metadataResponse);
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      } finally {
        setLoaderTxt("");
      }
    }

    console.log(responses);
    return responses;
  };

  return { downloadBufferContent, deleteContent, postContent };
}
