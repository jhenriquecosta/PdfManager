namespace PDFManager.Web.Entities
{
    public class PdfAnexo
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Usuario { get; set; }
        public DateTime DataGravacao { get; set; }
        public string CaminhoArquivo { get; set; }
    }
}
