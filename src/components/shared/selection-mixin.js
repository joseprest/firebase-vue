export default {
  created() {
    const savedSelection = localStorage.getItem('user_selection');
    if (savedSelection) {
      this.selection = JSON.parse(savedSelection);
    } else {
      this.selection = {
        onlineOffline: 'all',
        textSearch: '',
      };
    }
    // this.request();
  },
  data() {
    return {
      selection: null,
    };
  },
  methods: {
    update(what, byWhat) {
      this.selection = {
        ...this.selection,
        [what]: byWhat,
      };
      localStorage.setItem('user_selection', JSON.stringify(this.selection));
      // this.request();
    },
  },
};
