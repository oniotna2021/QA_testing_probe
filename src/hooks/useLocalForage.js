import localforage from "localforage";

export const useLocalForage = () => {
  const setItemInLocalForage = async (key, value) => {
    try {
      await localforage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.log(err);
    }
  };

  const getItemInLocalForage = async (key) => {
    try {
      const value = await localforage.getItem(key);
      return JSON.parse(value);
    } catch (err) {
      console.log(err);
    }
  };

  return [setItemInLocalForage, getItemInLocalForage];
};
