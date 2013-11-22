﻿using Lisa.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Lisa.Bioshock.ActionResults
{
    public class JsonItemResult : JsonResult
    {
        public JsonItemResult(IEnumerable<StorageItem> items)
        {
            var result = new List<dynamic>();

            foreach (var item in items)
            {
                GenerateJson(result, item);
            }

            this.ContentType = "application/json";
            this.JsonRequestBehavior = System.Web.Mvc.JsonRequestBehavior.AllowGet;
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