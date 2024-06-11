using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PDFManager.Web.Entities;
using PDFManager.Web.Infra;

[Route("api/[controller]")]
[ApiController]
public class PdfManagerController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _hostEnvironment;

    public PdfManagerController(AppDbContext context, IWebHostEnvironment hostEnvironment)
    {
        _context = context;
        _hostEnvironment = hostEnvironment;
    }

    // GET: api/PdfAnexos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PdfAnexo>>> GetAll()
    {
        return await _context.PdfAnexos.ToListAsync();
    }

    // GET: api/pdfmanager/pdf/5
    [HttpGet("pdf/{id}")]
    public async Task<IActionResult> GetPdf(int id)
    {
        // Substitua isso pelo método real de localizar o caminho do arquivo PDF usando o ID fornecido

        var pdfAnexo = await _context.PdfAnexos.FindAsync(id);

        if (pdfAnexo == null)
        {
            return NotFound();
        }
        var filePath = Path.Combine(_hostEnvironment.WebRootPath, "pdfs", $"{pdfAnexo.CaminhoArquivo}");

        if (!System.IO.File.Exists(filePath))
        {   
            return NotFound();
        }

        var memory = new MemoryStream();
        using (var stream = new FileStream(filePath, FileMode.Open))
        {
            await stream.CopyToAsync(memory);
        }
        memory.Position = 0;

        // Definir o cabeçalho Content-Disposition como inline
      
        return File(memory, "application/pdf", Path.GetFileName(filePath));
    }




    // GET: api/PdfAnexos/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PdfAnexo>> Get(int id)
    {
        var pdfAnexo = await _context.PdfAnexos.FindAsync(id);

        if (pdfAnexo == null)
        {
            return NotFound();
        }

        return pdfAnexo;
    }

    // POST: api/PdfAnexos
    [HttpPost]
    public async Task<ActionResult<PdfAnexo>> Save(IFormFile file, string usuario)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Arquivo inválido");
        }
        usuario = "Henrique";

        var filePath = Path.Combine(_hostEnvironment.WebRootPath, "pdfs", file.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var pdfAnexo = new PdfAnexo
        {
            Nome = file.FileName,
            Usuario = usuario,
            DataGravacao = DateTime.UtcNow,
            CaminhoArquivo = filePath
        };

        _context.PdfAnexos.Add(pdfAnexo);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return CreatedAtAction("Get", new { id = pdfAnexo.Id }, pdfAnexo);
    }

    // PUT: api/PdfAnexos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, PdfAnexo pdfAnexo)
    {
        if (id != pdfAnexo.Id)
        {
            return BadRequest();
        }

        _context.Entry(pdfAnexo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PdfAnexoExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/PdfAnexos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var pdfAnexo = await _context.PdfAnexos.FindAsync(id);
        if (pdfAnexo == null)
        {
            return NotFound();
        }

        _context.PdfAnexos.Remove(pdfAnexo);
        await _context.SaveChangesAsync();

        var filePath = pdfAnexo.CaminhoArquivo;
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }

        return NoContent();
    }

    private bool PdfAnexoExists(int id)
    {
        return _context.PdfAnexos.Any(e => e.Id == id);
    }
}
