const urunler = [
    { id: "sapka", ad: "F1 Pilot Şapkası", fiyat: 450, resim: "../img/sapka.png", aciklama: "Resmi lisanslı, nefes alabilir F1 pilot şapkası." },
    { id: "tisort", ad: "F1 Takım Tişörtü", fiyat: 350, resim: "../img/tisort.png", aciklama: "Pamuklu, terletmez takım tişörtü." },
    { id: "maket", ad: "F1 Maket Araba 1:43", fiyat: 650, resim: "../img/maket.png", aciklama: "Koleksiyonluk 1:43 ölçekli F1 maket aracı." },
    { id: "kupa", ad: "F1 Logolu Kupa", fiyat: 180, resim: "../img/kupa.png", aciklama: "Seramik F1 temalı kupa bardak." },
    { id: "mont", ad: "F1 Takım Montu", fiyat: 1200, resim: "../img/mont.png", aciklama: "Soğuk kış günleri için özel tasarım rüzgar geçirmez F1 montu." },
    { id: "anahtarlik", ad: "F1 Lastik Anahtarlık", fiyat: 90, resim: "../img/anahtarlik.png", aciklama: "Gerçek lastik dokusuna sahip F1 temalı anahtarlık." },
    { id: "canta", ad: "F1 Sırt Çantası", fiyat: 550, resim: "../img/canta.png", aciklama: "Çok gözlü, geniş kapasiteli lisanslı sırt çantası." },
    { id: "eldiven", ad: "F1 Yarış Eldiveni", fiyat: 800, resim: "../img/eldiven.png", aciklama: "Profesyonel sürüş için özel üretilmiş, kaydırmaz yarış eldiveni." },
    { id: "kilif", ad: "F1 Karbon Telefon Kılıfı", fiyat: 250, resim: "../img/kilif.png", aciklama: "Karbon fiber dokulu, darbelere dayanıklı F1 lisanslı telefon kılıfı." }
];

