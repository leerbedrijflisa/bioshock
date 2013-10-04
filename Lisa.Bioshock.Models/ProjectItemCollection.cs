using Lisa.Bioshock.Models;
using Lisa.Storage;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lisa.Bioshock.Models
{
    public class ProjectItemCollection : IList<ProjectItem>
    {
        public int Count { get { return items.Count; } }
        public bool IsReadOnly { get { return false; } }

        private BioshockContext db = new BioshockContext();
        private CloudManager cm = new CloudManager("UseDevelopmentStorage=true", "testcontainer", false);

        private List<ProjectItem> items = new List<ProjectItem>();
        private Project project;
        private ProjectItem parent;

        public ProjectItemCollection(Project project)
        {
            this.project = project;
        }

        public ProjectItemCollection(Project project, ProjectItem parent)
            : this(project)
        {
            this.parent = parent;
        }

        public ProjectItem this[int index]
        {
            get
            {
                return items[index];
            }
            set
            {
                items[index] = value;
            }
        }

        public void Add(Folder folderitem)
        {
            this.Add((ProjectItem)folderitem);
        }

        private void Add(File fileitem)
        {
            fileitem.Guid = cm.CreateBlob();
            this.Add((ProjectItem)fileitem);
        }

        private void Add(ProjectItem projectitem)
        {
            items.Add(projectitem);
            InitItem(projectitem);
        }

        void ICollection<ProjectItem>.Add(ProjectItem item)
        {
            this.Add(item);
        }

        public void Insert(int index, ProjectItem item)
        {
            items.Insert(index, item);
            InitItem(item);
        }

        public void InitItem(ProjectItem item)
        {
            item.project = project;
            item.Parent = parent;
            item.ParentID = parent != null ? (int?)parent.ID : null;
            
            db.ProjectItems.Add(item);
            db.SaveChanges();

            Console.WriteLine(item);
        }

        public void Clear()
        {
            items.Clear();
        }

        public void CopyTo(ProjectItem[] array, int arrayIndex)
        {
            items.CopyTo(array, arrayIndex);
        }

        public int IndexOf(ProjectItem item)
        {
            return items.IndexOf(item);
        }

        public bool Contains(ProjectItem item)
        {
            return items.Contains(item);
        }

        public bool Remove(ProjectItem item)
        {
            return items.Remove(item);
        }

        public void RemoveAt(int index)
        {
            items.RemoveAt(index);
        }

        public IEnumerator<ProjectItem> GetEnumerator()
        {
            return items.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
}
