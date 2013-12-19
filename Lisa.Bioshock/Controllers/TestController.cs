using Lisa.Bioshock.ActionResults;
using Lisa.Bioshock.Models;
using Lisa.Storage;
using Lisa.Storage.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace Lisa.Bioshock.Controllers
{
    public class TestController : BaseController
    {
        LocalStorageProvider provider;
        FileSystem fileSystem;
        Lisa.Storage.File file;

        [ValidateInput(false)]
        [HttpGet]
        public JsonResult GetFiles(int projectID, string contentType = null)
        {
            var project = Db.Projects.Find(projectID);

            LocalStorageProvider provider = new LocalStorageProvider("/Storage/" + project.RootID);
            FileSystem fileSystem = new FileSystem(provider);

            if (contentType != null)
            {
                return new JsonStorageItemResult(GetFilesByContentType(contentType, fileSystem.Root));
            }

            return new JsonStorageItemResult(fileSystem.Root);
        }

        private List<Storage.File> GetFilesByContentType(string contentType, Folder parentFolder)
        {
            List<Storage.File> files = new List<Storage.File>();

            foreach (Folder folder in parentFolder.Folders)
            {
                files.AddRange(GetFilesByContentType(contentType, folder));
            }

            files.AddRange(parentFolder.Files.Where(f => f.ContentType == contentType));

            return files;

        }

        [HttpPost]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetFileContent(int projectID, string guid)
        {
            var project = Db.Projects.Find(projectID);

            LocalStorageProvider provider = new LocalStorageProvider("/Storage/" + project.RootID);
            FileSystem fileSystem = new FileSystem(provider);

            var file = fileSystem.Root.FindItemByID(guid) as Lisa.Storage.File;
            if (file == null)
            {
                return HttpNotFound();
            }

            var content = string.Empty;
            var filename = file.Name;
            using (var contents = new StreamReader(file.InputStream))
            {
                content = contents.ReadToEnd();
            }
        
            return Json(new
            {
                id = file.ID,
                name = filename,
                content = content
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult OpenStartUpFile(int projectID)
        {
            var project = Db.Projects.Find(projectID);

            return GetFileContent(projectID, project.LastOpenedFile.ToString());
        }

        public ActionResult CreateFile(int projectID, string filename)
        {
            var project = Db.Projects.Find(projectID);

            LocalStorageProvider provider = new LocalStorageProvider("/Storage/" + project.RootID);
            FileSystem fileSystem = new FileSystem(provider);

            if (!FileExists(fileSystem, filename))
            {
                if (filename.EndsWith(".css"))
                    file = fileSystem.Root.Files.Add(filename, "text/css");
                else if (filename.EndsWith(".html"))
                    file = fileSystem.Root.Files.Add(filename, "text/html");
                return Json(new
                {
                    Result = true,
                    guid = file.ID
                }, JsonRequestBehavior.AllowGet);
            }
        

            return Json(new { Result = false}, JsonRequestBehavior.AllowGet);
        }

        private bool FileExists(FileSystem filesystem, string filename)
        {
            var file = fileSystem.Root.FindItemByPath("/root/" + filename) as Lisa.Storage.File;
            return file != null;
        }

        [ValidateInput(false)]
        [HttpPost]
        public ActionResult WriteFile(int projectID, string guid, string source)
        {
            var project = Db.Projects.Find(projectID);

            LocalStorageProvider provider = new LocalStorageProvider("/Storage/" + project.RootID);
            FileSystem fileSystem = new FileSystem(provider);

            var file = fileSystem.Root.FindItemByID(guid) as Lisa.Storage.File;
            var content = string.Empty;
            using (var contents = new StreamWriter(file.OutputStream))
            {
                contents.Write(source);
                contents.BaseStream.SetLength(source.Length);
                contents.Flush();
            }

            return Json(null);
        }
    }
}
