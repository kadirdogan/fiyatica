import { XMLParser } from 'fast-xml-parser';

export default async function handler(req, res) {
  try {
    // TCMB XML verisini çek
    const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml");
    const xmlText = await response.text();

    // XML verisini parse et
    const parser = new XMLParser();
    const data = parser.parse(xmlText);

    // Currency array'ini al
    const currencies = data.Tarih_Date.Currency;

    // USD ve EUR değerlerini bul
    const usd = currencies.find(c => c['@_CurrencyCode'] === 'USD')?.ForexSelling;
    const eur = currencies.find(c => c['@_CurrencyCode'] === 'EUR')?.ForexSelling;

    // CORS ve başarılı yanıt
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      USD: parseFloat(usd),
      EUR: parseFloat(eur)
    });
  } catch (e) {
    // Hata durumu
    res.status(500).json({ error: "TCMB verisi alınamadı", detay: e.message });
  }
}
