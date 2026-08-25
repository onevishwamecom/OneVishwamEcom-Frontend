import { garmentAPI } from '../../../api';
import { createResourceHooks } from '../shared';

const {
  useList: useGarments,
  useById: useGarmentById,
  useSimilar: useSimilarGarments,
} = createResourceHooks({
  singular: 'garment',
  plural: 'garments',
  api: garmentAPI,
});

export { useGarments, useGarmentById, useSimilarGarments };
