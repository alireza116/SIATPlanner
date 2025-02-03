import { makeAutoObservable } from 'mobx';

class UiStore {
  hoveredActionId: string | null = null;
  hoveredSwotEntryId: string | null = null;
  highlightedSwotEntryIds: Set<string> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  setHoveredActionId(id: string | null, swotEntryIds: string[] = []) {
    this.hoveredActionId = id;
    this.highlightedSwotEntryIds = new Set(swotEntryIds);
  }

  setHoveredSwotEntryId(id: string | null) {
    this.hoveredSwotEntryId = id;
    this.highlightedSwotEntryIds = new Set(id ? [id] : []);
  }

  clearHoveredIds() {
    this.hoveredActionId = null;
    this.hoveredSwotEntryId = null;
    this.highlightedSwotEntryIds = new Set();
  }

  isSwotEntryHighlighted(id: string): boolean {
    return this.highlightedSwotEntryIds.has(id);
  }
}

export default UiStore; 