#!/usr/bin/python3
"""fifo caching"""
BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """Basic Caching class"""
    def __init__(self):
        """initailization function, get cache_data from the base class"""
        self.used = []
        super().__init__()

    def put(self, key, item):
        """insert a dictionary data to the cache"""
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                removed = self.used.pop(0)
                del self.cache_data[removed]
                print("DISCARD: {}".format(removed))
            self.cache_data[key] = item
            self.used.append(key)
        else:
            return None

    def get(self, key):
        """get data from the cache"""
        if key is not None and key in self.cache_data:
            self.used.remove(key)
            self.used.append(key)
            return self.cache_data[key]
        return None
