function persist(key = "orgs-store") {
    return (set, get, api) => config => (name, state, _set) => {
      const storedState = typeof window !== 'undefined' && localStorage.getItem(key);
      if (storedState) {
        config = { ...config, ...JSON.parse(storedState) };
      }
      
      api.setState = _set;
  
      set(
        (state, action) => {
          config(name, state, api);
          localStorage.setItem(key, JSON.stringify(api.getState()));
        },
        true
      );
    };
  }
  