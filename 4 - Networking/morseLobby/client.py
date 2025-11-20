import os
import socket
import sys
import threading
from message import Message

DEBUG = False


class Client:
    def __init__(self, name):
        self.name = name
        self.connected = False
        self.listening = threading.Event()
        self.address = None
        self.debug = False
        self.server = None
        self.console_lock = threading.Lock()
        self.message_receiver = threading.Thread(target=self.message_handler, args=(self.listening,))
        self.message_receiver.daemon = True
        self.socket = None
        self.current_room = "Default"

    def __str__(self):
        return self.name

    def connect(self, ip_address, server, create_socket=False):
        self.connected = True
        self.address = ip_address
        self.server = server
        if create_socket:
            self.message_receiver.start()

    def init_socket(self):
        clear_terminal()
        HOST, PORT = "localhost", 9999

        # Create a socket (SOCK_STREAM means a TCP socket)
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            self.socket = sock
            # Connect to server and send data
            self.socket.connect((HOST, PORT))
            # while self.message_receiver.is_alive():
            #     pass

    def disconnect(self):
        self.connected = False
        self.message_receiver.join()

    def print_message(self, message):
        with self.console_lock:
            print(message)

    def message_handler(self, listening):

        clear_terminal()
        HOST, PORT = "localhost", 9999

        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            self.socket = sock
            # Connect to server and send data
            self.socket.connect((HOST, PORT))
            incoming_message = Message("blank")
            while incoming_message.body != "Goodbye" and incoming_message.message_type != 'C':
                message_data = str(self.socket.recv(1024), "utf-8")
                incoming_message = Message(message_data)
                self.print_message("Server says: " + str(incoming_message))





def clear_terminal():
    """
    Clears the terminal screen based on the operating system.
    """
    # For Windows
    if os.name == 'nt':
        os.system('cls')
    # For Linux and macOS
    else:
        os.system('clear')


if __name__ == '__main__':
    client = Client("test")
    client.connect('localhost', '127.0.0.1', True)
    input_value = ""
    while input_value != "q":
        input_value = Message(input(""))
        if len(input_value.body) > 0:
            if input_value.body[0] == "/":
                input_value.message_type = "C"
                input_value.body = input_value.body[1:]

            client.socket.sendall(bytes(input_value.to_json(), "utf-8"))
            client.socket.sendall(b"\n")




