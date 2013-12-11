using Lisa.Bioshock.Data;
using Lisa.Bioshock.Data.Tables;
using System;
using System.Collections.Generic;
using System.IdentityModel.Services;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public class UserController : BaseController
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
