export const store = {
  searchResults: [],
  currentSearchResults: [],
  currentPage: 1,
  pageSize: 10,
  filters: {
    name: '',
    type: '',
    minId: '',
    maxId: ''
  },
  wishlist: [],
  history: [],
  searchMeta: {
    lastTerm: '',
    total: 0
  }
};
