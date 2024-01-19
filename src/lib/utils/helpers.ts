export type FileInformation = {
  name: string;
  type: string;
  size: number;
  headers?: string[];
  samples?: any[];
};

export type FileInformationResponse = {
  info?: FileInformation;
  error?: Error;
};

export const getFileInformation = async (
  file: File,
  samples?: boolean
): Promise<FileInformationResponse> => {
  const chunkSize = 1; // Read 1 byte at a time
  let currentPosition = 0;
  let headerStr = '';
  let jsonStr = '';
  let isHeaderRead = false;

  const fileInfo: FileInformation = {
    name: file.name,
    type: file.type,
    size: file.size,
  };

  return new Promise<FileInformationResponse>((resolve, reject) => {
    const reader = new FileReader();

    const readNextChunk = () => {
      if (currentPosition < file.size) {
        const blob = file.slice(currentPosition, currentPosition + chunkSize);
        reader.readAsText(blob);
      }
    };

    const OPENING_BRACKET = '{';
    const CLOSING_BRACKET = '}';

    let start = 0;
    let started = false;
    let samplesNum = 0;
    let samplesStr = '';
    let samplesArr: any[] = [];

    reader.onload = function (e) {
      const text = e?.target?.result ? e.target.result.toString() : '';
      for (const char of text) {
        if (file.type === 'text/csv') {
          // CSV file
          if (char === '\n') {
            // End of the header line
            if (!isHeaderRead) {
              isHeaderRead = true;
              headerStr = headerStr.replace(/\n|\r/g, '');
              fileInfo.headers = headerStr.split('|');
            }
            if (!samples) {
              break;
            }
          }
          if (!isHeaderRead) headerStr += char;
          if (isHeaderRead && samples) {
            if (char === '\n') {
              if (samplesStr !== '') {
                samplesNum++;
                samplesArr = [
                  ...samplesArr,
                  samplesStr.replace(/\n|\r/g, '').split('|'),
                ];
                samplesStr = '';
              }
            } else {
              samplesStr += char;
            }

            if (samplesNum >= 5 || currentPosition === file.size - 1) {
              break;
            }
          }
        } else if (file.type === 'application/json') {
          // JSON file
          if (char === OPENING_BRACKET) {
            if (!started) started = true;
            start++;
          } else if (char === CLOSING_BRACKET) {
            start--;
          }

          if (started) jsonStr += char;

          if (started && start === 0) {
            if (!isHeaderRead) isHeaderRead = true;
            samplesNum++;
            samplesArr = [...samplesArr, JSON.parse(jsonStr)];
            jsonStr = '';
            started = false;
            if (
              !samples ||
              samplesNum >= 5 ||
              currentPosition === file.size - 1
            ) {
              break;
            }
          }
        } else {
          // other file formats
          // unsupported file type
          isHeaderRead = true;
          samplesNum = 6;
        }
      }

      if (
        (isHeaderRead && (!samples || (samples && samplesNum >= 5))) ||
        currentPosition === file.size - 1
      ) {
        resolve({
          info: {
            ...fileInfo,
            samples: samplesArr?.length ? samplesArr : undefined,
          },
        });
      } else {
        // Read the next chunk
        currentPosition += chunkSize;
        readNextChunk();
      }
    };

    reader.onerror = function (e) {
      console.error(`Error reading file ${file.name}: `, e);
      reject({ error: e });
    };

    readNextChunk();
  });
};
