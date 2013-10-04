using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Lisa.Bioshock.Models
{
    public abstract class ProjectItem
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public virtual ProjectItemCollection Items { get { return items; } set { items = value; } }
        public int? ParentID { get; set; }
        public virtual ProjectItem Parent { get; set; }

        public virtual Project Project { get { return project; } }

        private ProjectItemCollection items;
        internal Project project;

        public ProjectItem(Project project)
        {
            this.project = project;
            items = new ProjectItemCollection(Project, Parent);
        }

        public ProjectItem(Project project, string name)
            : this(project)
        {
            Name = name;
        }

        public string Path
        {
            get
            {
                if (Parent != null)
                {
                    return Parent.FullPath;
                }

                if (Project != null)
                {
                    return Project.Name;
                }

                return Name;
            }
        }

        public string FullPath
        {
            get
            {
                string path = Path;

                return System.IO.Path.Combine(path, Name);
            }
        }

        public virtual ProjectItemType Type { get { return ProjectItemType.Default; } }
    }
}