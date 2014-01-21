using Lisa.Bioshock.ActionResults;
using Lisa.Bioshock.Extensions;
using Lisa.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace Lisa.Bioshock.Controllers
{
    public partial class ProjectController
    {
        //[AjaxAuthorize]
        [HttpPost]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult CreateFile(int projectID, string fileName)
        {
            // fileName contains full path.

            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return HttpNotFound();
            }

            var fileSystem = GetFileSystem(project.RootID);

            // Check if file already exists
            if (fileSystem.Root.FindItemByPath(fileName, false) == null)
            {
                string contentType = GetContentType(fileName);
                var file = fileSystem.Root.Files.Add(fileName, contentType);

                return Json(new
                {
                    result = true,
                    fileID = file.ID,
                    contentType = file.ContentType,
                });
            }

            return Json(new
            {
                result = false,
                errorMessage = "Er bestaat al een bestand met deze naam."
            });
        }


        //[AjaxAuthorize]
        [HttpPost]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult WriteFile(int projectID, string fileID, string contents)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return HttpNotFound();
            }

            var fileSystem = GetFileSystem(project.RootID);
            var file = fileSystem.Root.FindItemByID(fileID) as File;

            if (file == null)
            {
                return Json(new
                {
                    result = false,
                    errorMessage = "Bestand kon niet gevonden worden."
                });
            }

            try
            {
                file.WriteContents(contents);
            }
            catch (Exception e)
            {
                string errorMessage = "Er is iets misgegaan tijdens het schrijven van het bestand.";

                #if DEBUG
                    errorMessage += Environment.NewLine + e.Message;
                #endif

                return Json(new
                {
                    result = false,
                    errorMessage = errorMessage
                });
            }

            return Json(new
            {
                result = true
            });
        }


        //[AjaxAuthorize]
        [HttpPost]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetFiles(int projectID)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return HttpNotFound();
            }

            var fileSystem = GetFileSystem(project.RootID);
            return new JsonStorageItemResult(fileSystem.Root);
        }


        //[AjaxAuthorize]
        [HttpPost]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetFile(int projectID, string fileID, bool readContents = false)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return HttpNotFound();
            }

            var fileSystem = GetFileSystem(project.RootID);
            var file = fileSystem.Root.FindItemByID(fileID) as File;
            if (file == null)
            {
                return HttpNotFound();
            }

            return new JsonStorageItemResult(file, readContents);
        }
    }
}
