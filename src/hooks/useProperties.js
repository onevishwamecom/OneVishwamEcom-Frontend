import { dummyProperties } from '../data/dummyProperties';

export function useProperties() {
  return {
    properties: dummyProperties,
    loading: false,
    error: null,
  };
}
