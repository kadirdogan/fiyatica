import { XMLParser } from 'fast-xml-parser';

export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml");
    const xmlText = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ""
    });
    const data = parser.parse(xmlText);
    const currencies = data.Tarih_Date.Currency;

    const usd = currencies.find(c => c.CurrencyCode === 'USD')?.ForexSelling;
    const eur = currencies.find(c => c.CurrencyCode === 'EUR')?.ForexSelling;
    const xau = currencies.find(c => c.CurrencyCode === 'XAU')?.ForexSelling;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      USD: parseFloat(usd),
      EUR: parseFloat(eur),
      XAU: parseFloat(xau)
    });
  } catch (e) {
    res.status(500).json({ error: "TCMB verisi alınamadı", detay: e.message });
  }
}
