import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config/constants';

const TestPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Load categories
  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/categories`);
      console.log('Categories response:', response.data);
      setCategories(response.data.categories || response.data);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Test post creation with a category
  const testCreatePost = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const testPost = {
        title: 'Test Post ' + new Date().toISOString(),
        content: '<p>This is a test post created at ' + new Date().toISOString() + '</p>',
        category: categoryId,
        published: true
      };
      
      console.log('Creating test post with data:', testPost);
      
      const response = await axios.post(`${API_URL}/posts`, testPost);
      console.log('Create post response:', response.data);
      setResult(response.data);
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create post');
      
      // Show more error details if available
      if (err.response?.data) {
        setResult(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Debug: Category Testing
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Categories
        </Typography>
        
        {loading && <Typography>Loading...</Typography>}
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            Error: {error}
          </Typography>
        )}
        
        {categories.length > 0 ? (
          <List>
            {categories.map((category) => (
              <React.Fragment key={category._id}>
                <ListItem>
                  <ListItemText 
                    primary={category.name} 
                    secondary={`ID: ${category._id}`} 
                  />
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => testCreatePost(category._id)}
                  >
                    Test Post
                  </Button>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography>No categories found</Typography>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={loadCategories}
            disabled={loading}
          >
            Refresh Categories
          </Button>
        </Box>
      </Paper>
      
      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Result
          </Typography>
          <pre style={{ overflow: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Paper>
      )}
    </Container>
  );
};

export default TestPage; 