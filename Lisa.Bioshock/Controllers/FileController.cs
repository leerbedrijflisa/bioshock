using Lisa.Bioshock.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class FileController : Controller
    {
        BioshockContext db = new BioshockContext();
        //
        // GET: /File/

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

                Models.File file = new Models.File(project);
                file.Name = name;
                db.Files.Add(file);
                db.SaveChanges();
                return RedirectToAction("Details", "Project", new { id = projectid });
            }
            return View((object)name);
        }

    }
}
