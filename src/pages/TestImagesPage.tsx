import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Grid, Card, CardContent, CardMedia, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ImageCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ImagePreview = styled(CardMedia)(({ theme }) => ({
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
}));

const ErrorOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: theme.spacing(2),
}));

interface TestImage {
  id: number;
  path: string;
  description: string;
  normalizedPath?: string;
  error?: boolean;
}

// Function to normalize image paths (similar to backend logic)
const normalizeImagePath = (imagePath: string): string => {
  if (!imagePath) return '';
  
  let normalizedPath = imagePath;
  
  // Handle relative paths (e.g., '../uploads/image.jpg')
  if (normalizedPath.includes('../uploads/')) {
    normalizedPath = normalizedPath.replace(/(\.\.\/)+uploads\//, '/uploads/');
  }
  
  // Handle API paths (e.g., '/api/uploads/image.jpg')
  if (normalizedPath.startsWith('/api/uploads/')) {
    normalizedPath = normalizedPath.replace('/api/uploads/', '/uploads/');
  }
  
  // Handle localhost URLs
  if (normalizedPath.includes('localhost') && normalizedPath.includes('/uploads/')) {
    normalizedPath = normalizedPath.substring(normalizedPath.indexOf('/uploads/'));
  }
  
  // Handle paths that don't start with '/uploads/' but contain 'uploads/'
  if (!normalizedPath.startsWith('/uploads/') && normalizedPath.includes('uploads/')) {
    normalizedPath = '/uploads/' + normalizedPath.substring(normalizedPath.indexOf('uploads/') + 8);
  }
  
  // Ensure the path always starts with the URL prefix
  if (!normalizedPath.startsWith('/uploads/') && !normalizedPath.startsWith('http')) {
    normalizedPath = '/uploads/' + normalizedPath;
  }
  
  return normalizedPath;
};

const TestImagesPage: React.FC = () => {
  // Sample test images with various path formats
  const [testImages, setTestImages] = useState<TestImage[]>([
    { id: 1, path: '/uploads/test-image-1.jpg', description: 'Standard path with /uploads/ prefix' },
    { id: 2, path: '../../uploads/test-image-2.jpg', description: 'Relative path with ../uploads/' },
    { id: 3, path: '/api/uploads/test-image-3.jpg', description: 'API path with /api/uploads/' },
    { id: 4, path: 'http://localhost:5000/uploads/test-image-4.jpg', description: 'Full URL with localhost' },
    { id: 5, path: 'uploads/test-image-5.jpg', description: 'Path without leading slash' },
    { id: 6, path: 'test-image-6.jpg', description: 'Just filename without path' },
  ]);
  
  const [customPath, setCustomPath] = useState<string>('');
  const [normalizedCustomPath, setNormalizedCustomPath] = useState<string>('');
  const [showCustomImage, setShowCustomImage] = useState<boolean>(false);

  // Normalize and test custom path
  const testCustomPath = () => {
    if (!customPath) return;
    
    const normalized = normalizeImagePath(customPath);
    setNormalizedCustomPath(normalized);
    setShowCustomImage(true);
  };

  // Normalize all test images
  const normalizeAllImages = () => {
    setTestImages(prevImages => 
      prevImages.map(img => ({
        ...img,
        normalizedPath: normalizeImagePath(img.path),
        error: false
      }))
    );
  };

  // Handle image load error
  const handleImageError = (id: number) => {
    setTestImages(prevImages => 
      prevImages.map(img => 
        img.id === id ? { ...img, error: true } : img
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Image Path Normalization Test
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This page tests the frontend's ability to normalize and display images with various path formats.
        For more detailed debugging, visit the <a href="/image-debug">Image Debug Page</a>.
      </Alert>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Test Custom Image Path
        </Typography>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            label="Image Path"
            variant="outlined"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            placeholder="e.g., /uploads/image.jpg or ../../uploads/image.jpg"
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={testCustomPath}
            disabled={!customPath}
          >
            Test
          </Button>
        </Box>

        {showCustomImage && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Original: {customPath}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Normalized: {normalizedCustomPath}
            </Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              <img
                src={normalizedCustomPath}
                alt="Custom test"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={() => setShowCustomImage(false)}
              />
            </Box>
          </Box>
        )}
      </StyledPaper>

      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Test Images with Different Path Formats
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={normalizeAllImages}
          >
            Normalize All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {testImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <ImageCard>
                <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" noWrap>
                    Original: {image.path}
                  </Typography>
                  {image.normalizedPath && (
                    <Typography variant="subtitle2" noWrap color="primary">
                      Normalized: {image.normalizedPath}
                    </Typography>
                  )}
                </Box>
                
                {image.normalizedPath && (
                  <Box sx={{ position: 'relative', pt: '56.25%' }}>
                    <img
                      src={image.normalizedPath}
                      alt={`Test ${image.id}`}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      onError={() => handleImageError(image.id)}
                    />
                    {image.error && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          p: 2
                        }}
                      >
                        <Typography variant="body2">
                          Failed to load image
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {image.description}
                  </Typography>
                </CardContent>
              </ImageCard>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default TestImagesPage; 