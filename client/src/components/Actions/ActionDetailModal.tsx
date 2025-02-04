import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Action } from "@/stores/ActionStore";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import RichTextEditor from "../Common/RichTextEditor";
import { useEffect, useState } from "react";

interface ActionDetailModalProps {
  action: Action;
  open: boolean;
  onClose: () => void;
}

const ActionDetailModal = observer(
  ({ action, open, onClose }: ActionDetailModalProps) => {
    const { actionStore } = useStore();
    const [content, setContent] = useState(action.detail || "");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (open) {
        const fetchDetails = async () => {
          try {
            setIsLoading(true);
            console.log("Fetching details for action:", action._id);
            await actionStore.fetchActionDetail(action._id);
            console.log("Fetched action detail:", action.detail);
            setContent(action.detail || "");
            setHasUnsavedChanges(false);
          } catch (error) {
            console.error("Failed to fetch action details:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchDetails();
      }
    }, [open, action._id, actionStore]);

    // Update local state when store data changes
    useEffect(() => {
      console.log("Action detail changed in store:", action.detail);
      setContent(action.detail || "");
      setHasUnsavedChanges(false);
    }, [action.detail]);

    const handleClose = () => {
      if (hasUnsavedChanges) {
        if (
          window.confirm(
            "You have unsaved changes. Are you sure you want to close?"
          )
        ) {
          onClose();
        }
      } else {
        onClose();
      }
    };

    const handleSave = async () => {
      try {
        setIsSaving(true);
        console.log("Saving detail:", content);
        if (content !== action.detail) {
          await actionStore.updateActionDetail(action._id, content);
        }
        console.log("Save successful");
        setHasUnsavedChanges(false);
        onClose();
      } catch (error) {
        console.error("Failed to save details:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const handleChange = (newContent: string) => {
      console.log("Content changed:", newContent);
      setContent(newContent);
      setHasUnsavedChanges(true);
    };

    console.log("Rendering modal with detail:", content);

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{action.title}</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography>{action.description}</Typography>
          </Box>
          <Box sx={{ height: "400px" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Details
            </Typography>
            <RichTextEditor
              key={`${action._id}-${open}`}
              value={content}
              onChange={handleChange}
              id={action._id}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="caption"
            color={hasUnsavedChanges ? "warning.main" : "text.secondary"}
          >
            {hasUnsavedChanges
              ? "You have unsaved changes"
              : "All changes saved"}
          </Typography>
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              Close
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              variant="contained"
              disabled={!hasUnsavedChanges || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ActionDetailModal;
