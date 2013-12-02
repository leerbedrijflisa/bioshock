using Newtonsoft.Json;
using System.Security.Claims;

namespace Lisa.Bioshock.Modules
{
    public class ClaimsTransformationModule : ClaimsAuthenticationManager
    {
        public ClaimsTransformationModule()
            : base()
        {            
        }

        public override ClaimsPrincipal Authenticate(string resourceName, 
            ClaimsPrincipal incomingPrincipal)
        {
            if (incomingPrincipal != null &&
                incomingPrincipal.Identity.IsAuthenticated)
            {
                var identity = (ClaimsIdentity)incomingPrincipal.Identity;

                identity.AddClaim(
                    new Claim("http://lisa/applications/bioshock", "allowed"));
                identity.AddClaim(
                    new Claim("http://lisa/applications/zuma", "denied"));
            }

            return base.Authenticate(resourceName, incomingPrincipal);
        }
    }
}