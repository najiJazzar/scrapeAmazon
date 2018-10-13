"use strict";
const DomParser = jQuery;

const Currency = {
  /**
     * United states dollar definition
     * @constant
     */
  USD: "USD",
  /**
     * British pound definition
     * @constant
     */
  GBP: "GBP"
}

const Num = {
  /**
     * Checks if number is a float
     * @param {number} n - the number that should be checked against
     * @return {boolean} - whether the number is float or not
     * @readonly
     */
  isFloat: (n) => {
    return Number(n) === n && n % 1 !== 0;
  },
  /**
     * Checks if number is a integer
     * @param {number} n - the number that should be checked against
     * @return {boolean} - whether the number is integer or not
     * @readonly
     */
  isInt: (n) => {
    return Number(n) === n && n % 1 === 0;
  },
  /**
     * Convert pounds to kilograms
     * @param {number} pounds - amount of pounds you want to convert
     * @return {number} - kilograms
     * @readonly
     */
  convertPoundKg: (pounds) => {
    const floatVal = parseFloat(pounds);
    const singlePound = 0.45359237; //kg
    const result = floatVal * singlePound;
    return result.toFixed(2);
  },
  /**
     * Convert inches to centimeters
     * @param {number} pounds - amount of inches you want to convert
     * @return {number} - centimeters
     * @readonly
     */
  convertInchCm: (inches) => {
    const floatVal = parseFloat(inches);
    const singleInch = 2.54; //cm
    const result = floatVal * singleInch;
    return result.toFixed(2);
  }
};

const Str = {
  /**
     * Empty string definition to avoid macros
     * @member
     * @constant
     */
  EMPTY: '',
  /**
     * Get substring between start and end in haystack
     * @param {string} haystack - the haystack we want to get from
     * @param {string} start - the start text
     * @param {string} end - the end text
     * @return {string} - returns the sub string
     */
  between: (haystack, start, end) => {
    // make sure text includes start and end phrases
    if (haystack.includes(start) && haystack.includes(end)) {
      // taking the strig after start to extract end
      const splittedTxt = haystack.split(start)[1];
      const qty = splittedTxt.substring(0, splittedTxt.indexOf(end));
      return qty;
    }
  }
};

/** Class representing a Product. */
class ProductItem {

  /**
   * @constructor
   * @param {Proxy~Rotator} proxyRotator - instance of proxy rotator
   * @return {void}.
   */
  constructor(proxyRotator) {
    this._rotator = proxyRotator;
    this._item = {
      title: Str.EMPTY,
      sourceLink: Str.EMPTY,
      sourcePrice: 0,
      isItemInStock: true,
      brand: Str.EMPTY,
      description: Str.EMPTY,
      images: [],
      isFreeShipping: false,
      sourceId: Str.EMPTY,
      isPrimeEligable: true,
      currency: Currency.USD,
      sourceQuantity: 0,
      packageDimensions: {},
      itemDimensions: {},
      features: [],
      listingSpecifications: [],
      outdateMinutes: 0,
      cityByCountry: Str.EMPTY,
      variations: [],
      additionalData: {},
      categories: ""
    }

  }

  /**
   * wait for certain miliseconds to pass before continue the section, should be used with async/await
   * @param {Number} ms - milliseconds to wait
   */
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Product categories.
   * @member
   * @type {string}
   */
  get categories() {
    return this._item.categories;
  }

  set categories(value) {
    this._item.categories = value;
  }

  /**
  * Get currency according to country
  * @param country - Country for which you want to get currency
  * @return string
  */
  getCurrency(country) {
    if (!country) {
      country = this._dbItem.region;
    }
    switch (country) {
      case 'US':
        return 'USD';
      case 'UK':
        return 'GBP';
      case 'DE':
      case 'FR':
      case 'IT':
      case 'ES':
        return 'EUR';
      case 'CA':
        return 'CAD';
      default:
        return 'USD';
    }
  }

