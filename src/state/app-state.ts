import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  FileResponse,
  FilesResponse,
  FileRequest,
  StorageFile,
} from '@hankgalt/cloud-storage-client';
import type {
  WorkflowRunSearchParams,
  FileWorkflowStateRequest,
  WorkflowRunsResponse,
  WorkflowStateResponse,
  SchedulerWorkflowRun,
  WorkflowResult,
  BusinessEntityRequest,
  BusinessEntityResponse,
} from '@hankgalt/scheduler-client/dist/lib/pkg';
import { RootState } from './store';
import {
  apiUploadFile,
  apiListBucketFiles,
  apiDeleteFile,
} from '../lib/services/file';
import {
  apiSearchWorkflowRuns,
  apiFileWorkflowState,
  apiGetEntity,
} from '../lib/services/biz';
import type { FileInformation } from '../lib/utils/helpers';

interface ModalProps {
  type: string;
  data?: {
    [key: string]: any;
  };
}

interface HasState {
  stateId?: string;
}

export interface AppStorageFile extends StorageFile, HasState {}
export interface AppFileInformation extends FileInformation, HasState {}

interface AppState {
  loading: boolean;
  errors: string[];
  modal?: ModalProps;
  uploadedFiles: { [key: string]: AppStorageFile };
  fileInfos: { [key: string]: AppFileInformation };
  runs: { [key: string]: SchedulerWorkflowRun };
  results: { [key: string]: WorkflowResult };
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
    return await apiSearchWorkflowRuns(params);
  }
);

export const getWorkflowState = createAsyncThunk(
  '/workflow/state',
  async (params: FileWorkflowStateRequest) => {
    return await apiFileWorkflowState(params);
  }
);

export const getEntity = createAsyncThunk(
  '/entity/get',
  async (params: BusinessEntityRequest) => {
    return await apiGetEntity(params);
  }
);

const initialState: AppState = {
  loading: false,
  errors: [],
  uploadedFiles: {},
  fileInfos: {},
  runs: {},
  results: {},
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
        [fileInfo.name]: state.fileInfos[fileInfo.name]
          ? {
              ...state.fileInfos[fileInfo.name],
              ...fileInfo,
              stateId: state.fileInfos[fileInfo.name].stateId,
            }
          : fileInfo,
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
                [file.name]: state.uploadedFiles[file.name]
                  ? {
                      ...state.uploadedFiles[file.name],
                      ...file,
                      stateId: state.uploadedFiles[file.name].stateId,
                    }
                  : file,
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
        state.errors = ['Error searching for workflow runs, request rejected'];
      }),
      // getWorkflowState
      builder.addCase(getWorkflowState.pending, state => {
        state.loading = true;
      }),
      builder.addCase(
        getWorkflowState.fulfilled,
        (state, action: PayloadAction<WorkflowStateResponse>) => {
          state.loading = false;
          if (!action.payload.error) {
            state.errors = [];
            if (action.payload.state) {
              state.results = {
                ...state.results,
                [action.payload.state.fileName]: {
                  ...action.payload.state,
                  batches: action.payload.state.batches.sort((a, b) => {
                    return parseInt(a.batchIndex) - parseInt(b.batchIndex);
                  }),
                },
              };

              if (state.uploadedFiles[action.payload.state.fileName]) {
                state.uploadedFiles[action.payload.state.fileName].stateId =
                  action.payload.state.fileName;
              }
            }
          } else {
            state.errors = [JSON.stringify(action.payload.error)];
          }
        }
      ),
      builder.addCase(getWorkflowState.rejected, state => {
        state.loading = false;
        state.errors = ['Error fetching workflow state, request rejected'];
      }),
      // getEntity
      builder.addCase(getEntity.pending, state => {
        state.loading = true;
      }),
      builder.addCase(
        getEntity.fulfilled,
        (state, action: PayloadAction<BusinessEntityResponse>) => {
          state.loading = false;
          if (!action.payload.error) {
            state.errors = [];
            console.log('getEntity.fulfilled - action.payload', action.payload);
          } else {
            state.errors = [JSON.stringify(action.payload.error)];
          }
        }
      ),
      builder.addCase(getEntity.rejected, state => {
        state.loading = false;
        state.errors = ['Error fetching business entity, request rejected'];
      });
  },
});

export const { setModal, removeModal, updateFileInfo } = appStateSlice.actions;

export const appState = (state: RootState) => state.appState;

export default appStateSlice.reducer;
