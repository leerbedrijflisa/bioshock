using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace Lisa.Bioshock.Models
{
    public struct FileDescriptor
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public int ProjectID { get; set; }
    }

    public class SynchronizeHub : Hub
    {
        public void ProcessChanges(FileDescriptor file, string contents)
        {
            Clients.All.Update(file, contents);
        }
    }
}