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

                Parse parseMessage = new Parse(cloudMessage);
                Message message = null;

                if (!parseMessage.CheckFormat())
                {
                    Trace.TraceInformation("No valid Cloud Message");
                    queue.DeleteMessage(cloudMessage);
                    continue;
                }
                if (!parseMessage.CheckHeaders())
                {
                    Trace.TraceInformation("No valid headers");
                    queue.DeleteMessage(cloudMessage);
                    continue; 
                }

                message = parseMessage.GetMessage();

                var fileSystem = FileSystemHelper.GetFileSystem(message.RootID);
                var file = fileSystem.Root.FindItemByID(message.ID) as File;

                if (file == null)
                {
                    Trace.TraceError("File not found!" + Environment.NewLine + "Project: " + message.ProjectName + Environment.NewLine + "File: " + message.ID);
                    queue.DeleteMessage(cloudMessage);
                    continue;
                }

                switch (message.Action)
                {
                    case "Storage":
                        SaveFile(file, message);
                    break;
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

        private CloudQueue GetQueue() 
        {
            string connectionString = ConfigurationManager.AppSettings["StorageConnectionString"];
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
           
            CloudQueue queue = queueClient.GetQueueReference("projectfilesqueue");
            queue.CreateIfNotExists();

            return queue;
        }

        private bool SaveFile(File file, Message message)
        {
            Trace.TraceInformation("Action: Storage");

            if (!file.Descriptor.Metadata.ContainsKey("LastModified"))
                file.Descriptor.Metadata.Add("LastModified", "3-3-2003 00:00:00");

            DateTime lastModified = DateTime.Parse(file.Descriptor.Metadata["LastModified"]);
            if (lastModified >= message.Time)
            {
                Trace.TraceError("File already proccessed");
                return false;
            }

            file.WriteContents(message.Contents);
            file.Descriptor.Metadata["LastModified"] = message.Time.ToString();
            Trace.TraceInformation("Saved file to Cloud");
            return true;
        }
    }
}
