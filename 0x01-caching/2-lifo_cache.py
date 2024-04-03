#!/usr/bin/python3
"""fifo caching"""
BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """Basic Caching class"""
    def __init__(self):
        """initailization function, get cache_data from the base class"""
        super().__init__()

    def put(self, key, item):
        """insert a dictionary data to the cache"""
        if key is None or item is None:
            return
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            removed = list(self.cache_data.keys())[-1]
            del self.cache_data[removed]
            print("DISCARD: {}".format(removed))
        self.cache_data.update({key: item})

    def get(self, key):
        """get data from the cache"""
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key] 