  /**
     * Return country based on item region
     */
  getCountryByRegion() {
    const region = this._dbItem.region;
    switch (region) {
      case 'US':
        return 'United+States';
      case 'UK':
        return 'United+Kingdom';
      case 'ES':
        return 'Spain';
      case 'IT':
        return 'Italy';
      case 'FR':
        return 'France';
      case 'DE':
        return 'Germany';
    };
  }

  /**
   * Product title, will throw InvalidArgumentException when trying to set if supplied value is not string or number.
   * @member
   * @type {string}
   */
  set title(title) {
    this._item.title = title;
  }

  get title() {
    return this._item.title.toString();
  }

  /**
   * Product link, will throw InvalidArgumentException if supplied value is not valid url.
   * @member
   * @type {string|url}
   */
  set sourceLink(link) {
    this._item.sourceLink = link;
  }

  get sourceLink() {
    return this._item.sourceLink;
  }

  /**
   * Product price.
   * @member
   * @type {number}
   */
  set price(price) {
    if (!price) {
      price = 0.0;
    }
    const floatPrice = !Num.isFloat(price)
      ? parseFloat(price)
      : price;
    this._item.sourcePrice = !isNaN(floatPrice)
      ? floatPrice
      : 0.0;
  }

  get price() {
    return this._item.sourcePrice;
  }

  /**
   * Product availability.
   * @member
   * @type {boolean}
   */
  set inStock(availability) {
    this._item.isItemInStock = availability;
  }

  get inStock() {
    return this._item.isItemInStock;
  }

  /**
   * Product brand
   * @member
   * @type {string}
  */
  set brand(value) {
    this._item.brand = value;
  }

  get brand() {
    return this._item.brand;
  }

  /**
   * Product description
   * @member
   * @type {string|html}
   */
  set description(text) {
    this._item.description = text;
  }

  get description() {
    return this._item.description;
  }

  /**
   * Product images, by default empty array, if you try to set anything other than array it will result in empty array
   * @member
   * @type {array<URL>}
   */
  set images(imageLinks) {
    if (!Array.isArray(imageLinks))
      imageLinks = [].push(imageLinks);
    this._item.images = imageLinks;
  }

  get images() {
    return this._item.images;
  }

  /**
   * Is product free shipping eligable, if supplied value is not boolean the property will be set to false
   * @member
   * @type {boolean}
   */
  set freeShipping(value) {
    this._item.isFreeShipping = typeof(value) === "boolean"
      ? value
      : false;
  }

  get freeShipping() {
    return this._item.isFreeShipping;
  }

  /**
   * Product supplier
   * @member
   * @type {string}
   */
  set sourceId(value) {
    this._item.sourceId = value;
  }

  get sourceId() {
    return this._item.sourceId;
  }

  /**
   * Indicates if product has 2 day delivery, will result in false if non boolean value is given
   * @member
   * @type {boolean}
   */
  set prime(value) {
    this._item.isPrimeEligable = typeof(value) === "boolean"
      ? value
      : false;
  }

  get prime() {
    return this._item.isPrimeEligable;
  }

  /**
   * Product currency
   * @member
   * @type {Currency|string}
   */
  set currency(value) {
    this._item.currency = value;
  }

  get currency() {
    return this._item.currency;
  }

  /**
   * Product available quantity, if float is passed will be transformed to the closest integer value
   * @member
   * @type {integer}
   */
  set quantity(value) {
    this._item.sourceQuantity = parseInt(value);
  }

  get quantity() {
    return this._item.sourceQuantity;
  }

  /**
   * Product packaging dimensions
   * @member
   * @type {string}
   */
  set packaging(value) {
    this._item.packageDimensions = value;
  }

  get packaging() {
    return this._item.packageDimensions;
  }

  /**
   * Product item dimensions
   * @member
   * @type {string}
   */
  set dimensions(value) {
    this._item.itemDimensions = value;
  }

