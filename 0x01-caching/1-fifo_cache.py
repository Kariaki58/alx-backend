#!/usr/bin/python3
"""fifo caching"""
BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """Basic Caching class"""
    def __init__(self):
        """initailization function, get cache_data from the base class"""
        super().__init__()

    def put(self, key, item):
        """insert a dictionary data to the cache"""
        if key is None or item is None:
            return
        if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
            discarded_key = next(iter(self.cache_data))
            del self.cache_data[discarded_key]
            print(f"DISCARD: {discarded_key}")
        self.cache_data.update({key: item})
        
    def get(self, key):
        """get data from the cache"""
        if key is None:
            return None
        return self.cache_data[key]
