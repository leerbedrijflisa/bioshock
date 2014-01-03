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

            LocalStorageProvider provider = new LocalStorageProvider("/Storage/" + project.RootID);
            FileSystem fileSystem = new FileSystem(provider);

            fileSystem.Root.FindItemByID(FileID);
            return View(project);
        }

    }
}
