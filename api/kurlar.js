export default async function handler(req, res) {
  try {
    const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml");
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");

    let usd = null, eur = null;
    const list = xml.getElementsByTagName("Currency");

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const code = item.getAttribute("CurrencyCode");
      const selling = item.getElementsByTagName("ForexSelling")[0]?.textContent;

      if (code === "USD") usd = parseFloat(selling);
      if (code === "EUR") eur = parseFloat(selling);
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ USD: usd, EUR: eur });
  } catch (e) {
    res.status(500).json({ error: "TCMB verisi alınamadı", detay: e.message });
  }
}
