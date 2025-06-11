const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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

        // Lista de slides para processar
        const slides = [
            { file: '1-title.html', title: 'Título' },
            { file: '2-context.html', title: 'Crescimento do Food-Delivery' },
            { file: '2.1-problem.html', title: 'Problema' },
            { file: '3-opportunity.html', title: 'Oportunidade Regulatória' },
            { file: '4-proposed-question.html', title: 'Pergunta de Pesquisa' },
            { file: '5-objectives.html', title: 'Objetivos' },
            { file: '6-roadmap.html', title: 'Roadmap' },
            { file: '7-data.html', title: 'Dados' },
            { file: '8-logistics.html', title: 'Logística' },
            { file: '9-droneports.html', title: 'Droneports' },
            { file: '10-queue.html', title: 'Fila' },
            { file: '11-energy.html', title: 'Energia' },
            { file: '12-weather.html', title: 'Clima' },
            { file: '13-finance.html', title: 'Finanças' },
            { file: '14-risk.html', title: 'Riscos' },
            { file: '15-schedule.html', title: 'Cronograma' },
            { file: '16-expected-results.html', title: 'Resultados Esperados' },
            { file: '17-end.html', title: 'Fim' }
        ];

        const slidesDir = path.join(__dirname, 'Slides');
        const outputDir = path.join(__dirname, 'output');

        // Criar diretório de saída se não existir
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Gerar PDF individual para cada slide
        console.log('📄 Gerando PDFs individuais...');
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

                const pdfPath = path.join(outputDir, `slide-${String(i + 1).padStart(2, '0')}-${slide.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
                
                await page.pdf({
                    path: pdfPath,
                    width: '1280px',
                    height: '720px',
                    printBackground: true,
                    margin: { top: 0, right: 0, bottom: 0, left: 0 }
                });
            } else {
                console.log(`  ⚠️  Arquivo não encontrado: ${slide.file}`);
            }
        }

        // Gerar PDF unificado da apresentação completa
        console.log('📚 Gerando PDF da apresentação completa...');
        
        const presentationPath = path.join(slidesDir, 'presentation.html');
        if (fs.existsSync(presentationPath)) {
            await page.goto(`file://${presentationPath}`, {
                waitUntil: 'networkidle0'
            });

            await page.waitForTimeout(2000);

            // Simular navegação por todos os slides para gerar PDF completo
            const completePdfPath = path.join(outputDir, 'apresentacao-completa.pdf');
            
            await page.pdf({
                path: completePdfPath,
                width: '1280px',
                height: '720px',
                printBackground: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 }
            });

            console.log(`✅ PDF da apresentação completa gerado: ${completePdfPath}`);
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
                console.log(`  • ${file}`);
            }
        });

    } catch (error) {
        console.error('❌ Erro durante a geração:', error);
    } finally {
        await browser.close();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    generatePDF().catch(console.error);
}

module.exports = { generatePDF }; 