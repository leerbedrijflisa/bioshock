using Lisa.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Lisa.Bioshock.Models;

namespace Lisa.Bioshock.ActionResults
{
    public class JsonStorageItemResult : JsonResult
    {
        public const int TypeFolder = 1;
        public const int TypeFile = 2;

        private JsonStorageItemResult()
        {
            this.ContentType = "application/json";
            this.JsonRequestBehavior = System.Web.Mvc.JsonRequestBehavior.AllowGet;
        }

        public JsonStorageItemResult(IEnumerable<StorageItem> items)
            : this()
        {
            var builder = new JsonStorageItemBuilder();
            this.Data = builder.BuildJson(items);
        }

        public JsonStorageItemResult(Folder root)
            : this()
        {
            var builder = new JsonStorageItemBuilder();
            this.Data = builder.BuildJson(root);
        }
    }
}