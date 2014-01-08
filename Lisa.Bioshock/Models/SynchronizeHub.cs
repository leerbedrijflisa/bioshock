using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;

namespace Lisa.Bioshock.Models
{
    public class SynchronizeHub : Hub
    {
        //public override System.Threading.Tasks.Task OnConnected()
        //{
        //    //if(HttpContext.Current.Session["SignalR"] == null)
        //    //{
        //    //    HttpContext.Current.Session.Add("SignalR", new List<string>());
        //    //}
        //    //((List<string>)HttpContext.Current.Session["SignalR"]).Add(Context.ConnectionId);

        //    if (!HttpContext.Current.Response.Cookies.AllKeys.Contains("SignalR"))
        //    {
        //        var cookie = new HttpCookie("SignalR", JsonConvert.SerializeObject(new List<string>()));
        //        HttpContext.Current.Response.Cookies.Add(cookie);
        //    }

        //    var clients = JsonConvert.DeserializeObject<List<string>>(HttpContext.Current.Response.Cookies["SignalR"].Value);
        //    clients.Add(Context.ConnectionId);
        //    if (Context.Request.GetHttpContext().Session != null)
        //    {
        //        System.Diagnostics.Debug.WriteLine("Session Found!");
        //    }
        //    HttpContext.Current.Response.Cookies["SignalR"].Value = JsonConvert.SerializeObject(clients);

        //    return base.OnConnected();
        //}

        public void Send(object codeMessage, string connID)
        {
            //var clients = JsonConvert.DeserializeObject<List<string>>(HttpContext.Current.Request.Cookies["SignalR"].Value);
            //foreach (string client in clients)
            //{
            //    if (client != Context.ConnectionId)
            //    {

            //    }
            //}
            Clients.Client(connID).addMessage(codeMessage);
        }
    }
}