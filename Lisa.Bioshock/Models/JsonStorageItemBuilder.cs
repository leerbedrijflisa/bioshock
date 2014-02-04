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
        public sealed class FileProperties
        {
            public string contentType { get; set; }
            public string contents { get; set; }
        }

        public sealed class FolderProperties
        {
            public IEnumerable<dynamic> items { get; set; }
        }

        public const int TypeFolder = 1;
        public const int TypeFile = 2;

        public JsonStorageItemBuilder()
        {
        }

        public dynamic BuildJson(StorageItem item)
        {
            return BuildJson(item);
        }

        public dynamic BuildJson(Folder folder)
        {
            return BuildJsonFolder(folder);
        }

        public dynamic BuildJson(File file, bool readContents = false)
        {
            var json = BuildJsonItem(file);

            if (readContents)
            {
                json.fileProps.contents = file.ReadContents();
            }

            return json;
        }

        public dynamic BuildJson(IEnumerable<StorageItem> items)
        {
            List<dynamic> data = new List<dynamic>();
            foreach (var item in items)
            {
                if (item is Folder)
                {
                    data.Add(this.BuildJsonFolder((Folder)item));
                }
                else
                {
                    data.Add(this.BuildJsonItem(item));
                }
            }
            return data;
        }

        private dynamic BuildJsonFolder(Folder folder)
        {
            var json = this.BuildJsonItem(folder);
            var jsonChildren = this.BuildJson(folder.Items);

            json.folderProps.items.AddRange(jsonChildren);
            return json;
        }

        private dynamic BuildJsonItem(StorageItem item)
        {
            return new
            {
                id = item.ID,
                name = item.Name,
                path = item.Path,
                fullPath = item.FullPath,
                type = (item is Folder ? TypeFolder : TypeFile),
                folderProps = new FolderProperties
                {
                    items = new List<dynamic>()
                },
                fileProps = new FileProperties
                {
                    contentType = (item is File ? ((File)item).ContentType : null),
                    contents = string.Empty
                }
            };
        }
    }
}