  get dimensions() {
    return this._item.itemDimensions;
  }

  /**
   * Product features list
   * @member
   * @type {Object<key, value>}
   * @readonly
   */
  set features(value) {
    this._item.features = value;
  }

  get features() {
    return this._item.features;
  }

  /**
   * Add product feature
   * @param {string} key - feature key
   * @param {mixed} value - feature value
   * @return {void}
   */
  addFeature(key, value) {
    const feature = {
      key: key,
      value: value
    };
    this._item.features.push(feature);
  }

  /**
   * Remove product feature
   * @param {string} key - feature key
   * @return {void}
   */
  rmFeature(key) {
    const filtered = this._item.features.filter((v, k) => {
      return v.key == key;
    });
    if (filtered.length > 0) {
      const first = filtered[0];
      const index = this._item.features.indexOf(first);
      this._item.features.splice(index, 1);
    }
  }

  /**
   * Product specifications list
   * @member
   * @type {Object<key, value>}
   * @readonly
   */
  set specifications(value) {}

  get specifications() {
    return this._item.listingSpecifications;
  }

  /**
   * Add product specification
   * @param {string} key - specification key
   * @param {mixed} value - specification value
   * @return {void}
   */
  addSpecification(key, value) {
    const spec = {
      key: key,
      value: value
    };
    this._item.listingSpecifications.push(spec);
  }

  /**
   * Remove product specification
   * @param {string} key - specification key
   * @return {void}
   */
  rmSpecification(key) {
    const filtered = this._item.listingSpecifications.filter((v, k) => {
      return v.key == key;
    });
    if (filtered.length > 0) {
      const first = filtered[0];
      const index = this._item.listingSpecifications.indexOf(first);
      this._item.listingSpecifications.splice(index, 1);
    }
  }

  /**
   * Product variations list
   * @member
   * @type {Object<key, value>}
   * @readonly
   */
  set variations(value) {}

  get variations() {
    return this._item.variations;
  }

  /**
   * Add product variation
   * @param {mixed} value - variation value
   * @return {void}
   */
  addVariation(value) {
    this._item.variations.push(value);
  }

  /**
   * Product additional information
   * @member
   * @type {Object<key, value>}
   * @readonly
   */
  set additionalData(value) {}

  get additionalData() {
    return this._item.additionalData;
  }

  /**
   * Add product additional information
   * @param {string} key - data key
   * @param {mixed} value - data value
   * @return {void}
   */
  addData(key, value) {
    this._item.additionalData[key] = value;
  }

  /**
   * Remove product additional information
   * @param {string} key - data key
   * @return {void}
   */
  rmData(key) {
    delete this._item.additionalData[key];
  }

  /**
   * Product expiration time in minutes
   * @member
   * @type {integer}
   */
  set expiration(time) {
    if (!Num.isInt(time))
      time = 0;
    this._item.outdateMinutes = time;
  }

  get expiration() {
    return this._item.outdateMinutes;
  }

  /**
   * Product city by country
   * @member
   * @type {string}
   */
  set city(city) {
    this._item.cityByCountry = city;
  }

  get city() {
    return this._item.cityByCountry;
  }

  /**
   * Checks for mpn, ean, isbn, brand whether the fields are available or not in specifications
   * if not adds them with value Does not apply4
   * @return {void}
   */
  checkDoesNotApplyField() {
    const self = this;
    const checkSpec = (spec) => {
      return self.specifications.filter((spc) => spc.key == spec).length > 0;
    }
    if (!checkSpec('mpn')) {
      this.addSpecification('mpn', 'Does not apply');
    }
    if (!checkSpec('ean')) {
      this.addSpecification('ean', 'Does not apply');
    }
    if (!checkSpec('isbn')) {
      this.addSpecification('isbn', 'Does not apply');
    }
    if (!checkSpec('brand') && !checkSpec('Brand') && this.brand === Str.EMPTY) {
      this.brand = 'Does not apply';
      this.addSpecification('brand', 'Does not apply');
    }
  }

