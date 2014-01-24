using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.ActionResults
{
    public class JsonErrorResult : JsonResult
    {
        public JsonErrorResult(string errorMessage)
            : this(errorMessage, null)
        {
        }

        public JsonErrorResult(string errorMessage, IEnumerable<KeyValuePair<string, dynamic>> extraValues)
        {
            this.ContentType = "application/json";
            this.JsonRequestBehavior = JsonRequestBehavior.AllowGet;

            var values = new Dictionary<string,dynamic>() {
                { "result", false },
                { "errorMessage", errorMessage },
            };

            if (extraValues != null)
            {
                foreach (var keyValuePair in extraValues)
                {
                    values.Add(keyValuePair.Key, keyValuePair.Value);
                }
            }

            this.Data = values;
        }
    }
}