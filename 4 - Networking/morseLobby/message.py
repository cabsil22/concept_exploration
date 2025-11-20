import json
from json import JSONDecodeError


class Message:
    def __init__(self, body: str | bytes, message_type="M"):
        # initialize the message. By the end of this, the instance of this class should have a string body and a type
        # or M for the type of message.
        self.debug = False
        if len(body) == 0:
            print("Message body is empty")
            self.body = ""
            self.message_type = message_type
            return

        if type(body) is bytes:
            if self.debug:
                print("Message body is bytes")
            # if the body type is bytes, we construct the object from the bytes object
            self.decode_message(body)
        elif type(body) is str:
            if self.debug:
                print("Message body is str")
            # if the body type is a string, we process it
            # check to see if it is json, if so, we decode it

            if self.is_valid_json(body):
                if self.debug:
                    print("Message body is valid json")
                self.decode_message(body)
            else:
                # we should land here if it is just a plain string.
                if self.debug:
                    print("Message body is invalid json, just using a string, not decoding")
                self.message_type = message_type
                self.body = body
        else:
            # If we were given some other type, we error out.
            raise TypeError("Message body must be bytes or str")

    def __str__(self):
        return self.body

    def __dict__(self):
        return {'type': self.message_type, 'body': self.body}

    def to_json(self):
        return str(json.dumps(self.__dict__()))

    def to_bytes(self):
        return bytes(self.to_json(), 'utf-8')

    def is_valid_json(self, body):
        try:
            json.loads(body)
            return True
        except JSONDecodeError as e:
            if self.debug:
                print(e)
        return False

    def decode_message(self, json_string):
        if type(json_string) is bytes:
            json_string = json_string.decode('utf-8')
        try:
            message_object = json.loads(json_string)
            self.body = message_object['body']
            self.message_type = message_object['type']
        except JSONDecodeError as e:
            if self.debug:
                print("Message object JSON Error:")
                print(e)
            self.body = json_string
            self.message_type = "M"
