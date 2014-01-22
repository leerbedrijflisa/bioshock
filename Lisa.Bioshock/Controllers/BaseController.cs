using Lisa.Bioshock.Data;
using Lisa.Bioshock.Data.Tables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using Lisa.Storage;
using Lisa.Storage.Data;
using Lisa.Storage.Data.Web;
using System.Configuration;

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

            //if (User.Identity.IsAuthenticated)
            //{
            //    var identity = (ClaimsIdentity)User.Identity;
            //    var customerName = identity
            //        .Claims
            //        .FirstOrDefault(cl => cl.Type == LisaClaimTypes.CustomerName);

            //    var customerUserId = identity
            //        .Claims
            //        .FirstOrDefault(cl => cl.Type == LisaClaimTypes.CustomerUserID);

            //    var customers = Db.Customers;
            //    var currentCustomer = customers
            //        .FirstOrDefault(cust => cust.Name == customerName.Value);

            //    if (currentCustomer != null)
            //    {
            //        var value = customerUserId.Value;
            //        var user = currentCustomer.Users.FirstOrDefault(u => u.CustomerUserID == value);
            //        if (user == null)
            //        {
            //            user = new User()
            //            {
            //                CustomerUserID = customerUserId.Value
            //            };

            //            currentCustomer.Users.Add(user);
            //            Db.SaveChanges();
            //        }

            //        CurrentUser = user;
            //        ViewBag.CurrentUser = CurrentUser;
            //    }                
            //}
            //var identity = (ClaimsIdentity)User.Identity;

            //var customerUserId = identity.Claims
            //    .FirstOrDefault(cl => cl.Type == LisaClaimTypes.CustomerUserID);

            //if (customerUserId != null)
            //{
            //    CurrentUser = Db.Users.FirstOrDefault(u => u.CustomerUserID == customerUserId.Value);
            //    ViewBag.CurrentUser = CurrentUser;
            //}

            CurrentUser = Db.Users.Find(1);
            ViewBag.CurrentUser = CurrentUser;
        }

        protected string GetContentType(string fileName)
        {
            if(string.IsNullOrEmpty(fileName))
            {
                return null;
            }

            string fileExt = System.IO.Path.GetExtension(fileName);

            switch(fileExt)
            {
                case "htm":
                case "html":
                    return "text/html";

                case "css":
                    return "text/css";

                //case "js":
                //    return "text/javascript";

                //case "php":
                //    return "text/php";

                case null:
                case "":
                default:
                    return null;
            }
        }

        protected override void Dispose(bool disposing)
        {
            Db.Dispose();
            base.Dispose(disposing);
        }

    }
}
