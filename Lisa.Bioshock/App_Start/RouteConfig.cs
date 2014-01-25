using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Lisa.Bioshock
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "GetFileContents",
                "Project/{projectID}/File/{*fileName}",
                new
                {
                    controller = "Project",
                    action = "GetFileContents",
                    fileName = UrlParameter.Optional
                },
                new
                {
                    projectID = @"\d+"
                }
            );

            //routes.MapRoute(
            //    name: "AjaxFiles",
            //    url: "ajax/files/{task}",
            //    defaults: new { controller = "Ajax", action = "Files", task = UrlParameter.Optional }
            //);

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}