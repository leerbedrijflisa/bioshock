using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace Lisa.Bioshock.Models
{
    public class SynchronizeHub : Hub
    {
        public void Send(string codeMessage)
        {
            Clients.All.addMessage(codeMessage);
        }
    }
}