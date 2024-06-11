using Microsoft.EntityFrameworkCore;
using PDFManager.Web.Entities;
using System.Collections.Generic;

namespace PDFManager.Web.Infra
{
    public class AppDbContext : DbContext
    {
        public DbSet<PdfAnexo> PdfAnexos { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
