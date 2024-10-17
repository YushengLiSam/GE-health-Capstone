class Category:
    def __init__(self, unique_id, name):
        self.unique_id = unique_id
        self.name = name
        self.subcategories = []

    def to_dict(self):
        return {
            "unique_id": self.unique_id,
            "name": self.name,
            "subcategories": [sub.to_dict() for sub in self.subcategories]
        }

class Subcategory:
    def __init__(self, name):
        self.name = name
        self.datapoints = []

    def to_dict(self):
        return {
            "name": self.name,
            "datapoints": [dp.to_dict() for dp in self.datapoints]
        }

class Datapoint:
    def __init__(self, name, datatype, is_list=False, list_values=None):
        self.name = name
        self.datatype = datatype  # Enum like 'NUMERIC', 'TEXTBOX', 'DROPDOWN'
        self.is_list = is_list
        self.list_values = list_values if list_values else []

    def to_dict(self):
        return {
            "name": self.name,
            "datatype": self.datatype,
            "is_list": self.is_list,
            "list_values": self.list_values
        }

