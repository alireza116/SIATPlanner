'use client';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Home() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to SWOT Analysis Tool
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            About This Tool
          </Typography>
          <Typography paragraph>
            This application helps teams and organizations perform SWOT analysis 
            (Strengths, Weaknesses, Opportunities, and Threats) for various business issues and projects.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Key Features:
          </Typography>
          <ul>
            <li>
              <Typography>Create and manage multiple issues for analysis</Typography>
            </li>
            <li>
              <Typography>Collaborative SWOT analysis for each issue</Typography>
            </li>
            <li>
              <Typography>Real-time updates and tracking</Typography>
            </li>
            <li>
              <Typography>Easy-to-use interface for team collaboration</Typography>
            </li>
          </ul>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => router.push('/issues')}
              endIcon={<ArrowForwardIcon />}
            >
              Get Started with Issues
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
