using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Lisa.Bioshock.Models
{
    public class File : ProjectItem
    {
        public Guid Guid { get; set; }
        public string MimeType { get; set; }
        public string ContainerName { get; set; }

        [NotMapped]
        public string Content { get; set; }

        public override ProjectItemType Type
        {
            get
            {
                return ProjectItemType.File;
            }
        }

        public File(Project project)
            : base(project)
        {
            MimeType = "text/plain";
        }

        public File(Project project, string name)
            : base(project, name)
        {
            MimeType = "text/plain";
        }
    }
}