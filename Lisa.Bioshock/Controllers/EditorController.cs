using Lisa.Storage;
using Lisa.Storage.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class EditorController : BaseController
    {
        //
        // GET: /Editor/

        public ActionResult Fullscreen()
        {
            int ProjectID = int.Parse(Request.QueryString["project"]);
            string FileID = Request.QueryString["file"];
            var project = Db.Projects.Find(ProjectID);

            IStorageProvider provider = CreateStorageProvider(project);
            FileSystem fileSystem = new FileSystem(provider);

            var file = fileSystem.Root.FindItemByID(FileID);
            ViewBag.Project = project;
            return View(file);
        }

    }
}
