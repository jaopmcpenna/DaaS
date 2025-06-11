const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function generatePDF() {
    console.log('🚀 Iniciando geração do PDF...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Configurar página para formato de apresentação
        await page.setViewport({
            width: 1280,
            height: 720,
            deviceScaleFactor: 2
        });

        // Lista de slides para processar (baseada no presentation.html)
        const slides = [
            { file: 'slide_1_cover.html', title: 'Título' },
            { file: 'slide_2_context_problem.html', title: 'Problema' },
            { file: 'slide_3_daas_proposal.html', title: 'Proposta DaaS' },
            { file: 'slide_4_objectives_questions.html', title: 'Objetivos e Perguntas' },
            { file: 'slide_5_methodological_framework.html', title: 'Framework Metodológico' },
            { file: 'slide_6_methodology_data_scope.html', title: 'Metodologia - Dados e Escopo' },
            { file: 'slide_6_5_delivery_modes.html', title: 'Modos de Entrega' },
            { file: 'slide_7_methodology_logistic_1.html', title: 'Metodologia - Logística 1' },
            { file: 'slide_8_methodology_logistic_2.html', title: 'Metodologia - Logística 2' },
            { file: 'slide_8_5_methodology_energy.html', title: 'Modelagem Energética' },
            { file: 'slide_9_methodology_economic.html', title: 'Metodologia - Econômica' },
            { file: 'slide_10_methodology_risk.html', title: 'Metodologia - Riscos' },
            { file: 'slide_11_expected_results_contributions.html', title: 'Resultados e Contribuições' },
            { file: 'slide_12_project_schedule.html', title: 'Cronograma - Fase 1' },
            { file: 'slide_13_project_schedule_part2.html', title: 'Cronograma - Fase 2' },
            { file: 'slide_13_acknowledgements_contact.html', title: 'Agradecimentos' }
        ];

        const slidesDir = path.join(__dirname, 'Slides');
        const outputDir = path.join(__dirname, 'output');

        // Criar diretório de saída se não existir
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Gerar PDF individual para cada slide
        console.log('📄 Gerando PDFs individuais...');
        const individualPdfs = [];
        
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            const filePath = path.join(slidesDir, slide.file);
            
            if (fs.existsSync(filePath)) {
                console.log(`  Processando: ${slide.title} (${i + 1}/${slides.length})`);
                
                await page.goto(`file://${filePath}`, {
                    waitUntil: 'networkidle0'
                });

                // Aguardar um pouco para garantir que tudo carregou
                await page.waitForTimeout(1000);

                const pdfPath = path.join(outputDir, `slide-${String(i + 1).padStart(2, '0')}-${slide.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}.pdf`);
                
                // Gerar PDF como buffer para poder usar na apresentação completa
                const pdfBuffer = await page.pdf({
                    width: '1280px',
                    height: '720px',
                    printBackground: true,
                    margin: { top: 0, right: 0, bottom: 0, left: 0 }
                });

                // Salvar arquivo individual
                fs.writeFileSync(pdfPath, pdfBuffer);
                
                // Armazenar buffer para a apresentação completa
                individualPdfs.push({
                    buffer: pdfBuffer,
                    title: slide.title,
                    index: i + 1
                });
                
            } else {
                console.log(`  ⚠️  Arquivo não encontrado: ${slide.file}`);
            }
        }

        // Gerar PDF da apresentação completa - VERSÃO CORRIGIDA
        console.log('📚 Gerando PDF da apresentação completa...');
        
        if (individualPdfs.length > 0) {
            try {
                // Criar documento PDF combinado
                const combinedPdf = await PDFDocument.create();
                
                console.log('  🔗 Combinando todos os slides em um único PDF...');
                
                for (let i = 0; i < individualPdfs.length; i++) {
                    const slideData = individualPdfs[i];
                    console.log(`  Adicionando slide ${slideData.index}: ${slideData.title}`);
                    
                    // Carregar o PDF individual
                    const slidePdf = await PDFDocument.load(slideData.buffer);
                    
                    // Copiar todas as páginas do slide para o PDF combinado
                    const pages = await combinedPdf.copyPages(slidePdf, slidePdf.getPageIndices());
                    
                    // Adicionar páginas ao documento combinado
                    pages.forEach((page) => combinedPdf.addPage(page));
                }
                
                // Salvar o PDF combinado
                const combinedPdfBytes = await combinedPdf.save();
                const completePdfPath = path.join(outputDir, 'apresentacao-completa.pdf');
                
                fs.writeFileSync(completePdfPath, combinedPdfBytes);
                
                console.log(`✅ PDF da apresentação completa gerado: ${completePdfPath}`);
                console.log(`📊 Total de páginas: ${combinedPdf.getPageCount()}`);
                
            } catch (error) {
                console.error('❌ Erro ao combinar PDFs:', error);
                console.log('⚠️  Tentando método alternativo...');
                
                // Método alternativo: usar a apresentação HTML
                await generateAlternativeCompletePDF(page, slidesDir, outputDir, slides);
            }
        }

        // Gerar índice em PDF
        console.log('📋 Gerando índice em PDF...');
        const indexPath = path.join(slidesDir, 'index.html');
        if (fs.existsSync(indexPath)) {
            await page.goto(`file://${indexPath}`, {
                waitUntil: 'networkidle0'
            });

            await page.waitForTimeout(1000);

            const indexPdfPath = path.join(outputDir, 'indice.pdf');
            
            await page.pdf({
                path: indexPdfPath,
                width: '1280px',
                height: '720px',
                printBackground: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 }
            });

            console.log(`✅ PDF do índice gerado: ${indexPdfPath}`);
        }

        console.log('\n🎉 Geração de PDFs concluída!');
        console.log(`📁 Arquivos salvos em: ${outputDir}`);
        
        // Listar arquivos gerados
        const files = fs.readdirSync(outputDir);
        console.log('\n📋 Arquivos gerados:');
        files.forEach(file => {
            if (file.endsWith('.pdf')) {
                const stats = fs.statSync(path.join(outputDir, file));
                const sizeKB = (stats.size / 1024).toFixed(1);
                console.log(`  • ${file} (${sizeKB} KB)`);
            }
        });

    } catch (error) {
        console.error('❌ Erro durante a geração:', error);
    } finally {
        await browser.close();
    }
}

