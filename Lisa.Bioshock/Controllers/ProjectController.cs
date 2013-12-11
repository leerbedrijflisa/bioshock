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
    [Authorize]
    public class ProjectController : BaseController
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

                LocalStorageProvider sp 
                    = new LocalStorageProvider(@"D:\Storage\" + project.RootID + @"\");
                FileSystem fs = new FileSystem(sp);

                fs.Root.Folders.Add("css");
                var file = fs.Root.Files.Add("index.html", "text/html");

                using (var writer = new System.IO.StreamWriter(file.OutputStream))
                {
                    writer.Write("<!DOCTYPE html>\n<html>\n<body>\n\t<h1>My website</h1>\n</body>\n</html>");
                }

                return RedirectToAction("Details", new { ID = project.ID });
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

            LocalStorageProvider sp 
                = new LocalStorageProvider(@"D:\Storage\" + project.RootID + @"\");
            FileSystem fs = new FileSystem(sp);
            ViewBag.FileSystem = fs;

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
