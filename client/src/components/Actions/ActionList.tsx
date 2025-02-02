import { useState, DragEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores/StoreProvider';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Stack,
  Alert,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageModal from '@/components/Common/MessageModal';
import { Action, SwotEntry } from '@/stores/ActionStore';
import { getSwotChipColor, getSwotColor } from '@/theme/swotTheme';
import ActionCard from './ActionCard';
import BaseCard from '@/components/Common/BaseCard';

interface ActionListProps {
  issueId: string;
}

interface SwotChip {
  id: string;
  type: string;
  description: string;
}

const ActionList = observer(({ issueId }: ActionListProps) => {
  const { actionStore, uiStore } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingAction, setEditingAction] = useState<{
    id: string;
    title: string;
    description: string;
    swotEntries: SwotEntry[];
  } | null>(null);
  const [newAction, setNewAction] = useState({ title: '', description: '' });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null);
  const [deleteActionConfirmation, setDeleteActionConfirmation] = useState<Action | null>(null);
  const [deleteAssociationConfirmation, setDeleteAssociationConfirmation] = useState<{
    actionId: string;
    swotEntryId: string;
    description: string;
  } | null>(null);
  const theme = useTheme();

  const validateAction = (action: { title: string, description: string }) => {
    if (!action.title.trim()) {
      setValidationError('Title is required');
      return false;
    }
    if (!action.description.trim()) {
      setValidationError('Description is required');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleAddAction = async () => {
    if (!validateAction(newAction)) return;
    
    try {
      await actionStore.createAction({
        issueId,
        title: newAction.title,
        description: newAction.description,
        status: 'Pending',
        swotEntries: [],
        createdBy: 'User'
      });
      setNewAction({ title: '', description: '' });
      setIsAdding(false);
      setValidationError(null);
    } catch (error) {
      console.error('Failed to add action:', error);
      setValidationError('Failed to create action. Please try again.');
    }
  };

  const handleEditAction = async () => {
    if (!editingAction) return;
    if (!validateAction(editingAction)) return;
    
    try {
      await actionStore.updateAction(editingAction.id, {
        title: editingAction.title,
        description: editingAction.description,
      });
      setEditingAction(null);
      setValidationError(null);
    } catch (error) {
      console.error('Failed to update action:', error);
      setValidationError('Failed to update action. Please try again.');
    }
  };

  const handleDeleteAction = async (id: string) => {
    try {
      await actionStore.deleteAction(id);
    } catch (error) {
      console.error('Failed to delete action:', error);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, actionId: string) => {
    e.preventDefault();
    setIsDraggingOver(actionId);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(null);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, actionId: string) => {
    e.preventDefault();
    setIsDraggingOver(null);
    try {
      const swotData = JSON.parse(e.dataTransfer.getData('application/json'));
      await actionStore.addSwotEntryToAction(actionId, swotData.id);
    } catch (error) {
      console.error('Failed to associate SWOT entry:', error);
    }
  };

  const handleDeleteActionClick = (action: Action) => {
    setDeleteActionConfirmation(action);
  };

  const handleDeleteActionConfirm = async () => {
    if (!deleteActionConfirmation) return;
    try {
      await actionStore.deleteAction(deleteActionConfirmation._id);
      setDeleteActionConfirmation(null);
    } catch (error) {
      console.error('Failed to delete action:', error);
    }
  };

  const handleRemoveSwotEntryClick = (actionId: string, swotEntryId: string, description: string) => {
    setDeleteAssociationConfirmation({
      actionId,
      swotEntryId,
      description
    });
  };

  const handleRemoveSwotEntryConfirm = async () => {
    if (!deleteAssociationConfirmation) return;
    try {
      await actionStore.removeSwotEntryFromAction(
        deleteAssociationConfirmation.actionId,
        deleteAssociationConfirmation.swotEntryId
      );
      setDeleteAssociationConfirmation(null);
    } catch (error) {
      console.error('Failed to remove SWOT entry:', error);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Header section - stays fixed */}
      <Box sx={{ mb: 2, flexShrink: 0, px:4, py:3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Actions</Typography>
          <Button

            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsAdding(true)}
          >
            Add Action
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Create actions to address the SWOT entries. Drag and drop entries onto actions to create connections.
        </Typography>
      </Box>

      {/* Scrollable content section */}
      <Box sx={{ 
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        px: 2,
        '& > *': {
          flexShrink: 0
        }
      }}>
        {isAdding && (
          <Box sx={{ flexShrink: 0 }}>
            <BaseCard>
              <CardContent>
                <TextField
                  fullWidth
                  label="New Action Title"
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="New Action Description"
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                  size="small"
                  sx={{ mb: 2 }}
                />
                {validationError && (
                  <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
                    {validationError}
                  </Alert>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button size="small" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button size="small" variant="contained" onClick={handleAddAction}>Add</Button>
                </Box>
              </CardContent>
            </BaseCard>
          </Box>
        )}

        {actionStore.actions.map((action) => (
          <Box sx={{ flexShrink: 0 }}>
            <ActionCard
              key={action._id}
              action={action}
              isEditing={editingAction?.id === action._id}
              editingAction={editingAction}
              onEditStart={setEditingAction}
              onEditChange={(field, value) => 
                setEditingAction(prev => prev ? { ...prev, [field]: value } : null)
              }
              onEditSave={handleEditAction}
              onEditCancel={() => setEditingAction(null)}
              onDelete={handleDeleteActionClick}
              onRemoveSwotEntry={handleRemoveSwotEntryClick}
              onDragOver={(e) => handleDragOver(e, action._id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, action._id)}
            />
          </Box>
        ))}
      </Box>

      {/* Modals stay at the bottom */}
      <MessageModal
        open={deleteActionConfirmation !== null}
        title="Delete Action"
        message={`Are you sure you want to delete this action?${
          deleteActionConfirmation
            ? `\n\n"${deleteActionConfirmation.title}"\n${
                deleteActionConfirmation.description.slice(0, 100)}${
                deleteActionConfirmation.description.length > 100 ? '...' : ''
              }`
            : ''
        }`}
        confirmLabel="Delete"
        onConfirm={handleDeleteActionConfirm}
        onCancel={() => setDeleteActionConfirmation(null)}
        severity="warning"
      />

      <MessageModal
        open={deleteAssociationConfirmation !== null}
        title="Remove Association"
        message={`Are you sure you want to remove this SWOT entry from the action?${
          deleteAssociationConfirmation
            ? `\n\n"${deleteAssociationConfirmation.description.slice(0, 100)}${
                deleteAssociationConfirmation.description.length > 100 ? '...' : ''
              }"`
            : ''
        }`}
        confirmLabel="Remove"
        onConfirm={handleRemoveSwotEntryConfirm}
        onCancel={() => setDeleteAssociationConfirmation(null)}
        severity="warning"
      />
    </Box>
  );
});

const getChipColor = (type: 'Strength' | 'Weakness' | 'Opportunity' | 'Threat') => {
  return getSwotChipColor(type);
};

export default ActionList; 