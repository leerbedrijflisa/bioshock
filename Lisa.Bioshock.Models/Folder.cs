using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Lisa.Bioshock.Models
{
    public class Folder : ProjectItem
    {
        public override ProjectItemType Type
        {
            get
            {
                return ProjectItemType.Folder;
            }
        }

        public Folder(Project project)
            : base(project)
        {
        }

        public Folder(Project project, string name)
            :base(project, name)
        {

        }
    }
}