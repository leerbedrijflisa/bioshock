using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.IdentityModel.Services;
using System.IdentityModel.Tokens;

namespace Lisa.Bioshock
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {

            RouteTable.Routes.MapHubs();
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            FederatedAuthentication.SessionAuthenticationModule.SessionSecurityTokenReceived +=
                SessionAuthenticationModule_SessionSecurityTokenReceived;
        }

        protected void SessionAuthenticationModule_SessionSecurityTokenReceived(object sender,
            SessionSecurityTokenReceivedEventArgs e)
        {
            var sessionToken = e.SessionToken;
            var utcNow = DateTime.UtcNow;

            if (sessionToken.ValidTo > utcNow)
            {
                // Create new token to extend the timeout by adding 20 seconds to the max timeout
                // utcNow.AddSeconds(20) at every request made.
                e.SessionToken = new SessionSecurityToken(
                    sessionToken.ClaimsPrincipal,
                    sessionToken.Context,
                    sessionToken.ValidFrom,
                    utcNow.AddSeconds(20));

                e.ReissueCookie = true;
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("Token Expired");
            }
        }
    }
}