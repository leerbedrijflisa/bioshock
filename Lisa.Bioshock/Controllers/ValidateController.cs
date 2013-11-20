using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Lisa.Skyrim;
using System.IO;

namespace Lisa.Bioshock.Controllers
{
    public class ValidateController : Controller
    {        
        [ValidateInput(false)]
        [HttpGet]
        public JsonResult Validate(string source)
        {
            var returnVal = new JsonResult();
            returnVal.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            if (source != null)
            {
                var checker = new HtmlChecker();
                var result = checker.Check(new StringReader(source), "");
                returnVal = Json(result, JsonRequestBehavior.AllowGet);
            }
            return returnVal;
        }

    }
}
