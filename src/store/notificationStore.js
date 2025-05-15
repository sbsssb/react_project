import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  totalUnreadCount: 0,
  unreadByRoom: {}, // { roomId: count }

  // 초기화
  resetUnreadCount: (roomId) => set(state => {
    const updated = { ...state.unreadByRoom };
    delete updated[roomId];
    const newTotal = Object.values(updated).reduce((a, b) => a + b, 0);
    return { unreadByRoom: updated, totalUnreadCount: newTotal };
  }),

  // 특정 방 초기화
  resetUnreadCountByRoom: (roomId) =>
    set((state) => {
      const newUnread = { ...state.unreadByRoom, [roomId]: 0 };
      const newTotal = Object.values(newUnread).reduce((a, b) => a + b, 0);
      return { unreadByRoom: newUnread, totalUnreadCount: newTotal };
    }),

  // 설정 (서버에서 가져온 초기값)
  setUnreadByRoom: (map) => {
    console.log('setUnreadByRoom 호출:', map);
    const total = Object.values(map).reduce((a, b) => a + b, 0);
    set({ unreadByRoom: map, totalUnreadCount: total });
  },

  // 새로운 메시지 도착 시 증가
  increaseUnreadByRoom: (roomId) =>
    set((state) => {
      const prevCount = state.unreadByRoom[roomId] || 0;
      const newUnread = { ...state.unreadByRoom, [roomId]: prevCount + 1 };
      const newTotal = state.totalUnreadCount + 1;
      return { unreadByRoom: newUnread, totalUnreadCount: newTotal };
    }),

    fetchUnreadCounts: async (userId) => {
    try {
      const res = await fetch(`http://localhost:3005/chat/unread?user=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch unread counts');
      const data = await res.json();
      console.log('fetchUnreadCounts 받은 데이터:', data);
      if (data.success) {
        const total = Object.values(data.unreadByRoom).reduce((a, b) => a + b, 0);
        set({ unreadByRoom: data.unreadByRoom, totalUnreadCount: total });
      }
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useNotificationStore;