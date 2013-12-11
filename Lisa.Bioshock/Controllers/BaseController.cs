using Lisa.Bioshock.Data;
using Lisa.Bioshock.Data.Tables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.Controllers
{
    public abstract class BaseController : Controller
    {
        public BioshockContext Db
        {
            get;
            set;
        }

        public User CurrentUser
        {
            get;
            set;
        }

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);
            
            Db = new BioshockContext();

            if (User.Identity.IsAuthenticated)
            {
                var identity = (ClaimsIdentity)User.Identity;
                var customerName = identity
                    .Claims
                    .FirstOrDefault(cl => cl.Type == LisaClaimTypes.CustomerName);

                var customerUserId = identity
                    .Claims
                    .FirstOrDefault(cl => cl.Type == LisaClaimTypes.CustomerUserID);

                var customers = Db.Customers;
                var currentCustomer = customers
                    .FirstOrDefault(cust => cust.Name == customerName.Value);

                if (currentCustomer != null)
                {
                    var value = customerUserId.Value;
                    var user = currentCustomer.Users.FirstOrDefault(u => u.CustomerUserID == value);
                    if (user == null)
                    {
                        user = new User()
                        {
                            CustomerUserID = customerUserId.Value
                        };

                        currentCustomer.Users.Add(user);
                        Db.SaveChanges();
                    }

                    CurrentUser = user;
                    ViewBag.CurrentUser = CurrentUser;
                }                
            }
            //var identity = (ClaimsIdentity)User.Identity;

            //var customerUserId = identity.Claims
            //    .FirstOrDefault(cl => cl.Type == LisaClaimTypes.CustomerUserID);

            //if (customerUserId != null)
            //{
            //    CurrentUser = Db.Users.FirstOrDefault(u => u.CustomerUserID == customerUserId.Value);
            //    ViewBag.CurrentUser = CurrentUser;
            //}
        }

        protected override void Dispose(bool disposing)
        {
            Db.Dispose();
            base.Dispose(disposing);
        }

    }
}
