import { atom } from 'recoil';

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue, _, isReset) => {
    if (isReset || newValue == null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};

export const authTokenState = atom({
  key: 'authTokenState',
  default: null,
  effects: [localStorageEffect('authToken')],
});

export const currentUserState = atom({
  key: 'currentUserState',
  default: null,
  effects: [localStorageEffect('currentUser')],
});
