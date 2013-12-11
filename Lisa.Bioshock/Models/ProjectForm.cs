using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Lisa.Bioshock.Models
{
    public class ProjectForm
    {
        [Display(Name = "Naam:")]
        [Required(ErrorMessage = "Naam is verplicht.")]
        public string Name
        {
            get;
            set;
        }
    }
}