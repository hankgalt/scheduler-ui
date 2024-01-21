import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  FileResponse,
  FilesResponse,
  FileRequest,
  StorageFile,
} from '@hankgalt/cloud-storage-client';
import type {
  WorkflowRunSearchParams,
  WorkflowRunsResponse,
  SchedulerWorkflowRun,
} from '@hankgalt/scheduler-client';
import { RootState } from './store';
import {
  apiUploadFile,
  apiListBucketFiles,
  apiDeleteFile,
} from '../lib/services/file';
import { apiSearchWorkflowRuns } from '../lib/services/biz';
import type { FileInformation } from '../lib/utils/helpers';

interface ModalProps {
  type: string;
}

interface AppState {
  loading: boolean;
  errors: string[];
  modal?: ModalProps;
  uploadedFiles: { [key: string]: StorageFile };
  fileInfos: { [key: string]: FileInformation };
  runs: { [key: string]: SchedulerWorkflowRun };
}

export const uploadSingleFile = createAsyncThunk(
  '/file/upload',
  async (data: FormData) => {
    return await apiUploadFile(data);
  }
);

export const getFileList = createAsyncThunk(
  '/file/list',
  async (bucket: string | undefined) => {
    return await apiListBucketFiles(bucket);
  }
);

export const deleteUploadedFile = createAsyncThunk(
  '/file/delete',
  async (data: FileRequest) => {
    return await apiDeleteFile(data);
  }
);

export const searchWorkflowRuns = createAsyncThunk(
  '/workflow/search',
  async (params: WorkflowRunSearchParams) => {
    console.log('searchWorkflowRuns - params', params);
    return await apiSearchWorkflowRuns(params);
  }
);

const initialState: AppState = {
  loading: false,
  errors: [],
  uploadedFiles: {},
  fileInfos: {},
  runs: {},
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<ModalProps>): void => {
      const mod = action.payload;
      if (mod?.type && mod.type !== '') {
        state.modal = mod;
      }
    },
    removeModal: (state, action: PayloadAction<string>): void => {
      if (
        state?.modal?.type &&
        state?.modal?.type !== '' &&
        state.modal.type === action.payload
      ) {
        state.modal = undefined;
      }
    },
    updateFileInfo: (state, action: PayloadAction<FileInformation>): void => {
      const fileInfo = action.payload;
      state.fileInfos = {
        ...state.fileInfos,
        [fileInfo.name]: fileInfo,
      };
    },
  },
  extraReducers: builder => {
    // uploadSingleFile
    builder.addCase(uploadSingleFile.pending, state => {
      state.loading = true;
    }),
      builder.addCase(
        uploadSingleFile.fulfilled,
        (state, action: PayloadAction<FileResponse>) => {
          state.loading = false;
          if (!action.payload.error) {
            state.errors = [];
          } else {
            if (action.payload.error) {
              state.errors = [JSON.stringify(action.payload.error)];
            }
          }
        }
      ),
      builder.addCase(uploadSingleFile.rejected, state => {
        state.loading = false;
        state.errors = ['Error uploading file, request rejected'];
      }),
      // getFileList
      builder.addCase(getFileList.pending, state => {
        state.loading = true;
      }),
      builder.addCase(
        getFileList.fulfilled,
        (state, action: PayloadAction<FilesResponse>) => {
          state.loading = false;
          if (!action.payload.error && action.payload.files) {
            state.errors = [];
            let payloadFiles = {};
            for (const file of action.payload.files) {
              payloadFiles = {
                ...payloadFiles,
                [file.name]: file,
              };
            }
            state.uploadedFiles = { ...payloadFiles };
          } else {
            if (action.payload.error) {
              state.errors = [action.payload.error.message];
            }
          }
        }
      ),
      builder.addCase(getFileList.rejected, state => {
        state.loading = false;
        state.errors = ['Error deleting file, request rejected'];
      }),
      // deleteUploadedFile
      builder.addCase(deleteUploadedFile.pending, state => {
        state.loading = true;
      }),
      builder.addCase(
        deleteUploadedFile.fulfilled,
        (state, action: PayloadAction<FilesResponse>) => {
          state.loading = false;
          if (!action.payload.error) {
            state.errors = [];
          } else {
            state.errors = [action.payload.error.message];
          }
        }
      ),
      builder.addCase(deleteUploadedFile.rejected, state => {
        state.loading = false;
        state.errors = ['Error deleting file, request rejected'];
      }),
      // searchWorkflowRuns
      builder.addCase(searchWorkflowRuns.pending, state => {
        state.loading = true;
      }),
      builder.addCase(
        searchWorkflowRuns.fulfilled,
        (state, action: PayloadAction<WorkflowRunsResponse>) => {
          state.loading = false;
          if (!action.payload.error) {
            state.errors = [];
            if (action.payload.runs) {
              let runs = {};
              for (const run of action.payload.runs) {
                runs = {
                  ...runs,
                  [run.workflowId]: run,
                };
              }
              state.runs = { ...runs };
            }
          } else {
            state.errors = [JSON.stringify(action.payload.error)];
          }
        }
      ),
      builder.addCase(searchWorkflowRuns.rejected, state => {
        state.loading = false;
        state.errors = ['Error deleting file, request rejected'];
      });
  },
});

export const { setModal, removeModal, updateFileInfo } = appStateSlice.actions;

export const appState = (state: RootState) => state.appState;

export default appStateSlice.reducer;