  /**
   * If price is 0 or undefined sets oos to true and quantity to 0
   * @return {void}
   */
  validatePrice() {
    if (!this.price || this.price == 0) {
      this.inStock = false;
      this.quantity = 0;
    }
  }

  /**
   * Remove all whitespaces from description except singluar one's
   * @return {void}
   */
  cleanDescription() {
    if (this.description) {
      this.description = this.description.replace(/\s{2,}/g, ' ');
    }
  }

  /**
   * Converts specifications to associative array
   * @return {void}
   */
  specsToAssocArray() {
    const result = {};
    this._item.listingSpecifications.forEach(({key, value}) => result[key] = value);
    this._item.listingSpecifications = result;
  }

  /**
   * Converts features to associative array
   * @return {void}
   */
  featuresToAssocArray() {
    const result = {};
    this._item.features.forEach(({key, value}) => result[key] = value);
    this._item.features = result;
  }

  /**
  * Returns item json
  * @return {Promise<product>}
  */
  parse() {
    return new Promise((resolve, reject) => {
      try {
        this.checkDoesNotApplyField();
        this.validatePrice();
        this.cleanDescription();
        this.specsToAssocArray();
        this.featuresToAssocArray();
        resolve(this._item);
      } catch (e) {
        reject(e);
      }
    });
  }
}

class AmazonDomParser extends ProductItem {
  /**
   * @constructor
   * @param {Object} item
   * @param {Proxy~Rotator} proxyRotator
   */
  constructor(item, proxyRotator) {
    super(proxyRotator);
    this._dbItem = item;
    this._html = "";
    // this._dbItem.region = this._dbItem.region.toUpperCase();
    this.supplier = this._dbItem.source_id ? this._dbItem.source_id : '';
    this.isMock = false;
    this.mockHtml = null;
  }

  /**
   * Return current domain based on region
   * @return {String} - amazon domain
   */
  getDomain() {
    const region = this._dbItem.region;
    let tld = 'com';
    switch (region) {
      case "UK":
        tld = 'co.uk';
        break;
      case "DE":
        tld = 'de';
        break;
      case "CA":
        tld = 'ca';
        break;
      case "FR":
        tld = 'fr';
        break;
      case "IT":
        tld = 'it';
        break;
      case "ES":
        tld = 'es'
        break;
    }
    const domain = `https://www.amazon.${tld}`;
    return domain;
  }

  /**
   * Scrape amazon product title from dom
   * @return {String} - product title
   */
  scrapeTitle() {
    const selector = '#productTitle';
    const title = DomParser(selector).text().trim();
    return title;
  }

  /**
   * Scrappes amazon categories and glue them as string
   * @return {String} - product categories (example: Home > Garden > Tools)
   */
  scrapeCategories() {
    const selector = '#wayfinding-breadcrumbs_feature_div';
    const list = DomParser(selector).find('li');
    const result = [];
    const exclude = ['›'];
    list.each((i, v) => {
      const li = DomParser(v);
      const cat = li.text().trim();
      if (exclude.indexOf(cat) == -1)
        result.push(cat);
      }
    );
    return result.join(' > ');
  }

  /**
   * Scrapes product price, product shipping, product currency
   * @return {Object<{price: Number, shipping: Number, currency: String}>}
   */
  scrapePricing() {
    const selector = '#cerberus-data-metrics';
    const element = DomParser(selector);
    if (element.length > 0 && element.data('asin-price') != "") {
      const price = element.data('asin-price');
      const shipping = element.data('asin-shipping');
      const currency = element.data('asin-currency-code');
      return {price: price, shipping: shipping, currency: currency};
    } else {
      return this.scrapePricingBolt();
    }
  }
  /**
   * Scrapes product id,
   * @return  {string} sourceId
   */
  scrapeSourceId() {
    const selector = '#copy-asin';
    const element = DomParser(selector);
    if (element) {
      let asin = element.attr('data-asin');
      return asin;
    }
    return '';
  }

