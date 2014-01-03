using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class HomeController : BaseController
    {
        //
        // GET: /Home/
        public ActionResult Index(int? ID)
        {
            if (ID == null)
            {
                
                return RedirectToAction("Index", "Project");
            }
            var project = Db.Projects.Find(ID);

            if (project == null)
            {
                return HttpNotFound();
            }

            return View(project);
        }

        [Authorize]
        public ActionResult TestAuthentication()
        {
            return Content("<h1>Authorized!</h1>");
        }

        public ActionResult Fullscreen(int? ID, string GUID)
        {
            if (ID == null)
            {
                return RedirectToAction("Index", "Project");
            }
            ViewBag.ProjectID = ID;
            ViewBag.File = GUID;
            return View();
        }

    }
}
