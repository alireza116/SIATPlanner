'use client';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores/StoreProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Issue } from '@/stores/IssueStore';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Fab,
  CircularProgress,
  Alert,
  Container,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const IssueList = observer(() => {
  const { issueStore } = useStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: '', description: '', createdBy: 'User' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  useEffect(() => {
    issueStore.fetchIssues();
  }, [issueStore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await issueStore.createIssue({
        ...newIssue,
        status: 'Open'
      });
      setNewIssue({ title: '', description: '', createdBy: 'User' });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await issueStore.deleteIssue(id);
      } catch (error) {
        console.error('Failed to delete issue:', error);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;
    
    try {
      await issueStore.updateIssue(editingIssue._id, editingIssue);
      setIsEditModalOpen(false);
      setEditingIssue(null);
    } catch (error) {
      console.error('Failed to update issue:', error);
    }
  };

  if (issueStore.loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  if (issueStore.error) return <Alert severity="error">Error: {issueStore.error}</Alert>;

  return (
    <Container>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">Issues</Typography>
          <Fab color="primary" size="medium" onClick={() => setIsModalOpen(true)}>
            <AddIcon />
          </Fab>
        </Box>

        {/* Flex container for Issue Cards */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          {issueStore.issues.map((issue) => (
            <Card
              key={issue._id}
              sx={{
                width: 280,
                position: 'relative',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`/issues/${issue._id}/swot`)}
              >
                <Typography variant="h6" noWrap>{issue.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    height: '3em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {issue.description}
                </Typography>
                <Box sx={{ 
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {issue.status}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {issue.createdBy}
                  </Typography>
                </Box>
              </CardContent>
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 1,
                  '& > button': { padding: 0.5 },
                  '.MuiCard-root:hover &': {
                    opacity: 1
                  }
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(issue);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(issue._id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Create Issue Dialog */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Create New Issue</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                  label="Title"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Description"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Create</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Edit Issue Dialog */}
        <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="sm" fullWidth>
          <form onSubmit={handleEditSubmit}>
            <DialogTitle>Edit Issue</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                  label="Title"
                  value={editingIssue?.title || ''}
                  onChange={(e) => setEditingIssue(prev => prev ? {...prev, title: e.target.value} : null)}
                  fullWidth
                  required
                />
                <TextField
                  label="Description"
                  value={editingIssue?.description || ''}
                  onChange={(e) => setEditingIssue(prev => prev ? {...prev, description: e.target.value} : null)}
                  multiline
                  rows={4}
                  fullWidth
                  required
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
});

export default IssueList; 