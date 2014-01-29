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
            this.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
        }

        public JsonStorageItemResult(IEnumerable<StorageItem> items)
            : this()
        {
            var builder = new JsonStorageItemBuilder();
            this.Data = new
            {
                result = true,
                items = builder.BuildJson(items)
            };
        }

        public JsonStorageItemResult(Folder folder)
            : this()
        {
            var builder = new JsonStorageItemBuilder();
            this.Data = this.Data = new
            {
                result = true,
                items = new [] { builder.BuildJson(folder) }
            };
        }

        public JsonStorageItemResult(File file, bool readContents)
            : this()
        {
            var builder = new JsonStorageItemBuilder();
            this.Data = new
            {
                result = true,
                items = new [] { builder.BuildJson(file, readContents) }
            };
        }
    }
}