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
            var project = Db.Projects.Find(ID);
            return View(project);
        }

        [Authorize]
        public ActionResult TestAuthentication()
        {
            return Content("<h1>Authorized!</h1>");
        }

        public ActionResult Fullscreen()
        {

            return View();
        }

    }
}
