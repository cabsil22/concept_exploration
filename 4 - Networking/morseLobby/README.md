# Overview

This was an exploration into sockets using python. It turned into an exploration of multi-threading as well along the way. 

The application is a simple chat server and client(s). The clients can connect to the server and then chat with eachother. 

The purpose of this project was to learn about sockets and how to use them w/o any fancy libraries that handle them for you.  It proved to serve as a learning experience and helped to learn that it is probably best to use libraries to help with the sockets when appropriate. The libraries seem to have a lot of useful funcationality built in, like reconnection processes. 


[Software Demo Video](https://youtu.be/13EVy7gKHvc)

# Network Communication

This is a client server architecture. It is designed for the server to be headless and the clients to be able to interact with eachother through the server. 

Currently the project is hard coded to use localhost and port 9999. It would be simple to change that, but I would definetly not expose this application to any public network since the server does nothing to safely process the messages it gets. 

The messages are being sent in JSON to each other. They are transfered in bytes, but encoded and decoded into JSON format on the other end. 

# Development Environment

I used Python 3.11 for this project powered by PyCharm for my IDE. 

The socket libraries used are all built into python.  You just need to import 'socket' for them. I also used 'threading' to handle multiple connections at once. 

# Useful Websites


* [Socket Documentation](https://docs.python.org/3.13/library/socketserver.html#socketserver-tcpserver-example)


# Future Work

* Create clear separation between broadcast and targeted messages so users can speak to individuals and not just rooms. 
* Better handling of the UI Thread to have a cleaner user experience
* More server commands made available. Right now we have /help, /join room and /exit