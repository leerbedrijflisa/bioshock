using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Lisa.Skyrim;
using Lisa.Daggerfall;
using System.IO;

namespace Lisa.Bioshock.Controllers
{
    public class ValidateController : Controller
    {        
        [ValidateInput(false)]
        [HttpGet]
        public JsonResult ValidateHTML(string source)
        {
            var returnVal = new JsonResult();
            returnVal.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            if (source != null)
            {
                var checker = new HtmlChecker();
                var result = checker.Check(new StringReader(source), "");
                // Temporary fix! Invalid <li> after <ul> will not be shown.
                result.RemoveAll(error => error.Code.Language == Checkers.LanguageType.Html && error.Code.Number == 30);
                
                returnVal = Json(result, JsonRequestBehavior.AllowGet);
            }
            return returnVal;
        }

        [ValidateInput(false)]
        [HttpGet]
        public JsonResult ValidateCSS(string source)
        {
            var returnVal = new JsonResult();
            returnVal.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            if (source != null)
            {
                var checker = new CSSChecker();
                var result = checker.Check(new StringReader(source), "");
                returnVal = Json(result, JsonRequestBehavior.AllowGet);
            }
            return returnVal;
        }

    }
}
