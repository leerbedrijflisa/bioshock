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
    public class UserController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult Login()
        {
            using (var db = new BioshockContext())
            {

                var identity = (ClaimsIdentity)User.Identity;
                var customerName = identity
                    .Claims
                    .FirstOrDefault(cl => cl.Type == LisaClaimTypes.CustomerLocation);

                var customerUserId = identity
                    .Claims
                    .FirstOrDefault(cl => cl.Type == LisaClaimTypes.CustomerUserID);

                var customers = db.Customers;
                var currentCustomer = customers.FirstOrDefault(cust => cust.Name == customerName.Value);

                if (currentCustomer == null)
                {
                    var cust = new Customer()
                    {
                        Name = customerName.Value
                    };

                    db.Customers.Add(cust);
                    db.SaveChanges();
                }

                currentCustomer = customers.FirstOrDefault(cust => cust.Name == customerName.Value);

                var value = customerUserId.Value;
                if (currentCustomer.Users.Count(u => u.CustomerUserID == value) == 0)
                {
                    var user = new User()
                    {
                        CustomerUserID = customerUserId.Value
                    };

                    currentCustomer.Users.Add(user);
                    db.SaveChanges();
                }
            }

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
