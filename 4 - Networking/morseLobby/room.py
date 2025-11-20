class ChatRoom:

    def __init__(self, name):
        self.users = []
        self.name = name
        self.welcome_message = "Welcome to the room: " + self.name

    def count(self):
        return len(self.users)

    def greet(self):
        return self.welcome_message

    def add_user(self, user):
        self.users.append(user)

    def get_users(self):
        return self.users

    def __str__(self):
        return self.name