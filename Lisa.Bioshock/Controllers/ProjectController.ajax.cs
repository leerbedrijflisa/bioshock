using Lisa.Bioshock.ActionResults;
using Lisa.Bioshock.Extensions;
using Lisa.Bioshock.Helpers;
using Lisa.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using System.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Queue;

namespace Lisa.Bioshock.Controllers
{
    //[AjaxAuthorize]
    public partial class ProjectController
    {

        public CloudStorageAccount storageAccount;
        public CloudQueueClient queueClient;
        CloudQueue queue;

        public ProjectController()
        {
            // Retrieve storage account from conection string
            // CloudStorageAccount.Parse(
            //                    ConfigurationManager.AppSettings["StorageConnectionString"]);
            //
            var conString = ConfigurationManager.AppSettings["StorageConnectionString"];
            storageAccount = CloudStorageAccount.Parse(conString);
            // Create the queue client
            queueClient = storageAccount.CreateCloudQueueClient();
            // Retrieve a reference to a queue
            queue = queueClient.GetQueueReference("projectfilesqueue");
            // Create queue if it doesn't already exist
            queue.CreateIfNotExists();
        }

        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult CreateFile(int projectID, string fileName)
        {
            // fileName contains full path.

            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return new JsonErrorResult("Project niet gevonden.");
            }

            var fileSystem = FileSystemHelper.GetFileSystem(project.RootID);

            // Check if file already exists
            if (fileSystem.Root.FindItemByPath(fileName, false) == null)
            {
                string contentType = GetContentType(fileName);
                var file = fileSystem.Root.Files.Add(fileName, contentType);

                project.LastOpenedFile = Guid.Parse(file.ID);
                Db.SaveChanges();

                return new JsonStorageItemResult(file, false);
            }

            return new JsonErrorResult("Er bestaat al een bestand met deze naam.");
        }



        [HttpPost]
        [ValidateInput(false)]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult WriteFile(int projectID, string fileID, string contents)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return new JsonErrorResult("Project niet gevonden.");
            }

            var fileSystem = FileSystemHelper.GetFileSystem(project.RootID);
            var file = fileSystem.Root.FindItemByID(fileID) as File;

            if (file == null)
            {
                return new JsonErrorResult("Bestand niet gevonden.");
            }

            try
            {
                string headersToContents = "Time: " + DateTime.UtcNow.ToString() + Environment.NewLine;
                headersToContents += "ID: " + fileID.ToString() + Environment.NewLine;
                headersToContents += "Action: Storage" + Environment.NewLine;
                headersToContents += "RootID: " + project.RootID + Environment.NewLine;
                headersToContents += "Project: " + project.ID + "-" + project.Name + Environment.NewLine;
                headersToContents += Environment.NewLine + "Message: " + contents;
                CloudQueueMessage message = new CloudQueueMessage(headersToContents);
                queue.AddMessage(message);
                //file.WriteContents(contents);
            }
            catch (Exception e)
            {
                string errorMessage = "Er is iets misgegaan tijdens het schrijven van het bestand.";

                #if DEBUG
                    errorMessage += Environment.NewLine + e.Message;
                #endif

                return new JsonErrorResult(errorMessage);
            }

            return new JsonStorageItemResult(file, false);
        }



        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetFiles(int projectID)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return new JsonErrorResult("Project niet gevonden.");
            }

            var fileSystem = FileSystemHelper.GetFileSystem(project.RootID);
            return new JsonStorageItemResult(new List<StorageItem> { fileSystem.Root });
        }



        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetFile(int projectID, string fileID, bool readContents = false)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return new JsonErrorResult("Project niet gevonden.");
            }

            var fileSystem = FileSystemHelper.GetFileSystem(project.RootID);
            var file = fileSystem.Root.FindItemByID(fileID) as File;
            if (file == null)
            {
                return new JsonErrorResult("Bestand niet gevonden.");
            }

            project.LastOpenedFile = Guid.Parse(file.ID);
            Db.SaveChanges();

            return new JsonStorageItemResult(file, readContents);
        }





        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)] //<--- MAGIC IN IE!!!!
        public ActionResult GetFileContents(int projectID, string fileName)
        {
            if(!Request.QueryString.AllKeys.Contains("g"))
            {
                return Redirect(string.Format("/Project/{0}/File/{1}?g={2}", projectID, fileName, Guid.NewGuid()));
            }

            var project = Db.Projects.Find(projectID);
            FileSystem fileSystem = FileSystemHelper.GetFileSystem(project.RootID);

            File file = null;
            if (string.IsNullOrEmpty(fileName))
            {
                file = fileSystem.Root.FindItemByID(project.LastOpenedFile.ToString()) as File;
            }
            else
            {
                file = fileSystem.Root.FindItemByPath(fileName, false) as File;
            }

            if (file != null)
            {
                //file.ContentType = "text/css";
                // Both of these lines don't work... strangely.
                //Response.AddHeader("Content-Type", file.ContentType);
                //Response.ContentType = file.ContentType;
                //Response.Expires = 0;
                //Response.Headers.Set("Expires", "0");
                //Request.Headers.Add("Expires", "0");
                //Request.Headers.Set("Expires", "0");

                // Firefox and IE ignores headers 'Expires' and 'Cache-Control'.

                var contents = file.ReadContents(); //<-- THIS SUCKS IN IE!!!!

                return new ContentResult
                {
                    // This DOES work...???
                    ContentType = file.ContentType,
                    Content = contents,
                    ContentEncoding = System.Text.Encoding.UTF8
                };
            }
            return HttpNotFound();
        }

        

        [HttpGet]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetStartUpFile(int projectID)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return new JsonErrorResult("Project niet gevonden.");
            }

            var fileSystem = FileSystemHelper.GetFileSystem(project.RootID);
            var file = fileSystem.Root.FindItemByID(project.LastOpenedFile.ToString()) as File;

            if (file == null)
            {
                return new JsonErrorResult("Start-up bestand niet gevonden.");
            }

            return new JsonStorageItemResult(file, true);
        }
    }
}
