import socketio

# async_mode="asgi" tells python-socketio to work as an ASGI app,
# the same kind of app FastAPI is -- this lets us "attach" it to
# our existing FastAPI app rather than running a separate server.
# cors_allowed_origins="*" allows our React app (running on a
# different port during development) to connect without being blocked.
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")


@sio.event
async def connect(sid, environ):
    # Runs whenever a browser tab opens a socket connection.
    # sid = a unique id Socket.IO assigns to that connection.
    print(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    # Runs whenever a browser tab closes / loses the connection.
    print(f"Client disconnected: {sid}")