/* Sayfa yüklendiğinde çalışacak olay dinleyicisi */
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Ürünler Sayfasını veya Ana Sayfa Öne Çıkanları Doldurma
    const urunListesiDOM = document.getElementById("urun-listesi");
    if (urunListesiDOM) {
        // Hangi sayfada olduğumuzu kontrol edip ona göre döngü kuruyoruz
        const maxUrun = urunListesiDOM.dataset.limit ? parseInt(urunListesiDOM.dataset.limit) : urunler.length;
        
        let htmlIcerik = "";
        for (let i = 0; i < maxUrun; i++) {
            const urun = urunler[i];
            /* Sayfa yoluna göre resim yolunu ayarlıyoruz. Index için img/, pages için ../img/ */
            const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
            const resimYolu = isIndex ? urun.resim.replace("../", "") : urun.resim;
            const detayLinki = isIndex ? `pages/urun-detay.html?id=${urun.id}` : `urun-detay.html?id=${urun.id}`;

            htmlIcerik += `
                <div class="urun-kart">
                    <img src="${resimYolu}" alt="${urun.ad}">
                    <h3>${urun.ad}</h3>
                    <p class="fiyat">${urun.fiyat} TL</p>
                    <a href="${detayLinki}" class="btn btn-secondary">İncele</a>
                    <button class="btn sepet-ekle-btn" data-id="${urun.id}">Sepete Ekle</button>
                </div>
            `;
        }
        urunListesiDOM.innerHTML = htmlIcerik;
    }

    // 2. Ürün Detay Sayfası Doldurma (URLSearchParams kullanımı)
    const detayResimDOM = document.getElementById("detay-resim");
    const detayAdDOM = document.getElementById("detay-ad");
    const detayFiyatDOM = document.getElementById("detay-fiyat");
    const detayAciklamaDOM = document.getElementById("detay-aciklama");
    const detaySepetBtnDOM = document.getElementById("detay-sepet-btn");

    if (detayResimDOM && detayAdDOM && detayFiyatDOM) {
        const urlParams = new URLSearchParams(window.location.search);
        const urunId = urlParams.get('id');

        // Ürünü diziden buluyoruz
        const bulunanUrun = urunler.find(u => u.id === urunId);

        if (bulunanUrun) {
            detayResimDOM.src = bulunanUrun.resim;
            detayResimDOM.alt = bulunanUrun.ad;
            detayAdDOM.textContent = bulunanUrun.ad;
            detayFiyatDOM.textContent = bulunanUrun.fiyat + " TL";
            detayAciklamaDOM.textContent = bulunanUrun.aciklama;
            detaySepetBtnDOM.dataset.id = bulunanUrun.id;
        } else {
            detayAdDOM.textContent = "Ürün bulunamadı!";
            detaySepetBtnDOM.classList.add("gizli");
        }
    }

    // 3. Sepete Ekleme İşlemleri (Tüm "Sepete Ekle" butonlarını dinliyoruz)
    const sepetButonlari = document.querySelectorAll(".sepet-ekle-btn");
    sepetButonlari.forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.dataset.id;
            const secilenUrun = urunler.find(u => u.id === id);
            
            if (secilenUrun) {
                // LocalStorage'dan sepeti al, yoksa boş dizi oluştur
                let sepet = JSON.parse(localStorage.getItem("f1_sepet")) || [];
                
                // Sepette aynı ürün var mı kontrol et
                const sepettekiUrun = sepet.find(u => u.id === id);
                if (sepettekiUrun) {
                    sepettekiUrun.adet += 1;
                } else {
                    sepet.push({ ...secilenUrun, adet: 1 });
                }
                
                localStorage.setItem("f1_sepet", JSON.stringify(sepet));
                alert(secilenUrun.ad + " sepete eklendi!");
            }
        });
    });

    // 4. Sepet Sayfası İşlemleri
    const sepetTabloGövdesi = document.getElementById("sepet-tablo-body");
    if (sepetTabloGövdesi) {
        sepetiEkranaYazdir();

        // Sepeti Sil Butonu
        const sepetiSilBtn = document.getElementById("sepeti-sil");
        if (sepetiSilBtn) {
            sepetiSilBtn.addEventListener("click", () => {
                localStorage.removeItem("f1_sepet");
                sepetiEkranaYazdir();
            });
        }

        // Sepeti Hesapla Butonu
        const sepetiHesaplaBtn = document.getElementById("sepeti-hesapla");
        if (sepetiHesaplaBtn) {
            sepetiHesaplaBtn.addEventListener("click", () => {
                const sepet = JSON.parse(localStorage.getItem("f1_sepet")) || [];
                const toplam = sepet.reduce((acc, urun) => acc + (urun.fiyat * urun.adet), 0);
                alert("Sepet Toplamı: " + toplam + " TL");
            });
        }

        // Siparişi Tamamla Butonu
        const siparisTamamlaBtn = document.getElementById("siparis-tamamla");
        if (siparisTamamlaBtn) {
            siparisTamamlaBtn.addEventListener("click", () => {
                const sepet = JSON.parse(localStorage.getItem("f1_sepet")) || [];
                if (sepet.length === 0) {
                    alert("Sepetiniz boş!");
                } else {
                    alert("Siparişiniz başarıyla alındı. Teşekkürler!");
                    localStorage.removeItem("f1_sepet");
                    sepetiEkranaYazdir();
                }
            });
        }
    }

    // 5. Quiz İşlemleri (Ana Sayfa)
    const quizHesaplaBtn = document.getElementById("quiz-hesapla");
    if (quizHesaplaBtn) {
        quizHesaplaBtn.addEventListener("click", () => {
            let dogruSayisi = 0;
            
            // Soru 1 kontrolü (Doğru: audi)
            const soru1 = document.querySelector('input[name="soru1"]:checked');
            if (soru1 && soru1.value === "audi") dogruSayisi++;

            // Soru 2 kontrolü (Doğru: hibrit)
            const soru2 = document.querySelector('input[name="soru2"]:checked');
            if (soru2 && soru2.value === "hibrit") dogruSayisi++;

            // Soru 3 kontrolü (Doğru: madrid)
            const soru3 = document.querySelector('input[name="soru3"]:checked');
            if (soru3 && soru3.value === "madrid") dogruSayisi++;

            const quizSonucDOM = document.getElementById("quiz-sonuc");
            quizSonucDOM.textContent = `3 sorudan ${dogruSayisi} tanesini doğru bildiniz!`;
        });
    }

    // 6. İletişim Formu Engelleme (Sayfa yenilenmesini durdurmak için)
    const iletisimFormu = document.getElementById("iletisim-formu");
    if (iletisimFormu) {
        iletisimFormu.addEventListener("submit", function(e) {
            e.preventDefault(); // Formun varsayılan gönderme işlemini durdur
            alert("Mesajınız gönderildi. En kısa sürede dönüş yapılacaktır.");
            this.reset(); // Formu temizle
        });
    }
});

/* Sepeti tabloya yazdıran fonksiyon */
function sepetiEkranaYazdir() {
    const sepetTabloGövdesi = document.getElementById("sepet-tablo-body");
    if (!sepetTabloGövdesi) return;

    let sepet = JSON.parse(localStorage.getItem("f1_sepet")) || [];
    let htmlIcerik = "";

    if (sepet.length === 0) {
        htmlIcerik = "<tr><td colspan='4' class='bos-sepet-mesaj'>Sepetiniz boş.</td></tr>";
    } else {
        sepet.forEach(urun => {
            const toplamFiyat = urun.fiyat * urun.adet;
            htmlIcerik += `
                <tr>
                    <td>${urun.ad}</td>
                    <td>${urun.fiyat} TL</td>
                    <td>${urun.adet}</td>
                    <td>${toplamFiyat} TL</td>
                </tr>
            `;
        });
    }
    
    sepetTabloGövdesi.innerHTML = htmlIcerik;
}
