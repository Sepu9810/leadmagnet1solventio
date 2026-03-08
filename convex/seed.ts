import { mutation } from "./_generated/server";

export const seedData = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if data already exists
        const existingVideos = await ctx.db.query("videos").first();
        if (existingVideos) {
            return "Data already seeded";
        }

        // === CATEGORIES ===

        // SepuHack categories
        const catEmprendimiento = await ctx.db.insert("categories", {
            name: "Emprendimiento",
            slug: "emprendimiento",
            description: "Videos sobre cómo emprender con tecnología e inteligencia artificial",
            mundo: "sepuhack",
            sort_order: 1,
        });

        const catAutomatizacion = await ctx.db.insert("categories", {
            name: "Automatización",
            slug: "automatizacion",
            description: "Tutoriales de automatización para emprendedores",
            mundo: "sepuhack",
            sort_order: 2,
        });

        const catIAPractica = await ctx.db.insert("categories", {
            name: "IA Práctica",
            slug: "ia-practica",
            description: "Aprende a usar IA de forma práctica en tu negocio",
            mundo: "sepuhack",
            sort_order: 3,
        });

        // Solventio categories
        const catEficiencia = await ctx.db.insert("categories", {
            name: "Eficiencia Operativa",
            slug: "eficiencia-operativa",
            description: "Soluciones IA para mejorar la eficiencia de tu empresa",
            mundo: "solventio",
            sort_order: 1,
        });

        const catVentas = await ctx.db.insert("categories", {
            name: "Ventas & Marketing",
            slug: "ventas-marketing",
            description: "IA aplicada a ventas y marketing corporativo",
            mundo: "solventio",
            sort_order: 2,
        });

        const catRRHH = await ctx.db.insert("categories", {
            name: "Recursos Humanos",
            slug: "recursos-humanos",
            description: "Transformación digital del departamento de RRHH con IA",
            mundo: "solventio",
            sort_order: 3,
        });

        // === SEPUHACK VIDEOS ===

        await ctx.db.insert("videos", {
            title: "Cómo usar ChatGPT para tu emprendimiento",
            slug: "chatgpt-para-emprendimiento",
            description:
                "Aprende a usar ChatGPT desde cero para crear contenido, planificar estrategia y automatizar tareas de tu negocio.",
            youtube_video_id: "tchUh_Py-h4",
            youtube_start_seconds: 0,
            thumbnail_url: undefined,
            transcript: "En este video vamos a explorar cómo usar ChatGPT para potenciar tu emprendimiento...",
            key_insights: [
                "ChatGPT puede generar contenido de marketing en minutos",
                "Usa prompts específicos para obtener mejores resultados",
                "Automatiza respuestas a clientes con IA",
            ],
            mundo: "sepuhack",
            is_published: true,
            sort_order: 1,
            categoryId: catEmprendimiento,
        });

        await ctx.db.insert("videos", {
            title: "Automatiza tu negocio con Make (Integromat)",
            slug: "automatiza-con-make",
            description:
                "Tutorial paso a paso para crear automatizaciones sin código usando Make. Conecta tus herramientas y ahorra horas cada semana.",
            youtube_video_id: "tchUh_Py-h4",
            youtube_start_seconds: 0,
            thumbnail_url: undefined,
            transcript: "Hoy vamos a aprender a automatizar procesos de negocio con Make...",
            key_insights: [
                "Make permite conectar +1000 aplicaciones sin código",
                "Empieza con automatizaciones simples y escala",
                "Puedes ahorrar 10+ horas semanales con buenas automatizaciones",
            ],
            mundo: "sepuhack",
            is_published: true,
            sort_order: 2,
            categoryId: catAutomatizacion,
        });

        await ctx.db.insert("videos", {
            title: "Crea tu asistente virtual con IA en 30 minutos",
            slug: "asistente-virtual-ia",
            description:
                "Aprende a crear un chatbot inteligente para atender clientes 24/7 usando herramientas no-code y la API de OpenAI.",
            youtube_video_id: "tchUh_Py-h4",
            youtube_start_seconds: 0,
            thumbnail_url: undefined,
            transcript: "En este tutorial vamos a construir un asistente virtual desde cero...",
            key_insights: [
                "Un chatbot inteligente puede atender clientes 24/7",
                "No necesitas saber programar para crear uno",
                "Puede responder preguntas frecuentes automáticamente",
            ],
            mundo: "sepuhack",
            is_published: true,
            sort_order: 3,
            categoryId: catIAPractica,
        });

        // === SOLVENTIO VIDEOS ===

        await ctx.db.insert("videos", {
            title: "Demo Solventio AI: Eficiencia Operativa",
            slug: "demo-solventio-ai-eficiencia",
            description:
                "Descubre cómo Solventio AI puede transformar la eficiencia operativa de tu empresa con soluciones de inteligencia artificial a medida.",
            youtube_video_id: "tchUh_Py-h4",
            youtube_start_seconds: 0,
            thumbnail_url: undefined,
            transcript: "Bienvenidos a esta demostración de Solventio AI para eficiencia operativa...",
            key_insights: [
                "La IA puede reducir costos operativos hasta un 40%",
                "Solventio ofrece soluciones personalizadas por departamento",
                "Implementación progresiva para minimizar riesgo",
            ],
            mundo: "solventio",
            is_published: true,
            sort_order: 1,
            categoryId: catEficiencia,
        });

        await ctx.db.insert("videos", {
            title: "IA aplicada a Ventas: Caso de éxito real",
            slug: "ia-ventas-caso-exito",
            description:
                "Caso de estudio real de cómo una empresa triplicó sus leads cualificados implementando IA en su proceso de ventas.",
            youtube_video_id: "tchUh_Py-h4",
            youtube_start_seconds: 0,
            thumbnail_url: undefined,
            transcript: "Hoy les presentamos un caso de éxito real en ventas con IA...",
            key_insights: [
                "La IA puede cualificar leads automáticamente",
                "Personalización a escala con IA generativa",
                "ROI positivo en menos de 3 meses",
            ],
            mundo: "solventio",
            is_published: true,
            sort_order: 2,
            categoryId: catVentas,
        });

        await ctx.db.insert("videos", {
            title: "Transformación Digital en RRHH con IA",
            slug: "transformacion-rrhh-ia",
            description:
                "Cómo modernizar el departamento de Recursos Humanos con inteligencia artificial: reclutamiento, onboarding y gestión del talento.",
            youtube_video_id: "tchUh_Py-h4",
            youtube_start_seconds: 0,
            thumbnail_url: undefined,
            transcript: "La transformación digital en RRHH es fundamental para las empresas modernas...",
            key_insights: [
                "La IA puede filtrar CVs y preseleccionar candidatos",
                "Onboarding automático personalizado con chatbots",
                "Análisis predictivo de rotación de personal",
            ],
            mundo: "solventio",
            is_published: true,
            sort_order: 3,
            categoryId: catRRHH,
        });

        return "Seed data created successfully: 6 categories + 6 videos";
    },
});
