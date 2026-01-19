import { scraperService } from '../services/scraper.service.js';

export const syncController = {
    async syncWhatsApp(req, res) {
        try {
            console.log('🔄 Manual sync triggered by Admin');
            const result = await scraperService.syncWhatsAppCatalog();
            res.json({
                message: 'Synchronization completed successfully',
                stats: result
            });
        } catch (error) {
            console.error('Sync Endpoint Error:', error);
            res.status(500).json({ error: 'Failed to synchronize catalog' });
        }
    }
};
