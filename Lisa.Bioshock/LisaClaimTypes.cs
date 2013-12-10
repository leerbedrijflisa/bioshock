using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Lisa.Bioshock
{
    public static class LisaClaimTypes
    {
        public const string CustomerLocation = "http://lisa/customer/location";
        public const string CustomerName = "http://lisa/customer/name";
        public const string CustomerUserID = "http://lisa/customer/user/id";
        public const string UserID = System.Security.Claims.ClaimTypes.Name;
    }
}