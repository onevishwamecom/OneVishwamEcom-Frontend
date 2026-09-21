/**
 * @typedef {Object} KeyAttribute
 * @property {string} label
 * @property {string} value
 * @property {string} [icon]
 */

/**
 * @typedef {Object} SpecificationItem
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef {Object} SpecificationGroup
 * @property {string} groupName
 * @property {SpecificationItem[]} items
 */

/**
 * @typedef {Object} SellerInfo
 * @property {string} name
 * @property {string} type
 * @property {string} phone
 * @property {string} [whatsapp]
 * @property {boolean} verified
 * @property {string} [avatar]
 * @property {string} [address]
 */

/**
 * @typedef {Object} EntityBadge
 * @property {string} label
 * @property {string} [className]
 */

/**
 * @typedef {Object} EntityItem
 * @property {string|number} id
 * @property {string} title
 * @property {string} price
 * @property {string} [priceSubtext]
 * @property {string} location
 * @property {string} [pincode]
 * @property {string[]} images
 * @property {Array<string|EntityBadge>} badges
 * @property {KeyAttribute[]} keyAttributes
 * @property {string} description
 * @property {SpecificationGroup[]} specs
 * @property {SellerInfo} seller
 * @property {*} [raw]
 */

export {};
