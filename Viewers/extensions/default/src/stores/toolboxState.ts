// Simple global state for toolbox settings
// Default to true for live mode
let liveMode = true;
let posNeg = false;
let refineNew = false;
let textPromptReplaceNew = false; // Replace/New toggle for Text Prompt Segmentation
let selectedModel: 'nnInteractive' | 'sam2' | 'medsam2' | 'sam3' = 'nnInteractive'; // Model selection: nnInteractive, SAM2, MedSAM2, or SAM3
let locked = false;
let currentActiveSegment = 1;
let medgemmaResult: string | null = null;
let medgemmaInstruction: string = '';
let medgemmaQuery: string = '';
let medgemmaStartSlice: number | null = null;
let medgemmaEndSlice: number | null = null;
let accumulatedInferenceTime: number = 0; // Accumulated inference time in milliseconds
let currentInferenceStart: number | null = null; // Start time of current inference
let isTrackingInference: boolean = false; // Flag to indicate if inference tracking is active

export const toolboxState = {
  getLiveMode: () => liveMode,
  setLiveMode: (enabled: boolean) => {
    liveMode = enabled;
  },
  getPosNeg: () => posNeg,
  setPosNeg: (enabled: boolean) => {
    posNeg = enabled;
  },
  getRefineNew: () => refineNew,
  setRefineNew: (enabled: boolean) => {
    refineNew = enabled;
    if (enabled) {
        // Note: resetNninter should be called from the component/command that uses this state
         // When RefineNew is enabled and model is nnInteractive, reset nninter
         if (selectedModel === 'nnInteractive') {
          commandsManager?.run('resetNninter');
        }
        toolboxState.setPosNeg(false);
    }
  },
  getTextPromptReplaceNew: () => textPromptReplaceNew,
  setTextPromptReplaceNew: (enabled: boolean) => {
    textPromptReplaceNew = enabled;
  },
  // Model selection methods
  getSelectedModel: () => selectedModel,
  setSelectedModel: (model: 'nnInteractive' | 'sam2' | 'medsam2' | 'sam3') => {
    selectedModel = model;
  },
  // Legacy methods for backward compatibility (deprecated)
  getNnInterSam2: () => selectedModel === 'sam2',
  setNnInterSam2: (enabled: boolean) => {
    selectedModel = enabled ? 'sam2' : 'nnInteractive';
  },
  getMedSam2: () => selectedModel === 'medsam2',
  setMedSam2: (enabled: boolean) => {
    selectedModel = enabled ? 'medsam2' : 'nnInteractive';
  },
  getLocked: () => locked,
  setLocked: (isLocked: boolean) => {
    locked = isLocked;
  },
  getCurrentActiveSegment: () => currentActiveSegment,
  setCurrentActiveSegment: (segment: number) => {
    currentActiveSegment = segment;
  },
  getMedgemmaResult: () => medgemmaResult,
  setMedgemmaResult: (result: string | null) => {
    medgemmaResult = result;
  },
  getMedgemmaInstruction: () => medgemmaInstruction,
  setMedgemmaInstruction: (instruction: string) => {
    medgemmaInstruction = instruction;
  },
  getMedgemmaQuery: () => medgemmaQuery,
  setMedgemmaQuery: (query: string) => {
    medgemmaQuery = query;
  },
  getMedgemmaStartSlice: () => medgemmaStartSlice,
  setMedgemmaStartSlice: (startSlice: number | null) => {
    medgemmaStartSlice = startSlice;
  },
  getMedgemmaEndSlice: () => medgemmaEndSlice,
  setMedgemmaEndSlice: (endSlice: number | null) => {
    medgemmaEndSlice = endSlice;
  },
  getAccumulatedInferenceTime: () => accumulatedInferenceTime,
  setAccumulatedInferenceTime: (time: number) => {
    accumulatedInferenceTime = time;
  },
  resetInferenceTime: () => {
    accumulatedInferenceTime = 0;
    currentInferenceStart = null;
  },
  setIsTrackingInference: (tracking: boolean) => {
    isTrackingInference = tracking;
  },
  getIsTrackingInference: () => isTrackingInference,
  startInferenceTracking: () => {
    if (isTrackingInference && currentInferenceStart === null) {
      currentInferenceStart = Date.now();
    }
  },
  endInferenceTracking: () => {
    if (currentInferenceStart !== null && isTrackingInference) {
      const inferenceDuration = Date.now() - currentInferenceStart;
      accumulatedInferenceTime += inferenceDuration;
      currentInferenceStart = null;
      return inferenceDuration;
    }
    currentInferenceStart = null;
    return 0;
  },
}; 