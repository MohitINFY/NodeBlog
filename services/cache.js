const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const redisURL = 'redis://127.0.0.1:6379';

const client = redis.createClient(redisURL);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function () {

    // Call DB without Caching
    if(!this.useCache) 
    {
        return exec.apply(this, arguments);
    }

    // Create the Key
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));
    // See if we have a value for key in Redis
    const cacheValue = await client.hget(this.hashKey, key);

    // if yes, then return that
    if(cacheValue) {
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc) 
          ? doc.map(d => this.model(d)) 
          : new this.model(doc)
    }
    // Else call Modo DB

    const result = await exec.apply(this, arguments);
    

    client.hset(this.hashKey, key, JSON.stringify(result));
    console.log(result);
    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
  }