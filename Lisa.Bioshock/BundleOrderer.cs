using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Hosting;
using System.Web.Optimization;

namespace Lisa.Bioshock
{
    public class BundleOrderer : IBundleOrderer
    {
        public List<string> ExcludedDependencies = new List<string>();

        public IEnumerable<FileInfo> OrderFiles(BundleContext context, IEnumerable<FileInfo> files)
        {
            //var dependencyList = new List<string>();
            var appPath = HostingEnvironment.MapPath("~/");
            var result = new List<FileInfo>();

            foreach (var file in files)
            {
                var field = new Field();
                field.File = file;
                field.VirtualPath = file.FullName.Substring(appPath.Length)
                    .Replace('\\', '/')
                    .Insert(0, "~/");

                string content = string.Empty;
                using (var reader = new StreamReader(file.OpenRead()))
                {
                    content = reader.ReadToEnd();
                }

                var dir = HostingEnvironment.VirtualPathProvider.GetDirectory(field.VirtualPath);
                var matches = regex.Matches(content);
                foreach (Match match in matches)
                {
                    var relPath = match.Groups["path"].Value;

                    field.Dependencies.Add(relPath);

                    relPath = relPath.Replace(".d.ts", ".js").Replace(".ts", ".js")
                        .Substring(relPath.LastIndexOf("/") + 1);
                    
                    var dep = files.FirstOrDefault(x => x.FullName.Contains(relPath));
                    if (dep != null && !result.Exists(x => x.FullName == dep.FullName))
                    {
                        result.Insert(0, dep);
                    }
                }

                if (!result.Exists(x => x.FullName == file.FullName))
                {
                    result.Add(file);
                }
            }

            return result;
        }

        private static readonly Regex regex = 
            new Regex(@"///\s*<reference\s+path=""(?<path>[^""]*)""\s*/>");
    }

    internal class Field
    {
        public string VirtualPath;
        public List<string> Dependencies = new List<string>();
        public FileInfo File;
    }
}