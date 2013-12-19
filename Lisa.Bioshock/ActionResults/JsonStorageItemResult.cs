using Lisa.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.ActionResults
{
    public class JsonStorageItemResult : JsonResult
    {
        private JsonStorageItemResult()
        {
            this.ContentType = "application/json";
            this.JsonRequestBehavior = System.Web.Mvc.JsonRequestBehavior.AllowGet;
        }

        public JsonStorageItemResult(IEnumerable<StorageItem> items)
            : this()
        {
            var result = new List<dynamic>();

            foreach (var item in items)
            {
                GenerateJson(result, item);
            }
            this.Data = result;
        }

        public JsonStorageItemResult(Folder root)
            : this()
        {
            var result = new List<dynamic>();
            GenerateJson(result, root);
            this.Data = result;
        }

        private void GenerateJson(List<dynamic> json, StorageItem item)
        {
            dynamic node = new
            {
                ID = item.ID,
                Name = item.Name,
                Path = item.Path,
                FullPath = item.FullPath,
                Type = (item is Folder ? "Folder" : "File"),
                Subs = new List<dynamic>()
            };

            if (item is Folder)
            {
                var subs = new List<dynamic>();

                foreach (var child in ((Folder)item).Items)
                {
                    GenerateJson(subs, child);
                }

                node.Subs.AddRange(subs);
            }

            json.Add(node);
        }
    }
}