using Lisa.Storage;
using Lisa.Storage.Data.Web;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Lisa.Bioshock.Helpers
{
    public static class FileSystemHelper
    {
        public static FileSystem GetFileSystem(string rootID)
        {
            var provider = new CloudStorageProvider
            (
                ConfigurationManager.AppSettings["CloudStorageConnectionString"],
                "bioshock",
                rootID.ToString()
            );

            return new FileSystem(provider);
        }

        public static FileSystem GetFileSystem(Guid rootID)
        {
            return FileSystemHelper.GetFileSystem(rootID.ToString());
        }
    }
}