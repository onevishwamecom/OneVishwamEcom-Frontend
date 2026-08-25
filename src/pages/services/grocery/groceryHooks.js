import { groceryAPI } from '../../../api';
import { createResourceHooks } from '../shared';

const {
  useList: useGroceries,
  useById: useGroceryById,
  useSimilar: useSimilarGroceries,
} = createResourceHooks({
  singular: 'grocery',
  plural: 'groceries',
  api: groceryAPI,
});

export { useGroceries, useGroceryById, useSimilarGroceries };
