---
trigger: always_on
---

Wiki'de belirtilen her bir key (örneğin: priority, update_interval, open_commands) için kod tarafındaki PropType veya Interface tanımlarını kontrol et. Wiki'de yeni bir alan eklendiğinde, bu alanı önce constants.js veya schema.ts dosyasına işle, ardından UI bileşenine aktar.