  /**
   * Scrapes price currency and shipping from bolt template
   * @return {Object<{price: Number, shipping: Number, currency: String}>}
   */

  scrapePricingBolt() {
    const priceSelector = '#priceblock_ourprice';
    let element = DomParser(priceSelector);
    if (element.length === 0) {
      element = DomParser('.offer-price');
    }
    const price = element.text().indexOf(' - ') === -1
      ? parseFloat(element.text().replace('$', '').replace('£', '').replace('EUR', ''))
      : parseFloat(element.text().split(' - ')[1].replace('$', '').replace('£', '').replace('EUR', ''));
    const shipping = price < 25
      ? 0
      : 5.99;
    const currency = this.getCurrency();
    return {price: price, shipping: shipping, currency: currency};
  }

  /**
   * Scrapes product brand from dom
   * @return {string} - product brand
   */
  scrapeBrand() {
    // get brand
    let item = DomParser('a[id=brand]');
    if (item.length > 0) {
      return item.text().trim();
    }
    // get line brand
    item = DomParser('a[id=bylineInfo]');
    if (item.length > 0) {
      return item.text().trim();
    }
    // get contributor (if no brand)
    item = DomParser('a[class=contributorNameID]');
    if (item.length > 0) {
      return item.text().trim();
    }
    return Str.EMPTY;
  }

