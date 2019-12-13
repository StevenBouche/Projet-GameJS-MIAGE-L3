const Constants = require('../../shared/constants');
const equal = require('deep-equal');

module.exports = class HashMapCase {
    
    constructor(capacity) {
      this.buckets = new Array(capacity);
      this.size = 0;
      this.collisions = 0;
      this.keys = [];
      this.numberTile = Constants.MAP_SIZE / Constants.MAP_TILE;
    }
  
    hash(key) {
        return key.x+key.y*this.numberTile;
    }
  
    _getBucketIndex(key) {
      return this.hash(key);
    }
  
    set(key, value) {
      const {bucketIndex, entryIndex} = this._getIndexes(key);
  
      if(entryIndex === undefined) {
        // initialize array and save key/value
        const keyIndex = this.keys.push({content: key}) - 1; // keep track of the key index
        this.buckets[bucketIndex] = this.buckets[bucketIndex] || [];
        this.buckets[bucketIndex].push({key, value, keyIndex});
     //   console.log( this.buckets[bucketIndex]);
        this.size++;
        // Optional: keep count of collisions
        if(this.buckets[bucketIndex].length > 1) { console.log("collision");this.collisions++; }
      } else {
        // override existing value
        this.buckets[bucketIndex][entryIndex].value = value;
       
      }
      
      return this;
    }
  
    get(key) {
      const {bucketIndex, entryIndex} = this._getIndexes(key);
      if(entryIndex === undefined) {
        return;
      }
      return this.buckets[bucketIndex][entryIndex].value;
    }
  
    has(key) {
      return !!this.get(key);
    }
  
    _getIndexes(key) {
      const bucketIndex = this._getBucketIndex(key);
      const values = this.buckets[bucketIndex] || [];
      for (let entryIndex = 0; entryIndex < values.length; entryIndex++) {
        const entry = values[entryIndex];
        if(equal(entry.key,key)) {
          return {bucketIndex, entryIndex };
        }
      }
  
      return {bucketIndex};
    }
  
    delete(key) {
        const {bucketIndex, entryIndex, keyIndex} = this._getIndexes(key);
   //     console.log(bucketIndex, entryIndex, keyIndex)
        if(entryIndex === undefined) return false;
        this.buckets[bucketIndex].splice(entryIndex, 1);
        this.keys = this.keys.filter(element => !equal(element.content,key));
     //   let index = this.keys.findIndex(element => equal(element.content,key));
     //   console.log(index)
      //  if(index >= 0) this.keys.splice(index,1);
 
        this.size--;
        return true;
    }
}