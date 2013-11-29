using Newtonsoft.Json;
using System.Security.Claims;

namespace Lisa.Bioshock.Modules
{
    public class ClaimsTransformationManager : ClaimsAuthenticationManager
    {
        public ClaimsTransformationManager()
            : base()
        {            
        }

        public override ClaimsPrincipal Authenticate(string resourceName, 
            ClaimsPrincipal incomingPrincipal)
        {
            return base.Authenticate(resourceName, incomingPrincipal);
        }
    }
}