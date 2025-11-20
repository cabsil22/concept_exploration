import socketserver
from message import Message
from room import ChatRoom
from client import Client
##########################################HERE###############################################
import threading



class ThreadedTCPRequestHandler(socketserver.BaseRequestHandler):
    """
    The request handler class for our server.

    It is instantiated once per connection to the server, and must
    override the handle() method to implement communication to the
    client.
    """

    def __init__(self, request, client_address, server):
        self.client = Client("TempUser")
        self.client.connect(client_address, server)
        self.debug = True
        self.server = server
        super(ThreadedTCPRequestHandler, self).__init__(request, client_address, server)

    def handle(self):
        # self.rfile is a file-like object created by the handler.
        # We can now use e.g. readline() instead of raw recv() calls.
        # We limit ourselves to 10000 bytes to avoid abuse by the sender.

        while self.client.connected:
            # read message from client
            pieces = [b'']
            total = 0
            while b'\n' not in pieces[-1] and total < 10_000:
                pieces.append(self.request.recv(2000))
                total += len(pieces[-1])
            self.data = b''.join(pieces)
            if self.debug:
                self.log_to_console(threading.current_thread())
                self.log_to_console(self.data.decode("utf-8"))

            # form a response
            response = self.server.process_message(self)

            #send response
            for handle in self.server.rooms[self.client.current_room].users:
                handle.request.send(bytes(str(response), encoding="utf-8"))


    def log_to_console(self, message):
        print(f"{self.client.name} wrote: {message}")


class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    def __init__(self, server_address, RequestHandlerClass):
        self.rooms = {'Default': ChatRoom("Default"), }
        self.debug = True
        super().__init__(server_address, RequestHandlerClass)

    def add_room(self, room):
        self.rooms[room.name] = room

    def list_rooms(self):
        return list(self.rooms)

    def process_message(self, message_handle):
        message = Message(message_handle.data)

        if message.message_type == "C":
            command, *parameters = message.body.split(" ", maxsplit=1)
            if command == "exit":

                return "Goodbye"
            elif command == "help":
                return (f"Help Info: /exit to quit or /join <room> "
                        f"to join a room. Available rooms are: {server.list_rooms()} ")
            elif command == "join":
                room_name = " ".join(parameters)
                new_room = None
                if room_name in server.rooms:
                    if self.debug:
                        print("Room exists - room_name: ", room_name)
                    new_room = server.rooms[room_name]
                else:
                    if self.debug:
                        print("Room does not exists - params: ", room_name)
                    new_room = ChatRoom(room_name)
                    server.add_room(new_room)
                new_room.add_user(message_handle)
                message_handle.client.current_room = new_room.name
                return f"You have joined the {new_room}. You are user number: {new_room.count()}"
        else:
            print("Process message: ", message)
        return message




if __name__ == "__main__":
    HOST, PORT = "localhost", 9999

    # Create the server, binding to localhost on port 9999
    server = ThreadingTCPServer((HOST, PORT), ThreadedTCPRequestHandler)
    with server:
        # Activate the server; this will keep running until you
        # interrupt the program with Ctrl-C
        server.serve_forever()