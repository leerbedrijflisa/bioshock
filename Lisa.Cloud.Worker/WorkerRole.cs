using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading;
using System.Text.RegularExpressions;
using System.Configuration;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Queue;
using Lisa.Cloud.Worker;
using Lisa.Bioshock.Helpers;
using Lisa.Bioshock.Extensions;
using Lisa.Storage;
using Lisa.Storage.Data;

namespace Lisa.Cloud.Worker
{
    public class WorkerRole : RoleEntryPoint
    {

        public override void Run()
        {
            CloudQueue queue = GetQueue();

            while (true)
            {
                Trace.TraceInformation("Search for a new queue message.");

                CloudQueueMessage cloudMessage = queue.GetMessage();

                if (cloudMessage == null)
                {
                    Thread.Sleep(5000);
                    continue;
                }

                Dictionary<string, string> dictionary = ParseQueueMessage(cloudMessage);
                if (dictionary != null)
                {
                    if (dictionary["ID"] == null || dictionary["Time"] == null || dictionary["Action"] == null)
                    {
                        Trace.TraceInformation("Failed to find the headers..");
                        queue.DeleteMessage(cloudMessage);
                        Trace.TraceInformation("Deleted message from the queue");
                        continue;
                    }

                    var ID = dictionary["ID"];
                    var action = dictionary["Action"];
                    var message = dictionary["Message"];
                    var rootID = dictionary["RootID"];

                    var timee = dictionary["Time"];
                    DateTime time = DateTime.Parse(timee);

                    string projectDir = dictionary["Project"];
                    string[] projectSplit = projectDir.Split('-');
                    var projectName = projectSplit[1];
                    var projectID = projectSplit[0];

                    Trace.TraceInformation("ID: " + ID);
                    Trace.TraceInformation("Project: " + projectSplit);
                    Trace.TraceInformation("Time: " + time);

                    var fileSystem = FileSystemHelper.GetFileSystem(rootID);
                    var file = fileSystem.Root.FindItemByID(ID) as File;

                    if (file == null)
                    {
                        Trace.TraceError("File not found!" + Environment.NewLine + "Project: " + projectDir + Environment.NewLine + "File: " + ID);
                        queue.DeleteMessage(cloudMessage);
                        Trace.TraceInformation("Deleted message from the queue");
                        continue;
                    }

                    switch (action)
                    {
                        case "Storage":
                            Trace.TraceInformation("Action: Storage");
                            
                            if (!file.Descriptor.Metadata.ContainsKey("LastModified"))
                                file.Descriptor.Metadata.Add("LastModified", "3-3-2003 00:00:00");

                            DateTime lastModified = DateTime.Parse(file.Descriptor.Metadata["LastModified"]);
                            if (lastModified >= time)
                            {
                                Trace.TraceError("File already proccessed");
                                continue;
                            }

                            file.WriteContents(message);
                            file.Descriptor.Metadata["LastModified"] = time.ToString();
     
                            break;
                    }

                    queue.DeleteMessage(cloudMessage);
                    Trace.TraceInformation("Deleted message from the queue");

                }
            }
        }

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections 
            ServicePointManager.DefaultConnectionLimit = 12;

            // For information on handling configuration changes
            // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.

            return base.OnStart();
        }

        public Dictionary<string, string> ParseQueueMessage(CloudQueueMessage cloudMessage)
        {
            List<string> cloudMessageList = cloudMessage.AsString.Split('\n').ToList();
            Dictionary<string, string> headers = new Dictionary<string, string>();
            bool isMessage = false;
            string message = string.Empty;

            while (cloudMessageList.Count > 0)
            {
                var t = cloudMessageList[0];
                string[] tSplit = t.Split(':');

                if (tSplit.Length > 1)
                {
                    var key = tSplit.First().Trim();
                    if (key.ToLower() == "message")
                    {
                        isMessage = true;
                        if (isMessage)
                        {
                            while (cloudMessageList.Count > 0)
                            {
                                var msg = cloudMessageList[0];
                                message += msg.Replace("Message: ", "") + Environment.NewLine;
                                cloudMessageList.Remove(msg);
                            }

                            headers.Add("Message", message);
                            break;
                        }
                    }
                    else
                    {
                        var value = "";
                        if (tSplit.Count() > 2)
                        {
                            for (int i = 1; i < tSplit.Count(); i++)
                            {
                                if (i >= 2)
                                    value += ":" + tSplit[i];
                                else
                                    value += tSplit[i];
                            }
                        }
                        else
                        {
                            value = tSplit.Last();
                        }
                        headers.Add(key, value.Trim());
                    }
                }
                else
                {
                    if (isMessage)
                    {
                        message += t;
                    }
                }

                cloudMessageList.Remove(t);
            }

            if (!headers.ContainsKey("Message"))
            {
                headers.Add("Message", message);
            }

            return headers;
        }

        private CloudQueue GetQueue() 
        {
            string connectionString = ConfigurationManager.AppSettings["StorageConnectionString"];
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
           
            CloudQueue queue = queueClient.GetQueueReference("projectfilesqueue");
            queue.CreateIfNotExists();

            return queue;
        }
    }
}
