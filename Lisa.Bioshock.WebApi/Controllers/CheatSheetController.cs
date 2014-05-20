using Lisa.Bioshock.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Lisa.Bioshock.WebApi.Controllers
{
    public class CheatSheetController : ApiController
    {

        // GET api/cheatsheet
        public IHttpActionResult Get()
        {
            return Ok(shortKeys);
        }

        // GET api/cheatsheet/5
        public IHttpActionResult Get(int id)
        {
            var shortKey = shortKeys.FirstOrDefault(s => s.Id == id);
            if (shortKey == null)
            {
                return NotFound();
            }
            return Ok(shortKey);
        }

        // POST api/cheatsheet
        public IHttpActionResult Post([FromBody] ShortKeys shortKey)
        {
            if (shortKey.Shortkey != null)
            {
                shortKey.Shortkey = shortKey.Shortkey.ToUpper();
            }

            try
            {
                AddShortKey(shortKey);
            } 
            catch(Exception) 
            {
                return BadRequest();
            }
            
            return CreatedAtRoute("DefaultApi", new { id = shortKey.Id }, shortKey);
        }

        // PUT api/cheatsheet/5
        public IHttpActionResult Put(int id, [FromBody] ShortKeys newShortKey)
        {
            if((newShortKey.Id > 0) && (newShortKey.Id != id)) 
            {
                return BadRequest();
            } 
            else 
            {
                newShortKey.Id = id;
            }

            var shortKey = shortKeys.FirstOrDefault(sk => sk.Id == id);
            if (shortKey != null)
            {
                shortKey = newShortKey;
                shortKeys.RemoveAll(sk => sk.Id == id);
                shortKeys.Add(shortKey);
            }
            else
            {
                return NotFound();
            }

            return Content(HttpStatusCode.OK, new { shortKey });
           
        }

        // DELETE api/cheatsheet/5
        public IHttpActionResult Delete(int id)
        {
            var shortKey = shortKeys.FirstOrDefault(sk => sk.Id == id);
            if (shortKey == null)
            {
                return NotFound();
            }

            shortKeys.Remove(shortKey);
            return Ok();
        }

        private static List<ShortKeys> shortKeys = new List<ShortKeys>() {
            new ShortKeys { Id = 1, Name = "Project beveiligen", Shortkey = "Alt + L" },
            new ShortKeys { Id = 2, Name = "Open een file", Shortkey = "Alt + O" },
            new ShortKeys { Id = 3, Name = "Upload een bestand", Shortkey = "Alt + U" },
            new ShortKeys { Id = 4, Name = "Nieuw bestand aanmaken", Shortkey = "Alt + N" },
            new ShortKeys { Id = 5, Name = "Bestanden bewerken", Shortkey = "Alt + H" },
            new ShortKeys { Id = 6, Name = "Foutmelding 1", Shortkey = "Alt + 1" },
            new ShortKeys { Id = 7, Name = "Foutmelding 2", Shortkey = "Alt + 2" },
            new ShortKeys { Id = 8, Name = "Code scherm, Foutmelding", Shortkey = "Alt + 3" },
            new ShortKeys { Id = 9, Name = "scherm Code, Waarschuwing", Shortkey = "Alt + 4" },
            new ShortKeys { Id = 10, Name = "Editor openen/sluiten", Shortkey = "Ctrl" },
            new ShortKeys { Id = 11, Name = "Stop huidige actie", Shortkey = "Esc" },
            new ShortKeys { Id = 12, Name = "Help", Shortkey = "F1" },
        };

        private void AddShortKey(ShortKeys shortKey)
        {
            var highestShortKey = shortKeys
                .OrderByDescending(sk => sk.Id)
                .ElementAt(0);

            shortKey.Id = highestShortKey.Id + 1;
            shortKeys.Add(shortKey);
        }
    }
}
