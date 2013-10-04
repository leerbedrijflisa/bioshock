using Lisa.Bioshock.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class FolderController : Controller
    {
        BioshockContext db = new BioshockContext();
        //
        // GET: /Folder/

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Create(int projectid)
        {
            ViewBag.ProjectID = projectid;
            return View();
        }

        [HttpPost]
        public ActionResult Create(string name, int projectid)
        {
            if (ModelState.IsValid)
            {
                Project project = db.Projects.Find(projectid);
                if (project == null)
                {
                    return HttpNotFound();
                }

                Folder folder = new Folder(project);
                folder.Name = name;
                db.Folders.Add(folder);
                db.SaveChanges();
                return RedirectToAction("Details", "Project", new { id = projectid });
            }
            return View((object)name);
        }

    }
}
