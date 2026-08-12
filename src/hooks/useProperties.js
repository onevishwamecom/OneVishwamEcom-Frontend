import { dummyProperties } from '../data/dummyProperties';

/**
 * Returns property data synchronously.
 *
 * Previously this used useEffect + useState to "load" the data, which caused
 * a guaranteed 3-render cycle (mount → loading state → data arrives → loaded state)
 * even though dummyProperties is a synchronous in-memory array.
 *
 * By returning the data directly, the component renders with data on the first
 * render with no artificial loading flash.
 */
export function useProperties() {
  return { properties: dummyProperties, loading: false, error: null };
}