  /**
   * Scrape if item is in stock
   * @return {Boolean}
   */
  isInStock() {
    var item = DomParser('#availability');
    if (item.length > 0) {
      var instockText = item.text().trim();
      // if in stock in future date - item is OOS
      if (instockText.indexOf(' on ') >= 0) {
        return false;
      }
      // check if item is in stock
      var instock = (instockText.indexOf('In Stock') >= 0 || instockText.indexOf('order soon') >= 0 || instockText.indexOf('In stock') >= 0 || instockText.indexOf('En stock') !== -1 || instockText.indexOf('Auf Lager') !== -1 || instockText.indexOf('Disponibilità immediata') !== -1);
      return instock;
    } else {
      const dom = DomParser('#add-to-cart-button');
      if (dom.length > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get if product is add-on item
   * @return boolean
   */
  isAddon() {
    const hasAddonIcon = DomParser('#addon-stripe').length > 0;
    if (hasAddonIcon > 0)
      return true;
    return false;
  }

  /**
   * Checks if item is preorder
   * return {Boolean}
   */

  isPreOrder() {
    const selector = '#add-to-cart-button';
    const addToCartButton = DomParser(selector);
    const value = addToCartButton.val();
    if (value && value.indexOf('Pre-order') !== -1) {
      return true;
    }
    return false;
  }

  /**
   * Check if product have prime shipping
   * @return {Boolean}
   */
  isPrime() {
    var item = DomParser('#merchant-info');
    if (item) {
      var soldByText = item.text().trim();
      var isPrime = (soldByText.indexOf('Amazon') >= 0);
      return (
        isPrime && !this.isAddon()
        ? '1'
        : '0');
    }
    return false;
  }

  /**
   * Scrape product images from DOM
   * @return {Array<String|URL>}
   */
  scrapeImages() {
    const result = [];
    const selector = '#altImages';
    const nodes = DomParser(selector).find('span');
    nodes.each((i, v) => {
      const span = DomParser(v);
      if (!span.hasClass('a-button-text'))
        return;
      const imgs = span.find('img');
      if (imgs.length > 0) {
        const img = DomParser(imgs[0]);
        const linkDirty = img.attr('src');
        if (linkDirty.indexOf('play-button') !== -1)
          return;
        const linkParts = linkDirty.split('._');
        const link = linkParts[0];
        const extDirty = linkParts[1];
        const extParts = extDirty.split('.');
        const fullUrl = link.concat('.' + extParts[1]);
        if (result.indexOf(fullUrl) === -1)
          result.push(fullUrl);
        }
      });
    const imagesFilered = result.filter((img) => img.indexOf('pixel') === -1);
    return imagesFilered;
  }

  /**
   * Scrape product specifications from feature div
   * @return {void}
   */
  _scrapeFeatureSpecs() {
    const selector = "#detail-bullets_feature_div";
    let dom = DomParser(selector);
    if (dom.length === 0) {
      dom = DomParser('#detail-bullets');
      const length = dom.length;
      if (length === 0)
        return; //Exit if no features found
      }
    const list = dom.find('li');
    list.each((i, v) => {
      const li = DomParser(v);
      const parts = li.text().split(':');
      if (parts.length > 1) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        this._amazonAddSpecification(key, value);
      }
    });
  }

  /**
   * Scrape product specifications
   * @return {void}
   */
  scrapeProductInfo() {
    const selector = '#technicalSpecifications_feature_div';
    let dom = DomParser(selector);
    //Trying first div for specifications;
    if (dom.length === 0) {
      if (DomParser("#detail-bullets_feature_div").length > 0 || DomParser("#detail-bullets").length > 0) {
        return this._scrapeFeatureSpecs();
      }
      //If second div is not found its bolt template so scrape specs from there
      return this.scrapeBoltSpecifications();
    }
    const keys = dom.find('th');
    const vals = dom.find('td');
    const self = this;
    keys.each((i, v) => {
      const kDom = DomParser(v);
      const vDom = DomParser(vals[i]);
      let key = kDom.text().trim();
      const val = vDom.text().trim();
      this._amazonAddSpecification(key, val);
    });
  }

  /**
   * Adds product specification with checks inside if its mpn
   * @param {String} key
   * @param {String} val
   * @return {void}
   */
  _amazonAddSpecification(key, val) {
    const EXCLUDE_SPECIFICATION_KEYS = ['Average Customer Review', 'Amazon Best Sellers Rank', 'ASIN', 'Product Dimensions', 'Shipping Weight'];
    if (EXCLUDE_SPECIFICATION_KEYS.indexOf(key) !== -1)
      return;
    const modelKeys = ['Model number', 'Modellnummer', 'Numéro du modèle de l\'article', "Item model number"]
    if (modelKeys.indexOf(key) !== -1) {
      key = 'mpn';
    }
    const trimValues = ['(View shipping rates and policies)']
    let cleanVal = val;
    trimValues.forEach((r) => cleanVal = cleanVal.replace(r, ''));
    this.addSpecification(key, cleanVal);
  }

  scrapeBoltSpecifications() {
    const selector = '.pdTab';
    const dom = DomParser(selector).first();
    const tds = dom.find('td');
    const keys = [];
    const vals = [];
    tds.each((i, v) => {
      const node = DomParser(v);
      const text = node.text().trim();
      if (text == '')
        return;
      if (i % 2) {
        vals.push(text);
      } else {
        keys.push(text);
      }
    });
    keys.forEach((v, i) => {
      let key = v;
      const val = vals[i];
      const modelKeys = ['Model number', 'Modellnummer', 'Numéro du modèle de l\'article']
      if (modelKeys.indexOf(key) !== -1) {
        key = 'mpn';
      }
      this.addSpecification(key, val);
    });
  }

  /**
   * Scrapes specification from bolt template
   * @return {void}
   */

  /**
   * Scrape product description
   * @return {String}
   */
  scrapeDescription() {
    const selector = '#aplus_feature_div';
    const dom = DomParser(selector);
    let result;
    if (dom.length > 0) {
      result = dom.html();
    } else {
      result = DomParser('#productDescription').html();
    }
    return result;
  }

  /**
   * Scrape product dimenssions and packaging weight
   * @return {void}
   */
  scrapeDimensions() {
    const selector = '#detail-bullets_feature_div';
    const list = DomParser(selector).find('li');
    if (list.length > 0) {
      const dimensionNeedle = ['Product Dimensions', 'Größe und/oder Gewicht', 'Dimensions du produit'];
      const packageWeightNeedle = ['Shipping Weight', 'Produktgewicht inkl. Verpackung', 'Poids de l\'article'];
      const defaultDimenssions = {
        'width': 0,
        'height': 0,
        'length': 0,
        'weight': 0
      };
      list.each((i, liDom) => {
        const li = DomParser(liDom);
        const text = li.text().trim();
        const parts = text.split(":");
        const key = parts[0];
        const value = parts[1];
        if (dimensionNeedle.indexOf(key) !== -1) {
          this.parseItemDimenssions(value, defaultDimenssions);
        }
        if (packageWeightNeedle.indexOf(key) !== -1) {
          this.parsePackagingWeight(value, defaultDimenssions);
        }
      });
    }
  }

  /**
   * Scrape product packging weight from string
   * @param {String} weightString - String that holds weight
   * @param {Object} defaults - dimenssions with default values e.g. widgth, height, weight, length
   * @return {void}
   */
  parsePackagingWeight(weightString, defaults) {
    const packaging = Object.assign({}, defaults);
    const parts = weightString.split(' ');
    packaging.weight = parts[1].trim();
    for (let k in packaging) {
      packaging[k] = parseFloat(packaging[k]);
    }
    this.packaging = packaging;
  }

  /**
   * Scrape product dimenssions from string
   * @param {String} dimenssionString - String that holds dimenssions
   * @param {Object} defaults - dimenssions with default values e.g. widgth, height, weight, length
   * @return {void}
   */
  parseItemDimenssions(dimenssionString, defaults) {
    const itemDim = Object.assign({}, defaults);
    const parts = dimenssionString.split(";");
    const whlString = parts[0];
    const weightString = parts.length > 1
      ? parts[1]
      : '';
    const whlParts = whlString.split('x').map((v) => v.trim());
    itemDim.width = whlParts[0];
    itemDim.height = whlParts[1];
    itemDim.length = whlParts[2].split(' ')[0].trim();
    itemDim.weight = weightString.trim().split(' ');
    for (let k in itemDim) {
      itemDim[k] = itemDim[k].toString().replace(',', '.');
      itemDim[k] = parseFloat(itemDim[k]);
    }
    this.dimensions = itemDim;
  }

  /**
   * Scrape product features
   * @return {void}
   */
  scrapeFeatures() {
    const selector = '#feature-bullets';
    const list = DomParser(selector).find('li');
    list.each((i, liDom) => {
      const li = DomParser(liDom);
      const text = li.text().trim();
      this.addFeature(i + 1, text);
    });
  }
  /**
   * Checks whether the product is movie disk
   * @return {Boolean}
   */
  isVideo() {
    const selectors = ['<span class="nav-a-content">Your Video Library</span>'];
    let result = false;
    selectors.forEach((v) => {
      if (result === true)
        return;
      if (this._html.indexOf(v) !== -1) {
        result = true;
      }
    });
    return result;
  }

  /**
   * Scrapes video library variations
   * @return {void}
   */
  scrapeVideoLibraryVariations() {
    const EXCLUDE = ["Prime Video"];
    const selector = 'li.swatchElement';
    const list = DomParser(selector);
    list.each((i, v) => {
      const variation = {
        image: null,
        attributes: {}
      };
      const li = DomParser(v);
      const title = li.find('a').find('span').eq(0).text();
      if (EXCLUDE.indexOf(title) !== -1)
        return;
      variation.attributes.type = title;
      const vLink = li.find('a').attr('href');
      const linkParts = vLink.split('/');
      const ASIN = linkParts[3];
      const price = li.find('a').find('span').eq(1).text().trim().replace('$', '');
      variation.ASIN = ASIN;
      variation.price = price;
      this.addVariation(variation);
    });
  }

  /**
   * Scrape product variations from JSON in dom
   * @return {void}
   */
  scrapeVariations() {
    if (this.isVideo()) {
      return this.scrapeVideoLibraryVariations();
    }
    const start = 'var dataToReturn = ';
    const end = ';';
    const haystack = this._html;
    const str = Str.between(haystack, start, end);
    const jsonString = JSON.stringify(eval("(" + str + ")"));;
    if (!jsonString)
      return;
    const twisterData = JSON.parse(jsonString);
    const labels = twisterData.dimensionsDisplay;
    const subType = twisterData.dimensionsDisplaySubType;
    const variants = twisterData.dimensionValuesDisplayData;
    for (let asin in variants) {
      const attr = variants[asin];
      const variant = {
        ASIN: asin,
        attributes: {}
      };
      variant.image = null;
      attr.forEach((attrValue, index) => {
        variant.attributes[labels[index]] = attrValue;
        const type = subType[index];
        if (type === "IMAGE") {
          const imgSelector = `img[alt="${attrValue}"]`;
          const el = DomParser(imgSelector);
          if (el.length > 0) {
            const src = el.attr('src');
            variant.image = src;
          }
        }
      });
      this.addVariation(variant);
    }
  }

  /**
   * Mocks html for tests
   * @return {void}
   */
  mock(html) {
    this.isMock = true;
    this.mockHtml = html;
  }

  /**
   * Clear specifications from unwanted values
   * @return {void}
   */
  cleanSpecifications() {
    const EXCLUDE = ['Amazon', 'Delivery Destinations'];
    this._item.listingSpecifications = this._item.listingSpecifications.filter((obj) => {
      for (let index = 0; index <= EXCLUDE.length; index++) {
        const skip = EXCLUDE[index];
        if (obj.key.indexOf(skip) != -1 || obj.value.indexOf(skip) != -1) {
          return false;
        }
      }
      return true;
    });
  }
  /**
   * Fakes request to amazon and return mocked html
   * @return {Promise}
   */
  fakeRequest() {
    return new Promise((resolve, reject) => {
      return resolve({body: this.mockHtml});
    });
  }

  /**
   * Check if page is captcha
   * @return {Boolean}
   */
  isCaptcha() {
    const condition = this._html.indexOf('Enter the characters you see below') !== -1;
    return condition;
  }

  /**
   * Parse product data and set it to item properties and returns the _item property object
   * @return {Promise<product>} - product
   */
  parse() {
    this.title = this.scrapeTitle();
    this.categories = this.scrapeCategories();
    const pricing = this.scrapePricing();
    const domain = this.getDomain();
    this.price = pricing.price;
    this.currency = pricing.currency;
    this.sourceId = this.scrapeSourceId();
    this.sourceLink = `${domain}/gp/product/${this.sourceId}`;
    this.addData('shipping', {price: pricing.shipping});
    this.inStock = this.isInStock();
    if (this.inStock) {
      this.quantity = 500;
    }
    this.isPrime = this.isPrime();
    this.images = this.scrapeImages();
    this.description = this.scrapeDescription();
    this.brand = this.scrapeBrand();
    if (this.brand != Str.EMPTY) {
      this.addSpecification('brand', this.brand);
    }
    this.addData('addon', this.isAddon());
    this.addData('preOrder', this.isPreOrder());
    this.scrapeVariations();
    this.scrapeFeatures();
    this.scrapeDimensions();
    this.scrapeProductInfo();
    this.cleanSpecifications();
    return super.parse();
  }
}

new AmazonDomParser({}, {}).parse().then(function(item) {
  firebase.initializeApp({
    apiKey: "AIzaSyAx8a6dkPTo4KIUxmBfWdY8EXQHm1wcU_0",
    authDomain: "client-data-1.firebaseapp.com",
    databaseURL: "https://client-data-1.firebaseio.com",
    projectId: "client-data-1"
  });

    var ref = firebase.database().ref("amazon");
    ref.child(item.sourceId).set(item);
  })
