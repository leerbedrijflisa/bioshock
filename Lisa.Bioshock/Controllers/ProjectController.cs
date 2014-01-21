using Lisa.Bioshock.Data.Tables;
using Lisa.Bioshock.Models;
using Lisa.Storage;
using Lisa.Storage.Data;
using Lisa.Storage.Data.Web;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    //[Authorize]
    public partial class ProjectController : BaseController
    {
        //
        // GET: /Project/

        public ActionResult Index()
        {
            return View(CurrentUser.Projects.Where(p => !p.IsDeleted));
        }

        public ActionResult Create()
        {
            return View(new ProjectForm());
        }

        [HttpPost]
        public ActionResult Create(ProjectForm form)
        {
            if (ModelState.IsValid)
            {
                Project project = new Project()
                {
                    Name = form.Name,
                    Owner = CurrentUser
                };

                Db.Projects.Add(project);
                Db.SaveChanges();

                return RedirectToAction("Index", "Home", new { ID = project.ID });
            }

            return View(form);
        }

        public ActionResult Details(int id =0)
        {
            Project project = Db.Projects.Find(id);

            if (project == null)
            {
                return HttpNotFound();
            }

            ViewBag.FileSystem = GetFileSystem(project.RootID);
            return View(project);
        }

        public ActionResult Delete(int id = 0)
        {
            Project project = Db.Projects.Find(id);

            if (project == null)
            {
                return HttpNotFound();
            }

            return View(project);
        }

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id = 0)
        {
            Project project = Db.Projects.Find(id);

            if (project == null)
            {
                return HttpNotFound();
            }

            project.IsDeleted = true;
            Db.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}
