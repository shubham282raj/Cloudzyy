import { useAppContext } from "../Context/AppContext";
import { getContent } from "./github";

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

  return { downloadBufferContent };
}
