using Lisa.Bioshock.ActionResults;
using Lisa.Storage;
using Lisa.Storage.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class TestController : Controller
    {
        LocalStorageProvider provider;
        FileSystem fileSystem;
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
            foreach (File file in parent.Files)
            {
                s += "<li>" + file.Name + "</li>";
            }

            s += "</ul>";

            return s;
        }

        [ValidateInput(false)]
        [HttpGet]
        public JsonResult GetFiles()
        {
            LocalStorageProvider provider = new LocalStorageProvider("/Storage");
            FileSystem fileSystem = new FileSystem(provider);

            //fileSystem.Root.Files.Add("index.html", "text/html");
            //fileSystem.Root.Files.Add("user.xml", "text/xml");
            //Folder css = fileSystem.Root.Folders.Add("css");
            //css.Files.Add("stylesheet.css", "text/css");
            //var theme = css.Folders.Add("theme");
            //theme.Files.Add("custom.css", "text/css");
            //theme.Files.Add("default.css", "text/css");
            //theme.Files.Add("admin.css", "text/css");
            
            return new JsonItemResult(fileSystem.Root.Items);
        }

        public ActionResult CreateFile(string filename)
        {
            LocalStorageProvider provider = new LocalStorageProvider("/Storage");
            FileSystem fileSystem = new FileSystem(provider);
            
            if(filename.EndsWith(".css"))
                fileSystem.Root.Files.Add(filename, "text/css");
            else if(filename.EndsWith(".html"))
                fileSystem.Root.Files.Add(filename, "text/html");

            return Json(new { Result = true });
        }
    }
}
