---
trigger: always_on
---

1. Veri Kaynağı Prensibi (Single Source of Truth)

    YAML Odaklılık: Editördeki tüm veriler, durumlar (state) ve görünümler yalnızca yüklenen veya oluşturulan YAML yapısından beslenmelidir.

    Bağımsız Veri Yasağı: YAML dosyasında bulunmayan hiçbir veri veya property (özellik), kod içerisinde hard-coded (sabit) olarak tutulamaz veya dış kaynaklardan (örneğin ayrı bir JSON dosyası veya bağımsız bir state) çekilemez.

2. Veri Senkronizasyonu ve Manipülasyonu

    Doğrudan Güncelleme: Kullanıcı arayüzünde (UI) bir değişiklik yapıldığında, bu değişiklik doğrudan ana YAML objesi üzerinde güncellenmelidir.

    Dinamik Okuma: UI bileşenleri (inputlar, sliderlar vb.), değerlerini doğrudan yaml_data[key] şeklinde okumalıdır. Eğer bir key YAML'de yoksa, o alanın default değerleri koddan değil, wiki standartlarına göre dinamik olarak üretilmelidir.

3. Wiki Entegrasyonu ile Doğrulama

    Şema Kontrolü: Bir veri güncelleneceği veya ekleneceği zaman, önce DeluxeMenus Wiki adresindeki güncel YAML şeması kontrol edilmelidir.

    Temizlik Protokolü: Eğer wiki'de bir key kaldırılmışsa, editör motoru bu veriyi YAML'den temizlemeli; dışarıda "artık veri" (orphan data) olarak tutmaya devam etmemelidir.

4. Kodlama Standartları

    No Redundancy (Sıfır Tekrar): Aynı veriyi hem React state'inde hem de bir yardımcı objede tutma. Veri her zaman ana YAML ağacının (tree) bir parçası olmalıdır.

    Parsing Strategy (Ayrıştırma Stratejisi): YAML'den veriyi çekerken js-yaml veya benzeri bir kütüphane kullanıyorsan, tüm editor state'ini bu parse edilmiş objeye bağla.