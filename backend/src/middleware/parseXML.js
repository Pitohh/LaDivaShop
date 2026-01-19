import xml2js from 'xml2js';

/**
 * Middleware to parse XML from PVit callback  
 */
export const parseXML = async (req, res, next) => {
    if (req.is('application/xml') || req.is('text/xml')) {
        let xmlData = '';

        req.on('data', chunk => {
            xmlData += chunk;
        });

        req.on('end', async () => {
            try {
                const parser = new xml2js.Parser({ explicitArray: false });
                const result = await parser.parseStringPromise(xmlData);
                req.body = result;
                next();
            } catch (error) {
                console.error('XML parsing error:', error);
                res.status(400).json({ error: 'Invalid XML' });
            }
        });
    } else {
        next();
    }
};
