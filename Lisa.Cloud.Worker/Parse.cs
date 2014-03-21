using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Queue;
using System.Text.RegularExpressions;

namespace Lisa.Cloud.Worker
{
    public class Parse
    {
        public Parse(CloudQueueMessage queueMessage = null)
        {
            if (queueMessage != null)
            {
                Message = queueMessage.AsString;
            }
        }

        public bool CheckFormat()
        {
            string pattern = "/ID: ([a-z0-9- ])/";
            var ID = Regex.Match(Message, pattern, RegexOptions.IgnoreCase);
            if (ID != null)
            {

            }
            return false;
        }

        private string Message;
    }
}
