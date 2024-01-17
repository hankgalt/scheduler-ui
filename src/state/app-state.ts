import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FileResponse } from '@hankgalt/cloud-storage-client/lib/index';
import { RootState } from './store';
import { uploadFile } from '../lib/services/file';

interface ModalProps {
  type: string;
}

interface AppState {
  loading: boolean;
  errors: string[];
  modal?: ModalProps;
}

export const uploadSingleFile = createAsyncThunk(
  '/upload',
  async (data: FormData) => {
    try {
      const res = await uploadFile(data);
      const response = await res.json();
      console.log('file upload response: ', response);
      return response;
    } catch (error) {
      console.error('Error uploading files: ', error);
      return { error };
    }
  }
);

const initialState: AppState = {
  loading: false,
  errors: [],
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
  },
  extraReducers: (builder) => {
    // uploadSingleFile
    builder.addCase(uploadSingleFile.pending, (state) => {
      state.loading = true
    }),
      builder.addCase(
        uploadSingleFile.fulfilled,
        (state, action: PayloadAction<FileResponse>) => {
          state.loading = false
          if (!action.payload.error) {
            state.errors = []
          } else {
            if (action.payload.error) {
              state.errors = [action.payload.error.message]
            }
          }
        }
      ),
      builder.addCase(uploadSingleFile.rejected, (state) => {
        state.loading = false
        state.errors = ['Error uploading file, request rejected']
      })
  }
});

export const { setModal, removeModal } = appStateSlice.actions;

export const appState = (state: RootState) => state.appState;

export default appStateSlice.reducer;
