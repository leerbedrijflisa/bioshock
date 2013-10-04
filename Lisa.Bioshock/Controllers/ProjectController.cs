using Lisa.Bioshock.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class ProjectController : Controller
    {
        BioshockContext db = new BioshockContext();
        //
        // GET: /Project/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(string name)
        {
            if (ModelState.IsValid)
            {
                Project project = new Project();
                project.Name = name;
                db.Projects.Add(project);
                db.SaveChanges();
                return RedirectToAction("Details", new { id = project.ID });
            }
            return View((object)name);
        }

        public ActionResult Details(int id = 0)
        {
           var project = db.Projects.Find(id);
           if (project == null)
           {
               return HttpNotFound();
           }

           return View(project);
        }

    }
}
