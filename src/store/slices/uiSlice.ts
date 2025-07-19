import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isMenuOpen: boolean;
  isSettingsOpen: boolean;
  isChatOpen: boolean;
  isFullscreen: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: 'mobile' | 'tablet' | 'desktop';
  theme: 'light' | 'dark' | 'auto';
  animations: {
    enabled: boolean;
    quality: 'low' | 'medium' | 'high';
    reduceMotion: boolean;
  };
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
    timestamp: number;
  }>;
  loading: {
    global: boolean;
    scenes: Record<string, boolean>;
    assets: Record<string, boolean>;
  };
  modals: {
    active: string | null;
    stack: string[];
  };
  gestures: {
    enabled: boolean;
    sensitivity: number;
  };
}

const initialState: UIState = {
  isMenuOpen: false,
  isSettingsOpen: false,
  isChatOpen: false,
  isFullscreen: false,
  orientation: 'portrait',
  screenSize: 'mobile',
  theme: 'auto',
  animations: {
    enabled: true,
    quality: 'high',
    reduceMotion: false,
  },
  notifications: [],
  loading: {
    global: false,
    scenes: {},
    assets: {},
  },
  modals: {
    active: null,
    stack: [],
  },
  gestures: {
    enabled: true,
    sensitivity: 0.5,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuOpen = action.payload;
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen;
    },
    setChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatOpen = action.payload;
    },
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
    setOrientation: (state, action: PayloadAction<'portrait' | 'landscape'>) => {
      state.orientation = action.payload;
    },
    setScreenSize: (state, action: PayloadAction<'mobile' | 'tablet' | 'desktop'>) => {
      state.screenSize = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    updateAnimations: (state, action: PayloadAction<Partial<UIState['animations']>>) => {
      state.animations = { ...state.animations, ...action.payload };
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: `notification_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setSceneLoading: (state, action: PayloadAction<{ sceneId: string; loading: boolean }>) => {
      const { sceneId, loading } = action.payload;
      state.loading.scenes[sceneId] = loading;
    },
    setAssetLoading: (state, action: PayloadAction<{ assetId: string; loading: boolean }>) => {
      const { assetId, loading } = action.payload;
      state.loading.assets[assetId] = loading;
    },
    openModal: (state, action: PayloadAction<string>) => {
      const modalId = action.payload;
      if (state.modals.active) {
        state.modals.stack.push(state.modals.active);
      }
      state.modals.active = modalId;
    },
    closeModal: (state) => {
      if (state.modals.stack.length > 0) {
        state.modals.active = state.modals.stack.pop() || null;
      } else {
        state.modals.active = null;
      }
    },
    closeAllModals: (state) => {
      state.modals.active = null;
      state.modals.stack = [];
    },
    updateGestures: (state, action: PayloadAction<Partial<UIState['gestures']>>) => {
      state.gestures = { ...state.gestures, ...action.payload };
    },
  },
});

export const {
  toggleMenu,
  setMenuOpen,
  toggleSettings,
  setSettingsOpen,
  toggleChat,
  setChatOpen,
  setFullscreen,
  setOrientation,
  setScreenSize,
  setTheme,
  updateAnimations,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setSceneLoading,
  setAssetLoading,
  openModal,
  closeModal,
  closeAllModals,
  updateGestures,
} = uiSlice.actions;

export default uiSlice.reducer;