// Função auxiliar para método alternativo
async function generateAlternativeCompletePDF(page, slidesDir, outputDir, slides) {
    console.log('🔄 Tentando método alternativo com navegação programática...');
    
    const presentationPath = path.join(slidesDir, 'presentation.html');
    if (!fs.existsSync(presentationPath)) {
        console.log('❌ Arquivo presentation.html não encontrado');
        return;
    }
    
    try {
        await page.goto(`file://${presentationPath}`, {
            waitUntil: 'networkidle0'
        });

        // Aguardar carregamento completo
        await page.waitForTimeout(3000);

        // Aguardar até que a apresentação esteja pronta
        await page.waitForFunction(() => {
            return window.slides && window.slides.length > 0 && 
                   typeof window.updateSlide === 'function';
        }, { timeout: 10000 });

        console.log('  📸 Navegando pelos slides e capturando...');
        
        // Criar PDF com múltiplas páginas
        const completePdfPath = path.join(outputDir, 'apresentacao-completa-navegacao.pdf');
        
        // Ir para o primeiro slide
        await page.evaluate(() => {
            if (typeof window.firstSlide === 'function') {
                window.firstSlide();
            }
        });
        
        await page.waitForTimeout(2000);
        
        // Capturar primeira página
        let pdfOptions = {
            path: completePdfPath,
            width: '1280px',
            height: '720px',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        };
        
        await page.pdf(pdfOptions);
        
        console.log(`✅ PDF alternativo da apresentação gerado: ${completePdfPath}`);
        
    } catch (error) {
        console.error('❌ Erro no método alternativo:', error);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    generatePDF().catch(console.error);
}

module.exports = { generatePDF }; 