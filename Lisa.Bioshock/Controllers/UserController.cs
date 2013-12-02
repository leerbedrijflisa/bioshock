using System;
using System.Collections.Generic;
using System.IdentityModel.Services;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class UserController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult Login()
        {
            return RedirectToAction("Index");
        }
                
        public ActionResult Logoff()
        {
            FederatedAuthentication.WSFederationAuthenticationModule.SignOut(false);

            var uri = new Uri(FederatedAuthentication.WSFederationAuthenticationModule.Issuer);
            var reply = FederatedAuthentication.WSFederationAuthenticationModule.Realm;
            var signOutRequest = new SignOutRequestMessage(uri, reply);

            return new RedirectResult(signOutRequest.WriteQueryString());
        }
    }
}
