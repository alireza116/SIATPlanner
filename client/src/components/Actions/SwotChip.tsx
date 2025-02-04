import { Chip } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { useTheme } from "@mui/material/styles";
import { getSwotColor } from "@/theme/swotTheme";
import { SwotEntry } from "@/stores/SwotStore";

interface SwotChipProps {
  entry: SwotEntry;
  actionId: string;
  onDelete: (actionId: string, entryId: string, description: string) => void;
  onMouseEnter: (entryId: string) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SwotChip = observer(
  ({
    entry,
    actionId,
    onDelete,
    onMouseEnter,
    onMouseLeave,
  }: SwotChipProps) => {
    const { uiStore } = useStore();
    const theme = useTheme();

    return (
      <Chip
        key={`chip-${actionId}-${entry._id}`}
        label={entry.description}
        size="small"
        sx={{
          maxWidth: "100%",
          height: "auto",
          "& .MuiChip-label": {
            whiteSpace: "normal",
            display: "block",
            padding: "4px 8px",
            textAlign: "left",
            width: "100%",
          },
          backgroundColor: getSwotColor(entry.type, theme).main,
          color: theme.palette.getContrastText(
            getSwotColor(entry.type, theme).main
          ),
          ...(uiStore.isSwotEntryHighlighted(entry._id) && {
            boxShadow: 2,
            transform: "scale(1.05)",
            backgroundColor: getSwotColor(entry.type, theme).dark,
          }),
          transition: "all 0.2s ease",
        }}
        onDelete={() => onDelete(actionId, entry._id, entry.description)}
        onMouseEnter={() => onMouseEnter(entry._id)}
        onMouseLeave={onMouseLeave}
      />
    );
  }
);

export default SwotChip;
