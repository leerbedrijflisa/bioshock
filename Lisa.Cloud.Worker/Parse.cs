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
        public Parse(CloudQueueMessage queueMessage)
        {
            if (queueMessage != null)
            {
                Message = queueMessage.AsString;
            }
        }

        public bool CheckFormat()
        {
            Regex regex = new Regex("([a-zA-Z]{2,10}:)");
            List<string> matches = regex.Matches(Message)
                .Cast<Match>()
                .Select(m => m.Value)
                .ToList();

            if (matches.Count < 6)
            {
                return false;
            }
            foreach (var match in matches)
            {
                if (Headers.Contains(match.TrimEnd(':')))
                {
                    if (match.TrimEnd(':') == "Message")
                    {
                        return true;
                    }
                    continue;
                }
                return false;
            }

            return false;
        }

        public bool CheckHeaders()
        {
            foreach (string header in Headers)
            {
                if (string.IsNullOrEmpty(GetHeader(header)))
                {
                    return false;
                }
            }
            return true;
        }

        public Message GetMessage()
        {
            Message message = new Message();

            message.ID = GetHeader("ID");
            message.RootID = GetHeader("RootID");
            message.Action = GetHeader("Action");
            message.Contents = GetContents();

            string[] project = GetHeader("Project").Split('-');
            message.ProjectID = Convert.ToInt32(project[0]);
            message.ProjectName = project[1];

            message.Time = Convert.ToDateTime(GetHeader("Time"));
            return message;
        }

        public string GetHeader(string header)
        {
            header = header.Trim();
            Regex regex = new Regex(header + ": (.*)", RegexOptions.IgnoreCase);
            Match match = regex.Match(Message);

            string output = null;
            if (match != null)
            {
                output = match.ToString();
                output = output.Replace(header + ": ", "").Trim();
            }
            return output;
        }

        public string GetContents()
        {
            Regex regex = new Regex("Message: (.*)", RegexOptions.Singleline | RegexOptions.IgnoreCase);
            Match match = regex.Match(Message);

            string output = null;
            if (match != null)
            {
                output = match.ToString();
                output = output.Replace("Message: ", "").Trim();
            }
            return output;

        }

        private string Message;
        private List<string> Headers = new List<string>()
        {
            "ID",
            "Time",
            "Action",
            "RootID",
            "Project",
            "Message"
        };
    }
}
