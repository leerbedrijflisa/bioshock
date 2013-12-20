using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Lisa.Storage;
using Lisa.Bioshock.Extensions;

namespace Lisa.Bioshock.Models
{
    public class JsonStorageItemBuilder
    {
        public const int TypeFolder = 1;
        public const int TypeFile = 2;

        public JsonStorageItemBuilder()
        {
        }


        public dynamic BuildJson(StorageItem item)
        {
            if (item is Folder)
            {
                return this.BuildJsonFromFolder((Folder)item);
            }
            return this.BuildJsonFromItem(item);
        }

        public dynamic BuildJson(File file, bool readContents = false)
        {
            dynamic json = this.BuildJsonFromItem(file);

            if (readContents)
            {
                json.fileProps.contents = file.ReadContents();
            }

            return json;
        }

        public dynamic BuildJson(IEnumerable<StorageItem> items)
        {
            return this.BuildJsonFromCollection(items);
        }

        public dynamic BuildJson(Folder folder)
        {
            return this.BuildJsonFromFolder(folder);
        }



        private dynamic BuildJsonFromCollection(IEnumerable<StorageItem> items)
        {
            List<dynamic> data = new List<dynamic>();
            foreach (var item in items)
            {
                if (item is Folder)
                {
                    data.Add(this.BuildJsonFromFolder((Folder)item));
                }
                else
                {
                    data.Add(this.BuildJsonFromItem(item));
                }
            }
            return data;
        }


        private dynamic BuildJsonFromFolder(Folder folder)
        {
            var json = this.BuildJsonFromItem(folder);
            var jsonChildren = this.BuildJsonFromCollection(folder.Items);

            json.folderProps.items.AddRange(jsonChildren);

            return json;
        }

        private dynamic BuildJsonFromItem(StorageItem item)
        {
            var items = new List<dynamic>();

            return new
            {
                // old
                ID = item.ID,
                Name = item.Name,
                Path = item.Path,
                FullPath = item.FullPath,
                Type = (item is Folder ? "Folder" : "File"),
                Subs = items,

                // new
                id = item.ID,
                name = item.Name,
                path = item.Path,
                fullPath = item.FullPath,
                type = (item is Folder ? TypeFolder : TypeFile),
                folderProps = new
                {
                    items = items
                },
                fileProps = new
                {
                    contentType = (item is File ? ((File)item).ContentType : null),
                    contents = string.Empty
                }
            };
        }
    }
}