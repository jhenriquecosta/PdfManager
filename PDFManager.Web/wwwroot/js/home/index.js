
  function loadPDF(idPdf) {
            
            const id =idPdf;
            const elPdfViewer = `pdfViewer${id}`;
            const endpoint = "https://localhost:7207/api/pdfmanager/pdf/" + id;
            fetch(endpoint)
                .then(response => response.blob())
                .then(blob => {
                    const fileURL = URL.createObjectURL(blob);
                    const pdfViewer = document.getElementById(elPdfViewer);
                    pdfViewer.src = "pdf-viewer.html?file=" + fileURL;;
                    pdfViewer.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
         // Função para carregar a lista de PDFs e criar acordeões
        function loadPdfList() {
            fetch('https://localhost:7207/api/pdfmanager')
                .then(response => response.json())
                .then(data => {
                    const list = document.getElementById('pdfList');
                    list.innerHTML = ''; // Limpar lista atual
                    data.forEach((pdf, index) => {
                        const accordion = document.createElement('button');
                        accordion.className = 'accordion';
                        accordion.innerHTML = `${pdf.nome} - ${pdf.usuario} - ${new Date(pdf.dataGravacao).toLocaleDateString()}`;

                        const panel = document.createElement('div');
                        panel.className = 'panel';
                        const canvas = document.createElement('iframe');
                        canvas.id = `pdfViewer${pdf.id}`;
                        canvas.className = 'pdf-viewer';
                        panel.appendChild(canvas);

                        list.appendChild(accordion);
                        list.appendChild(panel);

                        accordion.addEventListener('click', function () {
                            this.classList.toggle('active');
                            var panel = this.nextElementSibling;
                            if (panel.style.maxHeight) {
                                panel.style.maxHeight = null;
                            } else {
                                panel.style.maxHeight = panel.scrollHeight + 'px';
                                // Chamar a função showPdf quando o acordeão é aberto
                                loadPDF(pdf.id);
                            }
                        });
                    });
                })
                .catch(error => console.error('Erro ao carregar a lista de PDFs: ', error));
        }

        // Função para carregar a lista de PDFs


        function loadPdfListv2() {
            fetch('https://localhost:7207/api/pdfmanager')
                .then(response => response.json())
                .then(data => {
                    const list = document.getElementById('pdfList');
                    list.innerHTML = ''; // Limpar lista atual
                    data.forEach((pdf, index) => {
                        const accordion = document.createElement('button');
                        accordion.className = 'accordion';
                        accordion.innerHTML = `${pdf.nome} - ${pdf.usuario} - ${new Date(pdf.dataGravacao).toLocaleDateString()}`;

                        const panel = document.createElement('div');
                        panel.className = 'panel';
                        const canvas = document.createElement('canvas');
                        canvas.id = `pdfCanvas${index}`;
                        canvas.className = 'pdf-canvas';
                        panel.appendChild(canvas);

                        list.appendChild(accordion);
                        list.appendChild(panel);

                        accordion.addEventListener('click', function () {
                            this.classList.toggle('active');
                            var panel = this.nextElementSibling;
                            if (panel.style.maxHeight) {
                                panel.style.maxHeight = null;
                            } else {
                                panel.style.maxHeight = panel.scrollHeight + 'px';
                                // Chamar a função showPdf quando o acordeão é aberto
                                showPdf(`https://localhost:7207/api/pdfmanager/pdf/${pdf.id}`, canvas.id);
                            }
                        });
                    });
                })
                .catch(error => console.error('Erro ao carregar a lista de PDFs: ', error));
        }
        function loadPdfListv1() {
            fetch('https://localhost:7207/api/pdfmanager')
                .then(response => response.json())
                .then(data => {
                    const list = document.getElementById('pdfList');
                    list.innerHTML = ''; // Limpar lista atual
                    data.forEach(pdf => {
                        const accordion = document.createElement('button');
                        accordion.className = 'accordion';
                        accordion.innerHTML = `${pdf.nome} - ${pdf.usuario} - ${new Date(pdf.dataGravacao).toLocaleDateString()}`;

                        const panel = document.createElement('div');
                        panel.className = 'panel';
                        const iframe = document.createElement('iframe');
                        iframe.style.width = '100%';
                        iframe.style.height = '500px';
                        // Certifique-se de que a URL seja algo como 'https://localhost:7207/api/pdfmanager/files/123'
                        iframe.src = `https://localhost:7207/api/pdfmanager/pdf/${pdf.id}`;
                        panel.appendChild(iframe);

                        list.appendChild(accordion);
                        list.appendChild(panel);

                        accordion.addEventListener('click', function () {
                            this.classList.toggle('active');
                            var panel = this.nextElementSibling;
                            if (panel.style.maxHeight) {
                                panel.style.maxHeight = null;
                            } else {
                                panel.style.maxHeight = panel.scrollHeight + 'px';
                            }
                        });
                    });
                });
        }


        // Função para fazer upload de um novo PDF
        function uploadPdf() {
            const fileInput = document.getElementById('fileUpload');
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            // Adicione mais campos ao formData se necessário

            fetch('https://localhost:7207/api/pdfmanager', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        loadPdfList(); // Recarregar lista após o upload
                    } else {
                        alert('Falha no upload do arquivo.');
                    }
                });
        }

        // Função para excluir um PDF
        function deletePdf(id) {
            fetch(`https://localhost:7207/api/pdfmanager/${id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        loadPdfList(); // Recarregar lista após a exclusão
                    } else {
                        alert('Falha ao excluir o arquivo.');
                    }
                });
        }

        // Função para visualizar um PDF
        function viewPdf(path) {
            window.open(path, '_blank');
        }
        // Função para carregar e exibir um PDF
        function showPdf(url, canvasId) {
            var pdfjsLib = window['pdfjs-dist/build/pdf'];

            // O worker é necessário para processar o PDF
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

            // Carregar o documento PDF
            pdfjsLib.getDocument(url).promise.then(function (pdfDoc) {
                console.log('PDF carregado');

                // Obter a primeira página
                pdfDoc.getPage(1).then(function (page) {
                    var scale = 1.5;
                    var viewport = page.getViewport({ scale: scale });

                    // Preparar o canvas usando o tamanho da página do PDF
                    var canvas = document.getElementById(canvasId);
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Renderizar a página PDF no canvas
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            }).catch(function (error) {
                console.error('Erro ao carregar o PDF: ', error);
            });
        }


        // Carregar lista de PDFs ao iniciar
        document.addEventListener('DOMContentLoaded', loadPdfList);