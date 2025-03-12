import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { API_URL } from '../config/constants';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  objectFit: 'contain',
  marginTop: '10px',
});

interface ImageFile {
  name: string;
  path: string;
  size: number;
  created: string;
  modified: string;
  url: string;
}

interface UploadDirectories {
  root: string;
  public: string;
}

interface UploadsResponse {
  rootUploads: ImageFile[];
  publicUploads: ImageFile[];
  directories: UploadDirectories;
}

interface PathAnalysisResponse {
  original: string;
  normalized: string;
  exists: boolean;
  foundAt?: string;
  absolutePath?: string;
  uploadPaths: UploadDirectories;
}

const ImageDebugPage: React.FC = () => {
  const [imagePath, setImagePath] = useState<string>('');
  const [pathAnalysis, setPathAnalysis] = useState<PathAnalysisResponse | null>(null);
  const [uploads, setUploads] = useState<UploadsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch uploads on component mount
  useEffect(() => {
    fetchUploads();
  }, []);

  // Analyze image path
  const analyzePath = async () => {
    if (!imagePath) {
      setError('Please enter an image path');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<PathAnalysisResponse>(
        `${API_URL}/test/image-path?path=${encodeURIComponent(imagePath)}`
      );
      setPathAnalysis(response.data);
    } catch (err) {
      console.error('Error analyzing path:', err);
      setError('Failed to analyze image path');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all uploads
  const fetchUploads = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<UploadsResponse>(`${API_URL}/test/uploads`);
      setUploads(response.data);
    } catch (err) {
      console.error('Error fetching uploads:', err);
      setError('Failed to fetch uploads');
    } finally {
      setLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Set image path from table
  const selectImagePath = (url: string) => {
    setImagePath(url);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Image Path Debugger
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Test Image Path
        </Typography>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            label="Image Path"
            variant="outlined"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="e.g., /uploads/image.jpg or ../../uploads/image.jpg"
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={analyzePath}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
        </Box>

        {pathAnalysis && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Path Analysis Results
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Original Path</TableCell>
                    <TableCell>{pathAnalysis.original}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Normalized Path</TableCell>
                    <TableCell>{pathAnalysis.normalized}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Image Exists</TableCell>
                    <TableCell>
                      {pathAnalysis.exists ? (
                        <Alert severity="success" sx={{ py: 0 }}>Yes</Alert>
                      ) : (
                        <Alert severity="error" sx={{ py: 0 }}>No</Alert>
                      )}
                    </TableCell>
                  </TableRow>
                  {pathAnalysis.foundAt && (
                    <TableRow>
                      <TableCell component="th" scope="row">Found At</TableCell>
                      <TableCell>{pathAnalysis.foundAt}</TableCell>
                    </TableRow>
                  )}
                  {pathAnalysis.absolutePath && (
                    <TableRow>
                      <TableCell component="th" scope="row">Absolute Path</TableCell>
                      <TableCell>{pathAnalysis.absolutePath}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {pathAnalysis.normalized && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Image Preview
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <ImagePreview
                    src={pathAnalysis.normalized}
                    alt="Image preview"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = 'none';
                      setError('Failed to load image. The path may be incorrect or the image may not exist.');
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </StyledPaper>

      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Uploaded Images
          </Typography>
          <Button
            variant="outlined"
            onClick={fetchUploads}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {loading && !uploads && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {uploads && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Root Uploads Directory: {uploads.directories.root}
              </Typography>
              {uploads.rootUploads.length === 0 ? (
                <Alert severity="info">No files found in root uploads directory</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Filename</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Modified</TableCell>
                        <TableCell>Preview</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uploads.rootUploads.map((file) => (
                        <TableRow key={file.name}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                          <TableCell>{new Date(file.modified).toLocaleString()}</TableCell>
                          <TableCell>
                            <ImagePreview
                              src={file.url}
                              alt={file.name}
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => selectImagePath(file.url)}
                            >
                              Use Path
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Public Uploads Directory: {uploads.directories.public}
              </Typography>
              {uploads.publicUploads.length === 0 ? (
                <Alert severity="info">No files found in public uploads directory</Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Filename</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Modified</TableCell>
                        <TableCell>Preview</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uploads.publicUploads.map((file) => (
                        <TableRow key={file.name}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                          <TableCell>{new Date(file.modified).toLocaleString()}</TableCell>
                          <TableCell>
                            <ImagePreview
                              src={file.url}
                              alt={file.name}
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => selectImagePath(file.url)}
                            >
                              Use Path
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
          </Grid>
        )}
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Common Image Path Patterns to Test
        </Typography>
        <Grid container spacing={2}>
          {[
            '/uploads/image.jpg',
            '../../uploads/image.jpg',
            '/api/uploads/image.jpg',
            'http://localhost:5000/uploads/image.jpg'
          ].map((path) => (
            <Grid item xs={12} sm={6} md={3} key={path}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setImagePath(path)}
                sx={{ textTransform: 'none' }}
              >
                {path}
              </Button>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default ImageDebugPage;