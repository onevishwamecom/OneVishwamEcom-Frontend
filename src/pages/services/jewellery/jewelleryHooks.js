import { jewelleryAPI } from '../../../api';
import { createResourceHooks } from '../shared';

const {
  useList: useJewellery,
  useById: useJewelleryById,
  useSimilar: useSimilarJewellery,
} = createResourceHooks({
  singular: 'jewellery',
  plural: 'jewellery',
  api: jewelleryAPI,
});

export { useJewellery, useJewelleryById, useSimilarJewellery };