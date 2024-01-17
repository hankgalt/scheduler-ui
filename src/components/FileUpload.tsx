import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useOtherFetch } from '../lib/services/biz';
import { uploadFile } from '../lib/services/file';

export type OnSubmit = (event: React.MouseEvent<HTMLFormElement>) => void;

export const FileUpload = () => {
  const { data, error, loading } = useOtherFetch();
  const [files, setFiles] = useState<File[]>([]);

  const handleMultipleSubmit: OnSubmit = event => {
    event.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    uploadFile(formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error uploading files: ', error);
      });
  };

  return (
    <form onSubmit={handleMultipleSubmit}>
      <Grid container spacing={1}>
        {error && (
          <Grid item xs={12}>
            <p>There is an error.</p>
          </Grid>
        )}
        {loading && (
          <Grid item xs={12}>
            <p>Loading...</p>
          </Grid>
        )}
        {data && (
          <>
            <Grid item xs={12}>
              <Typography
                variant={'h4'}
                align='center'
                color='text.secondary'
                gutterBottom
              >
                {`Upload File`}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'center', margin: '15px' }}
            >
              <input
                type='file'
                multiple
                accept='.csv,.pdf,.doc,.docx,.xml'
                onChange={event =>
                  setFiles(Array.from(event.target.files ?? []))
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button
                name={'upload'}
                disabled={files.length < 1}
                size={'small'}
                variant='contained'
                aria-haspopup='true'
                type='submit'
              >
                {'Upload'}
              </Button>
            </Grid>
            {files.length > 0 && (
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <List>
                  {Array.from(files || []).map((file, index) => (
                    <ListItem key={index} disablePadding>
                      <Grid container spacing={1}>
                        <Grid item alignContent={'center'}>
                          <Typography
                            sx={{ lineHeight: '2rem', fontSize: '1.8rem' }}
                            variant={'body1'}
                          >{`${file.name}`}</Typography>
                        </Grid>
                        <Grid item alignContent={'center'}>
                          <Typography
                            sx={{ lineHeight: '2rem', fontSize: '1.5rem' }}
                            variant={'body1'}
                          >{`${file.size}`}</Typography>
                        </Grid>
                        <Grid item alignContent={'center'}>
                          <Typography
                            sx={{ lineHeight: '2rem', fontSize: '1.5rem' }}
                            variant={'body1'}
                          >{`${file.type}`}</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </form>
  );
};
