
//            //public async Task Invoke(HttpContext context)
//            //{
//            //if (context.WebSockets.IsWebSocketRequest)
//            //{
//            //    CancellationToken ct = context.RequestAborted;
//            //    WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
//            //    _sockets.Add(webSocket);

//            //    while (webSocket.State == WebSocketState.Open)
//            //    {
//            //        // Receive incoming messages from the WebSocket
//            //        var buffer = new byte[1024 * 4];
//            //        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), ct);

//            //        if (result.MessageType == WebSocketMessageType.Text)
//            //        {
//            //            // Decode the incoming message
//            //            string incomingMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);
//            //            var decodedMessage = JsonConvert.DeserializeObject<ChatMessage>(incomingMessage);

//            //            // Create a new ChatMessage instance and populate its fields
//            //            var chatMessage = new ChatMessage
//            //            {
//            //                Nickname = decodedMessage.Nickname,
//            //                Message = decodedMessage.Message
//            //            };

//            //            // Add the ChatMessage to the database and save changes
//            //            _bookContext.ChatMessages.Add(chatMessage);
//            //            await _bookContext.SaveChangesAsync();

//            //            // Broadcast the message to all connected clients
//            //            string broadcastMessage = JsonConvert.SerializeObject(chatMessage);
//            //            var broadcastBuffer = Encoding.UTF8.GetBytes(broadcastMessage);
//            //            foreach (var socket in _sockets)
//            //            {
//            //                await socket.SendAsync(new ArraySegment<byte>(broadcastBuffer), WebSocketMessageType.Text, true, ct);
//            //            }
//            //        }
//            //        else if (result.MessageType == WebSocketMessageType.Close)
//            //        {
//            //            // Remove the WebSocket from the list of connected clients
//            //            _sockets.Remove(webSocket);
//            //            break;
//            //        }
//            //    }
//            //}
//            //else
//            //{
//            //    await _next(context);
//            //}

//            //}

using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebSockets;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Text;

namespace Lab3BookAPI.Controllers
{
    namespace ChatApp
    {
        public class WebSocketMiddleware
        {
            private readonly RequestDelegate _next;
            private readonly List<WebSocket> _sockets;

            public WebSocketMiddleware(RequestDelegate next)
            {
                _next = next;
                _sockets = new List<WebSocket>();
            }

            public async Task Invoke(HttpContext context)
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    CancellationToken ct = context.RequestAborted;
                    WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    _sockets.Add(webSocket);

                    while (webSocket.State == WebSocketState.Open)
                    {
                        // Receive incoming messages from the WebSocket
                        var buffer = new byte[1024 * 4];
                        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), ct);

                        if (result.MessageType == WebSocketMessageType.Text)
                        {
                            // Broadcast the message to all connected clients
                            string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                            foreach (var socket in _sockets)
                            {
                                await socket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), WebSocketMessageType.Text, true, ct);
                            }
                        }
                        else if (result.MessageType == WebSocketMessageType.Close)
                        {
                            // Remove the WebSocket from the list of connected clients
                            _sockets.Remove(webSocket);
                            break;
                        }
                    }
                }
                else
                {
                    await _next(context);
                }
            }
        }

        public static class WebSocketExtensions
        {
            public static IApplicationBuilder UseWebSocketMiddleware(this IApplicationBuilder app)
            {
                return app.UseMiddleware<WebSocketMiddleware>();
            }
        }
    }
}
