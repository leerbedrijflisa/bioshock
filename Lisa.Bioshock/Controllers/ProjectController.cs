using Lisa.Bioshock.Data.Tables;
using Lisa.Bioshock.Helpers;
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
            var currentUser = CurrentUser.Projects.Where(p => !p.IsDeleted);
            return View(currentUser);
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

                FileSystem fileSystem = FileSystemHelper.GetFileSystem(project.RootID);
                File index = fileSystem.Root.Files.Add("index.html", "text/html");
                project.LastOpenedFile = Guid.Parse(index.ID);

                Db.SaveChanges();

                return RedirectToAction("Details", "Project", new { ID = project.ID });
            }

            return View(form);
        }

        public ActionResult Details(int id = 0)
        {
            var project = Db.Projects.Find(id);
            if (project == null)
            {
                return RedirectToAction("Index", "Project");
            }

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
