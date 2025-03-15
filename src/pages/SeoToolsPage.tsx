import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import SpeedIcon from '@mui/icons-material/Speed';
import CodeIcon from '@mui/icons-material/Code';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import WebVitalsDisplay from '../components/WebVitalsDisplay';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`seo-tabpanel-${index}`}
      aria-labelledby={`seo-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `seo-tab-${index}`,
    'aria-controls': `seo-tabpanel-${index}`,
  };
}

const SeoToolsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [url, setUrl] = useState('');
  const [schemaValidationResults, setSchemaValidationResults] = useState<null | {
    valid: boolean;
    errors: Array<{type: string; message: string}>;
  }>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const validateSchema = () => {
    // This would normally call an API to validate the schema
    // For demo purposes, we'll simulate a response
    setTimeout(() => {
      if (url.includes('yourdomain.com') || url.includes('localhost')) {
        setSchemaValidationResults({
          valid: true,
          errors: []
        });
      } else {
        setSchemaValidationResults({
          valid: false,
          errors: [
            { type: 'error', message: 'Missing required @context property' },
            { type: 'error', message: 'Invalid type for datePublished property' },
            { type: 'warning', message: 'Recommended property "author" is missing' }
          ]
        });
      }
    }, 1000);
  };

  const seoChecklist = [
    { id: 1, title: 'Meta Tags', description: 'Title, description, and canonical tags are properly set', status: 'success' },
    { id: 2, title: 'Structured Data', description: 'JSON-LD schema is valid and complete', status: 'success' },
    { id: 3, title: 'Image Optimization', description: 'Images have alt text and are properly sized', status: 'warning' },
    { id: 4, title: 'Mobile Responsiveness', description: 'Site is fully responsive on all devices', status: 'success' },
    { id: 5, title: 'Page Speed', description: 'Core Web Vitals meet Google\'s requirements', status: 'error' },
    { id: 6, title: 'SSL Certificate', description: 'Site uses HTTPS with a valid certificate', status: 'success' },
    { id: 7, title: 'XML Sitemap', description: 'Sitemap is valid and submitted to search engines', status: 'warning' },
    { id: 8, title: 'Robots.txt', description: 'Robots.txt is properly configured', status: 'success' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Helmet>
        <title>SEO Tools & Performance | Modern Tech Blog</title>
        <meta name="description" content="Monitor and improve your website's SEO performance with our comprehensive tools and metrics dashboard." />
      </Helmet>

      <Typography variant="h3" component="h1" gutterBottom>
        SEO Tools & Performance
      </Typography>
      
      <Typography variant="body1" paragraph>
        Monitor and optimize your website's search engine performance with these tools. 
        Track Core Web Vitals, validate structured data, and ensure your site follows SEO best practices.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="SEO tools tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<SpeedIcon />} label="Web Vitals" {...a11yProps(0)} />
          <Tab icon={<CodeIcon />} label="Schema Validator" {...a11yProps(1)} />
          <Tab icon={<SearchIcon />} label="SEO Checklist" {...a11yProps(2)} />
          <Tab icon={<LinkIcon />} label="Link Checker" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom>
          Core Web Vitals Monitor
        </Typography>
        
        <Typography variant="body2" paragraph color="text.secondary">
          Core Web Vitals are a set of metrics that measure real-world user experience for loading performance, 
          interactivity, and visual stability. Good scores can improve your search rankings.
        </Typography>
        
        <WebVitalsDisplay />
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recommendations to Improve Web Vitals
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Improve LCP
                  </Typography>
                  <Typography variant="body2">
                    Optimize your largest content element loading time by:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Optimize and compress images" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Implement lazy loading" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Use a CDN for faster delivery" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Improve CLS
                  </Typography>
                  <Typography variant="body2">
                    Reduce layout shifts by:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Set image dimensions in HTML" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Reserve space for ads and embeds" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Avoid inserting content above existing content" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Improve FID/INP
                  </Typography>
                  <Typography variant="body2">
                    Enhance interactivity by:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Minimize JavaScript execution time" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Break up long tasks into smaller ones" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Optimize event handlers and animations" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>
          Structured Data Validator
        </Typography>
        
        <Typography variant="body2" paragraph color="text.secondary">
          Validate your JSON-LD structured data to ensure it meets Schema.org and Google's requirements.
          Proper structured data helps search engines understand your content and can enable rich results.
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <TextField
              label="Enter URL to validate"
              variant="outlined"
              fullWidth
              value={url}
              onChange={handleUrlChange}
              placeholder="https://yourdomain.com/blog/article"
              sx={{ mr: 2 }}
            />
            <Button 
              variant="contained" 
              color="primary"
              onClick={validateSchema}
              disabled={!url}
            >
              Validate
            </Button>
          </Box>
          
          {schemaValidationResults && (
            <Box sx={{ mt: 3 }}>
              {schemaValidationResults.valid ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Schema validation successful! Your structured data is valid.
                </Alert>
              ) : (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Schema validation failed. Please fix the errors below.
                </Alert>
              )}
              
              {schemaValidationResults.errors.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Validation Issues:
                  </Typography>
                  <List>
                    {schemaValidationResults.errors.map((error, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {error.type === 'error' ? (
                            <ErrorIcon color="error" />
                          ) : (
                            <WarningIcon color="warning" />
                          )}
                        </ListItemIcon>
                        <ListItemText primary={error.message} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </Paper>
        
        <Typography variant="h6" gutterBottom>
          Example Schema Types
        </Typography>
        
        <Grid container spacing={2}>
          {['Article', 'BlogPosting', 'Product', 'FAQPage', 'Event', 'BreadcrumbList'].map((schema) => (
            <Grid item key={schema}>
              <Chip 
                label={schema} 
                color="primary" 
                variant="outlined" 
                clickable
              />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>
          SEO Checklist
        </Typography>
        
        <Typography variant="body2" paragraph color="text.secondary">
          Ensure your website follows SEO best practices with this comprehensive checklist.
          Address any warnings or errors to improve your search engine visibility.
        </Typography>
        
        <List>
          {seoChecklist.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemIcon>
                  {getStatusIcon(item.status)}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title} 
                  secondary={item.description}
                />
                <Chip 
                  label={item.status.toUpperCase()} 
                  color={
                    item.status === 'success' ? 'success' : 
                    item.status === 'warning' ? 'warning' : 'error'
                  }
                  size="small"
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" gutterBottom>
          Link Checker
        </Typography>
        
        <Typography variant="body2" paragraph color="text.secondary">
          Scan your website for broken links, which can negatively impact user experience and SEO.
          Enter your website URL to start a scan.
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <TextField
              label="Enter website URL"
              variant="outlined"
              fullWidth
              placeholder="https://yourdomain.com"
              sx={{ mr: 2 }}
            />
            <Button variant="contained" color="primary">
              Scan Links
            </Button>
          </Box>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            Link checking functionality is currently in development. This feature will be available soon.
          </Alert>
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default SeoToolsPage; 