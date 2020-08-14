import _ from "lodash";

export function initLoginLocalStorage(response) {}
export function cleanLoginLocalStorage() {
  clear();
}

export function get(key, defaultValue = null) {
  const value = localStorage.getItem(key);
  return value !== null ? JSON.parse(value) : defaultValue;
}

export function set(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
export function clear() {
  return localStorage.clear();
}

export function remove(key) {
  return localStorage.removeItem(key);
}

export function multiGet(...keys) {}

export function multiRemove(...keys) {}
