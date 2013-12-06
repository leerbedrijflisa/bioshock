using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {

            return View();
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
