const DEFAULT_NUM_SAMPLES = 5;
const OPENING_BRACKET = '{';
const CLOSING_BRACKET = '}';

export type FileInformation = {
  name: string;
  type: string;
  size: number;
  headers: string[];
  samples: any[];
};

export type FileInformationRequest = {
  readonly file: File;
  readonly samples?: boolean;
};

export type FileInformationResponse = {
  readonly info?: FileInformation;
  readonly error?: Error;
};

export type FileReadRequest = {
  readonly file?: File;
  readonly start: number;
  readonly end: number;
};

export type FileReadResponse = {
  readonly result?: string;
  readonly error?: Error;
};

const getTokens = (text: string): string[] => {
  const str = text.replace(/\n|\r/g, '');
  return str.split('|');
};

export const readFile = async ({
  file,
  start,
  end,
}: FileReadRequest): Promise<FileReadResponse> => {
  return new Promise<FileReadResponse>((resolve, reject) => {
    if (!file) {
      reject({ error: new Error('No file provided') });
      return;
    }
    if (file && end > file.size) {
      reject({ error: new Error('End position is greater than file size') });
      return;
    }
    if (file && start > file.size) {
      reject({ error: new Error('Start position is greater than file size') });
      return;
    }
    if (start > end) {
      reject({
        error: new Error('Start position is greater than end position'),
      });
      return;
    }

    const reader = new FileReader();

    const blob = file.slice(start, end);
    reader.readAsText(blob);

    reader.onload = function (e) {
      const text = e?.target?.result ? e.target.result.toString() : '';
      resolve({ result: text });
    };

    reader.onerror = function (e) {
      reject({ error: e });
    };
  });
};

export const getFileInformation = async ({
  file,
  samples,
}: FileInformationRequest): Promise<FileInformationResponse> => {
  return new Promise<FileInformationResponse>((resolve, reject) => {
    const NUM_SAMPLES = samples ? DEFAULT_NUM_SAMPLES : 0;
    const chunkSize = 1; // Read 1 byte at a time
    let currentPosition = 0;
    let headerStr = '';
    let samplesStr = '';
    let isHeaderRead = false;
    let start = 0;
    let started = false;
    let samplesNum = 0;

    const fileInfo: FileInformation = {
      name: file.name,
      type: file.type,
      size: file.size,
      headers: [],
      samples: [],
    };

    const reader = new FileReader();

    const readNextChunk = () => {
      if (currentPosition < file.size) {
        const blob = file.slice(currentPosition, currentPosition + chunkSize);
        reader.readAsText(blob);
      }
    };

    reader.onload = function (e) {
      const text = e?.target?.result ? e.target.result.toString() : '';
      for (const char of text) {
        if (file.type === 'text/csv') {
          // CSV file
          // end of line
          if (char === '\n') {
            if (!isHeaderRead) {
              isHeaderRead = true;
              fileInfo.headers = getTokens(headerStr);
            }
            if (!samples) {
              break;
            }
          }

          // build header string
          if (!isHeaderRead) headerStr += char;

          if (isHeaderRead) {
            // return if no samples required
            if (!samples) break;

            // end of line, add the sample
            if (char === '\n') {
              if (samplesStr !== '') {
                samplesNum++;
                fileInfo.samples.push(getTokens(samplesStr));
                samplesStr = '';
              }
            } else {
              // build sample string
              samplesStr += char;
            }

            if (samplesNum >= NUM_SAMPLES || currentPosition >= file.size - 1) {
              break;
            }
          }
        } else if (file.type === 'application/json') {
          // JSON file
          // start on first opening bracket
          if (char === OPENING_BRACKET) {
            if (!started) started = true;
            start++;
          } else if (char === CLOSING_BRACKET) {
            start--;
          }

          // if started, build sample json string
          if (started) samplesStr += char;

          // end of sample, add to samples array
          if (started && start === 0) {
            if (!isHeaderRead) isHeaderRead = true;

            samplesNum++;
            fileInfo.samples.push(getTokens(samplesStr));
            samplesStr = '';
            started = false;

            // return if no samples required,
            // or if we have enough samples,
            // or it's the end of the file
            if (
              !samples ||
              samplesNum >= NUM_SAMPLES ||
              currentPosition === file.size - 1
            ) {
              break;
            }
          }
        } else {
          // other file formats. unsupported for now
          isHeaderRead = true;
          samplesNum = NUM_SAMPLES + 1;
        }
      }

      if (
        (isHeaderRead &&
          (!samples || (samples && samplesNum >= NUM_SAMPLES))) ||
        currentPosition === file.size - 1
      ) {
        resolve({
          info: { ...fileInfo },
        });
      } else {
        // Read the next chunk
        currentPosition += chunkSize;
        readNextChunk();
      }
    };

    reader.onerror = function (e) {
      reject({ error: e });
    };

    readNextChunk();
  });
};
