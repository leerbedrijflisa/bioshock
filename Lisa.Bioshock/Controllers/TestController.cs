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
        //
        // GET: /Test/
        public string Index()
        {
            LocalStorageProvider provider = new LocalStorageProvider("/Storage");
            FileSystem fileSystem = new FileSystem(provider);

            fileSystem.Root.Files.Add("index.html", "text/html");
            Folder css = fileSystem.Root.Folders.Add("css");
            css.Files.Add("stylesheet.css", "text/css");
            
            return Loop(fileSystem.Root);
        }

        private string Loop(Folder parent)
        {
            string s = "<ul>";
            foreach (Folder folder in parent.Folders)
            {
                s += "<li>" + folder.Name + Loop(folder) + "</li>";
            }
            foreach (Lisa.Storage.File file in parent.Files)
            {
                s += "<li>" + file.Name + "</li>";
            }

            s += "</ul>";

            return s;
        }

        [ValidateInput(false)]
        [HttpGet]
        public JsonResult GetFiles(int projectID, string contentType = null)
        {
            var project = Db.Projects.Find(projectID);

            LocalStorageProvider provider = new LocalStorageProvider("/Storage/" + project.RootID);
            FileSystem fileSystem = new FileSystem(provider);

            if (contentType != null)
            {
                return new JsonItemResult(GetFilesByContentType(contentType, fileSystem.Root));
            }

            return new JsonItemResult(fileSystem.Root.Items);
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

            var file = fileSystem.Root.Files.Where(f => f.ID == guid).FirstOrDefault();
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

        public bool FileExists(FileSystem filesystem, string filename)
        {
            if (filesystem != null)
            {
                foreach (Storage.File file in filesystem.Root.Files)
                {
                    if (file.Name == filename)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        [ValidateInput(false)]
        [HttpPost]
        public ActionResult WriteFile(int projectID, string guid, string source)
        {
            var project = Db.Projects.Find(projectID);

            LocalStorageProvider provider = new LocalStorageProvider("/Storage/" + project.RootID);
            FileSystem fileSystem = new FileSystem(provider);

            var file = fileSystem.Root.Files.Where(f => f.ID == guid).FirstOrDefault();
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
