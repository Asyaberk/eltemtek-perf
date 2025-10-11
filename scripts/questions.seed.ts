import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Question } from '../src/questions/entities/question.entity';

const QUESTIONS = [
  { orderNo: 1, title: 'Genel İletişim Becerisi', description: 'Fikirleri ifade etme ve dinleme kabiliyetine, üretken geri bildirim isteme ve sağlama yeterliliğine ve olumlu, etkili bir iletişim tarzına sahiptir. (Yazılı, sözlü ve dinleme becerilerini dikkate alınız.)' },
  { orderNo: 2, title: 'Sorumluluk Sahibi', description: 'Sorumlulukları yerine getirir, tam güven aşılar, sürekli denetim olmaksızın iyi çalışır.' },
  { orderNo: 3, title: 'Esneklik ve Değişime Açıklık', description: 'İşin yapılması sırasında ihtiyaç duyulan ortam, koşul ve sistemleri geliştirmek amacıyla pozitif yönde farklılaştırabilecek bakış açısına sahiptir; beklenmedik durumlara rahat ve hızlı bir şekilde adapte olur.' },
  { orderNo: 4, title: 'Kurum Kültürüne Uyum', description: 'Stratejik planlama, kurum içi prosedürler, süreçler, değerler ve etik ilkelere uyum sağlar.' },
  { orderNo: 5, title: 'Muhakeme Kabiliyeti', description: 'Mantıklı ve uygun kararlar verir, güvenilir sonuçlara ulaşır; olağandışı durumlarda sağduyulu ve profesyonel davranır.' },
  { orderNo: 6, title: 'Bilgi ve Deneyim', description: 'Pozisyon, politika ve prosedürleri bilir, önemser ve işteki bilgi ile becerileri yeterlidir.' },
  { orderNo: 7, title: 'Problem Çözme', description: 'Sorunları ve nedenlerini belirler, alternatifleri değerlendirir; uygun tavsiye ve kararlar verir.' },
  { orderNo: 8, title: 'Planlama', description: 'Genel iş yükünü verimli bir şekilde tamamlamak için yöntemler ve iş organizasyonu geliştirir ve uygular.' },
  { orderNo: 9, title: 'Detaycılık', description: 'Detaylara dikkat eder, işini titizlikle yapar ve hata olmamasına özen gösterir.' },
  { orderNo: 10, title: 'Sonuç Odaklılık', description: 'Yeteneğini tutarlı biçimde uygular, belirlenen zaman dilimi içinde işi tamamlar ve sonuç elde eder.' },
  { orderNo: 11, title: 'İnisiyatif Alma', description: 'Gerekli durumlarda yönlendirme beklemeden aksiyon alır ve süreçleri ileri taşır.' },
  { orderNo: 12, title: 'Girişkenlik', description: 'Yeni fikirler geliştirir, fırsatları değerlendirir ve hedeflere ulaşmak için aktif çaba gösterir.' },
  { orderNo: 13, title: 'Müzakere', description: 'Farklı görüşleri değerlendirir, ikna kabiliyetiyle uzlaşı ve iş birliği sağlar.' },
  { orderNo: 14, title: 'Sunum Kabiliyeti', description: 'Bilgiyi açık, anlaşılır ve etkileyici bir şekilde aktarır; görsel-işitsel araçları etkin kullanır.' },
  { orderNo: 15, title: 'Analitik Beceri', description: 'Verileri sistematik biçimde analiz eder, neden-sonuç ilişkilerini doğru kurar ve çözüm üretir.' },
  { orderNo: 16, title: 'Yenilikçilik', description: 'Mevcut süreçleri iyileştiren, verimliliği artıran yeni fikir ve yaklaşımlar geliştirir.' },
  { orderNo: 17, title: 'Kendini Geliştirme', description: 'Kişisel ve mesleki gelişimi için sürekli öğrenmeye ve yeni deneyimlere açıktır.' },
  { orderNo: 18, title: 'Hizmet Odaklılık', description: 'İç ve dış müşterilerin ihtiyaçlarını öngörür, çözüm üretir ve memnuniyet sağlar.' },
  { orderNo: 19, title: 'İşi Delege Etme', description: 'Görevleri etkin biçimde devreder, sorumluluk dağılımını dengeler ve ekibini güçlendirir.' },
  { orderNo: 20, title: 'Diğer', description: 'Değerlendiricinin ek olarak önem verdiği veya çalışan tarafından gösterilen farklı bir yetkinliği tanımlar.' },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const questionRepo = dataSource.getRepository(Question);

  for (const q of QUESTIONS) {
    const exists = await questionRepo.findOne({ where: { orderNo: q.orderNo } });
    if (!exists) await questionRepo.save(questionRepo.create(q));
    //öne descriptionu eklemeden seed çalıştırmıştım şimdi null olan yerleri düzeltmek için bunu ekledim
    else {
      exists.title = q.title;
      exists.description = q.description;
      await questionRepo.save(exists);
    }
  }

  console.log('✅ Questions seeded successfully!');
  await app.close();
}

bootstrap();
