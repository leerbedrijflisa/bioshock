using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using Lisa.Bioshock.ActionResults;
using Lisa.Bioshock.Attributes;
using Lisa.Bioshock.Models;
using Lisa.Bioshock.Extensions;
using Lisa.Storage;
using Lisa.Storage.Data;

namespace Lisa.Bioshock.Controllers
{
    [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
    public class AjaxController : BaseController
    {
        [AjaxAuthorize]
        [HttpPost]
        public ActionResult GetFiles(int projectID, string contentType = null)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return HttpNotFound();
            }

            var fileSystem = CreateFileSystem(project.RootID);

            if (contentType != null)
            {
                var files = GetFilesByContentType(contentType, fileSystem.Root);
                return new JsonStorageItemResult(files);
            }

            return new JsonStorageItemResult(fileSystem.Root);
        }


        [AjaxAuthorize]
        [HttpPost]
        public ActionResult GetFileContents(int projectID, string fileID)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return HttpNotFound();
            }

            var fileSystem = CreateFileSystem(project.RootID);
            var file = fileSystem.Root.FindItemByID(fileID) as File;
            if (file == null)
            {
                return HttpNotFound();
            }

            var fileContents = file.ReadContents();

            return Json(new
            {
                id = file.ID,
                name = file.Name,
                contents = fileContents
            });
        }


        [AjaxAuthorize]
        [HttpPost]
        // TODO: Support the creating of files inside folders
        public ActionResult CreateFile(int projectID, string fileName)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return HttpNotFound();
            }

            var fileSystem = CreateFileSystem(project.RootID);
            var fileExt = System.IO.Path.GetExtension(fileName);

            if (!ItemExists(fileSystem, "/root/"+ fileName))
            {
                string contentType = null;

                switch (fileExt)
                {
                    case "css":
                        contentType = "text/css";
                        break;
                    case "html":
                        contentType = "text/html";
                        break;
                }

                var file = fileSystem.Root.Files.Add(fileName, contentType);
                return Json(new
                {
                    result = true,
                    fileID = file.ID
                });
            }

            return Json(new
            {
                result = false
            });
        }


        public ActionResult WriteFile(int projectID, string fileID, string contents)
        {
            var project = Db.Projects.Find(projectID);
            if (project == null)
            {
                return HttpNotFound();
            }

            bool result = true;
            var fileSystem = CreateFileSystem(project.RootID);
            var file = fileSystem.Root.FindItemByID(fileID) as File;

            if (file == null)
            {
                result = false;
            }

            try
            {
                file.WriteContents(contents);
            }
            catch (Exception)
            {
                result = false;
            }

            return Json(new
            {
                result = result
            });
        }




        private List<File> GetFilesByContentType(string contentType, Folder parent)
        {
            var result = new List<File>();
            IEnumerable<File> files;

            foreach (Folder folder in parent.Folders)
            {
                files = GetFilesByContentType(contentType, folder);
                result.AddRange(files);
            }

            files = parent.Files.Where(f => f.ContentType == contentType);
            result.AddRange(files);

            return result;
        }

        private bool ItemExists(FileSystem fileSystem, string path)
        {
            var item = fileSystem.Root.FindItemByPath(path);
            return item != null;
        }
    }
}
